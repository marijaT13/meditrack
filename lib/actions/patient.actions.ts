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
  account,
} from "../appwrite.config";

import { parseStringify } from "../utils";
import { redirect } from "next/dist/server/api-utils";

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
   // Check if a user already exists by email
    const existingUsers = await users.list([Query.equal("email", [user.email])]);

    if (existingUsers.total > 0) {
      const existingUser = existingUsers.users[0];
      return {
        $id: existingUser.$id,
        email: existingUser.email,
        isNew: false, // ⬅️ mark as existing
      };
    }

    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );

     return {
      $id: newUser.$id,
      email: newUser.email,
      isNew: true, // ⬅️ mark as new
    };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
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
    const existing = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_TABLE_ID!,
      [Query.equal("userId", userId)]
    );

    if (existing.total > 0) {
      return parseStringify(existing.documents[0]);
       // return existing patient
    }
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
export const updatePatient = async (id: string, values: any) => {
  try {
    console.log("updatePatient called with:", { id, values });

    const updated = await databases.updateDocument(
      DATABASE_ID!,
      PATIENT_TABLE_ID!,
      id,
      values
    );

    console.log("✅ Patient updated in Appwrite:", updated);
    return updated;
  } catch (error) {
    console.error("Appwrite updatePatient failed:", error);
    throw error;
  }
};

//send OTP via email
export const sendOtp = async (email: string) => {
  try {
    const token = await account.createEmailToken(ID.unique(), email);
    return token; // contains userId, expire time
  } catch (error: any) {
    throw new Error(`Грешка при праќање на код: ${error?.message || error}`);
  }
};
export const verifyOtp = async (userId: string, otp: string) => {
  try {
    const session = await account.createSession(userId, otp);
    return session;
  } catch (error: any) {
    throw new Error(`Грешка при верификација на код: ${error?.message || error}`);
  }
};
