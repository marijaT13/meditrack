"use server";

import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";

import { Appointment } from "@/types/appwrite.types";

import {
  APPOINTMENT_TABLE_ID,
  DATABASE_ID,
  databases,
  messaging,
  PATIENT_TABLE_ID,
} from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import { parse } from "path";

//  CREATE APPOINTMENT
export const createAppointment = async (
  appointment: CreateAppointmentParams
) => {
  try {
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_TABLE_ID!,
      ID.unique(),
      appointment
    );

    revalidatePath("/admin");
    return parseStringify(newAppointment);
  } catch (error) {
    console.error("An error occurred while creating a new appointment:", error);
  }
};

// GET RECENT APPOINTMENTS WITH PATIENT DATA
export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_TABLE_ID!,
      [Query.orderDesc("$createdAt")]
    );

    // 1. Get unique patient IDs from appointments
    const patientIds = Array.from(
      new Set(
        (appointments.documents as any[]).map((a) => a.patient) // assuming "patient" is the relationship field
      )
    );

    // 2. Fetch only the patients that have appointments
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_TABLE_ID!,
      [Query.equal("$id", patientIds)]
    );

    const patientMap = new Map(
      patients.documents.map((p: any) => [p.$id, p])
    );

    // 3. Attach patient objects to appointments
    const enrichedAppointments = (appointments.documents as any[]).map(
      (appointment) => ({
        ...appointment,
        patient: patientMap.get(appointment.patient), // replace ID with full patient object
      })
    );

    // 4. Count statuses
    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = enrichedAppointments.reduce((acc, appointment) => {
      switch (appointment.status) {
        case "scheduled":
          acc.scheduledCount++;
          break;
        case "pending":
          acc.pendingCount++;
          break;
        case "cancelled":
          acc.cancelledCount++;
          break;
      }
      return acc;
    }, initialCounts);

    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: enrichedAppointments,
    };

    return parseStringify(data);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the recent appointments:",
      error
    );
  }
};

// UPDATE APPOINTMENT
export const updateAppointment = async ({
  appointmentId, userId, appointment, type
 }: UpdateAppointmentParams) => {
    try{
      const updatedAppointment = await databases.updateDocument(
        DATABASE_ID!,
        APPOINTMENT_TABLE_ID!,
        appointmentId,
        appointment
      );
      if (!updatedAppointment){
        throw new Error("Appointment not found");
      }
      const smsMessage = `
      Hi, it is MediTrack. 
      ${type ==='schedule' ? `Your appointment is scheduled for ${formatDateTime(appointment.schedule!).dateTime } with Др.${appointment.primaryPhysician}. Please be on time.`
      :`We regret to inform you that your appointment has been cancelled for the following reason: ${appointment.cancellationReason}`
      }
      `
      await sendSMSNotification(userId, smsMessage);

      revalidatePath("/admin");
      return parseStringify(updatedAppointment);
    }catch(error){
      console.log(error)
    }

 }
 //GET APPOINTMENT BY ID
 export const getAppointment = async(appointmentId:string) =>{
  try{
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_TABLE_ID!,
      appointmentId 
    );
  return parseStringify(appointment);
  }catch(error){
    console.error("An error occurred while retrieving the existing patient:", error);
  } 
};
//SMS NOTIFICATION FUNCTION
export const sendSMSNotification = async (userId:string, content:string) =>{
  try{
    const message = await messaging.createSMS(
      ID.unique(),
      content,
      [],
      [userId]
    );
    return parseStringify(message);
  }catch(error){
    console.log(error)
  }
}