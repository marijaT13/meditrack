"use server";

import { Query } from "node-appwrite";
import { DATABASE_ID, DOCTOR_TABLE_ID,databases } from "../appwrite.config";

export async function checkDoctorExists(email: string) {
  const result = await databases.listDocuments(DATABASE_ID!, DOCTOR_TABLE_ID!, [
    Query.equal("email", email),
  ]);

  return result.documents.length > 0 ? result.documents[0] : null;
}