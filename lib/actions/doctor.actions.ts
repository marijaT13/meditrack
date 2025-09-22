"use server";

import { databases } from "@/lib/appwrite.config";
import { Query, ID } from "appwrite";

export const verifyOrCreateDoctor = async (email: string, phone: string) => {
  if (!email || !phone) throw new Error("Email and phone are required");
  const databaseId = process.env.DATABASE_ID!;
  const doctorTableId = process.env.DOCTOR_TABLE_ID!;

  if (!databaseId || !doctorTableId) {
    throw new Error("Database ID or Doctor Table ID not defined");
  }
  

  const res = await databases.listDocuments(
    databaseId,
    doctorTableId,
    [Query.equal("email", email), Query.equal("phone", phone)]
  );

  if (res.total > 0) return { exists: true };

  await databases.createDocument(databaseId, doctorTableId, ID.unique(), { email, phone });

  return { exists: false };
};

