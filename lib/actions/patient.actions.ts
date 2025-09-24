"use server";

import { ID, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

import {
  NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  DATABASE_ID,
  PATIENT_TABLE_ID,
  NEXT_PUBLIC_BUCKET_ID,
  NEXT_PUBLIC_APPWRITE_ENDPOINT,
  databases,
  storage,
  users,
} from "../appwrite.config";

import { parseStringify } from "../utils";

// ------------------ TYPES ------------------
export type CreateUserParams = {
  name: string;
  email: string;
  phone: string;
};

export type RegisterUserParams = {
  email: string;
  phone: string;
  name: string;
  userId: string;
  birthDate: Date;
  gender: string;
  address?: string;
  occupation?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  primaryPhysician?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  allergies?: string;
  currentMedication?: string;
  familyMedicalHistory?: string;
  pastMedicalHistory?: string;
  identificationType?: string;
  identificationNumber?: string;
  identificationDocument?: FormData;
  privacyConsent?: boolean;
  treatmentConsent?: boolean;
  disclosureConsent?: boolean;

};

// ------------------ CREATE USER ------------------
export const createUser = async (user: CreateUserParams) => {
  try {
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );

    return parseStringify(newUser);
  } catch (error: any) {
    if (error?.code === 409) {
      const existingUser = await users.list([Query.equal("email", [user.email])]);
      return existingUser.users[0];
    }
    console.error("Error creating user:", error);
  }
};

// ------------------ GET USER ------------------
export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);
    return parseStringify(user);
  } catch (error) {
    console.error("Error retrieving user:", error);
  }
};

// ------------------ REGISTER PATIENT ------------------
export const registerPatient = async ({
  identificationDocument,
  userId,
  gender, 
  ...patient
}: any & { userId: string }) => {
  try {
    const normalizedGender = (() => {
      switch (gender?.toLowerCase()) {
        case "male":
          return "male";
        case "female":
          return "female";
        case "others":
        case "other":
          return "others";
        default:
          return null;
      }
    })();

    if (!normalizedGender) throw new Error("Invalid gender value");
    let file;
    if (identificationDocument) {
      const inputFile = InputFile.fromBuffer(
        identificationDocument,
        identificationDocument.name
      );
      file = await storage.createFile(NEXT_PUBLIC_BUCKET_ID!, ID.unique(), inputFile);
    }

    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_TABLE_ID!,
      ID.unique(),
      {
       email: patient.email,
    name: patient.name,
    userId,
    gender: normalizedGender,
        phone: patient.phone,
    birthDate: patient.birthDate, 
    address: patient.address ?? null,
    occupation: patient.occupation ?? null,
    emergencyContactName: patient.emergencyContactName ?? null,
    emergencyContactNumber: patient.emergencyContactNumber ?? null,
    primaryPhysician: patient.primaryPhysician ?? null,
    insuranceProvider: patient.insuranceProvider ?? null,
    insurancePolicyNumber: patient.insurancePolicyNumber ?? null,
    allergies: patient.allergies ?? null,
    currentMedication: patient.currentMedication ?? null,
    familyMedicalHistory: patient.familyMedicalHistory ?? null,
    pastMedicalHistory: patient.pastMedicalHistory ?? null,
    identificationType: patient.identificationType ?? null,
    identificationNumber: patient.identificationNumber ?? null,
    privacyConsent: patient.privacyConsent ?? false,
    treatmentConsent: patient.treatmentConsent ?? false,
    disclosureConsent: patient.disclosureConsent ?? false,
        identificationDocumentUrl: file?.$id
          ? `${NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${NEXT_PUBLIC_BUCKET_ID}/files/${file.$id}/view?project=${NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
          : null,
      }
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.error("Error registering patient:", error);
    throw error; // better to throw so the form can catch
  }
};

// ------------------ GET PATIENT ------------------
export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_TABLE_ID!,
      [Query.equal("userId", userId)]
    );

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.error("Error retrieving patient:", error);
  }
};

 // ------------------ UPDATE PATIENT ------------------
export const updatePatient = async (documentId: string, data: any, file?: File) => {
  try {
    let fileId: string | undefined;

    if (file) {
      const uploaded = await storage.createFile(
        NEXT_PUBLIC_BUCKET_ID!,
        ID.unique(),
        file
      );
      fileId = uploaded.$id;
    }

    // Use the document ID (not userId)
    const updatedPatient = await databases.updateDocument(
      DATABASE_ID!,
      PATIENT_TABLE_ID!,
      documentId,
      {
        ...data,
        identificationDocumentUrl: fileId
          ? `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${NEXT_PUBLIC_BUCKET_ID}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
          : data.identificationDocumentUrl,
      }
    );

    return updatedPatient;
  } catch (err) {
    console.error("Error updating patient:", err);
    throw err; // let form catch it
  }
};