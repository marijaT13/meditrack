"use server";

import { Query } from "node-appwrite";
import { DATABASE_ID, DOCTOR_TABLE_ID,databases } from "../appwrite.config";

export async function checkDoctorExists(email: string) {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID!,
      DOCTOR_TABLE_ID!,
      [Query.equal("email", email)]
    );

    if (result.total > 0) {
      return result.documents[0]; // return the doctor document
    }

    return null; // no doctor found
  } catch (error) {
    console.error("Error checking doctor:", error);
    throw new Error("Failed to check doctor existence");
  }
}