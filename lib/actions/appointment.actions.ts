"use server";

import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";

import { Appointment } from "@/types/appwrite.types";

import {
  account,
  APPOINTMENT_TABLE_ID,
      
  DATABASE_ID,
  databases,
  DOCTOR_TABLE_ID,
  messaging,
  PATIENT_TABLE_ID,
} from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import { parse } from "path";
import { Doctors } from "@/constants";
import { Account } from "appwrite";

//  CREATE APPOINTMENT
export const createAppointment = async (
  appointment: CreateAppointmentParams
) => {
  try {
    // 🔒 1. Check if this doctor already has an appointment at the same time
    const existing = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_TABLE_ID!,
      [
        Query.equal("primaryPhysician", appointment.primaryPhysician),
        Query.equal("schedule", new Date(appointment.schedule).toISOString()),
        Query.contains("status", ["pending", "scheduled"]), // only active slots
      ]
    );

    if (existing.documents.length > 0) {
      throw new Error("This time slot is already booked.");
    }

    // 🆕 2. Create the appointment
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_TABLE_ID!,
      ID.unique(),
      {
        ...appointment,
        schedule: new Date(appointment.schedule).toISOString(), // ensure ISO string
      }
    );

    revalidatePath("/admin");

    return parseStringify(newAppointment);
  } catch (error) {
    console.error("An error occurred while creating a new appointment:", error);
    throw error;
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
        throw new Error("Терминот не постои.");
      }
      const smsMessage = `
      Здраво ${appointment.patient.name} 
      ${type ==='schedule' ? `Вашиот термин е закажан за ${formatDateTime(appointment.schedule!).dateTime } со Др. ${appointment.primaryPhysician}. Ве молиме бидете точни.`
      :`Вашиот термин е откажан бидејќи: ${appointment.cancellationReason}`
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
//appointment picker
export async function getBookedSlotsForDay(date: Date, doctor: string) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const res = await databases.listDocuments(
    DATABASE_ID!,
    APPOINTMENT_TABLE_ID!,
    [
      Query.equal("primaryPhysician", doctor),
      Query.greaterThanEqual("schedule", startOfDay.toISOString()),
      Query.lessThanEqual("schedule", endOfDay.toISOString())
    ]
  );

  return res.documents.map((doc) => new Date(doc.schedule));
}
//get appointments by patient
export async function getAppointmentsByPatient(userId: string) {
  try {
    const res = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_TABLE_ID!,
      [Query.equal("userId", userId)]
    );

    console.log("getAppointmentsByPatient:", res.documents);
    return res.documents;
  } catch (error) {
    console.error("getAppointmentsByPatient failed:", error);
    return [];
  }
}