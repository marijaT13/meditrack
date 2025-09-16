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
        ...patient,
        userId,
        gender: normalizedGender,
        password: "someDefaultOrGeneratedPassword123!",
        identificationDocumentId: file?.$id || null,
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
