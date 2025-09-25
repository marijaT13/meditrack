import { databases } from "@/lib/appwrite.config";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, phone } = await req.json();

  try {
    // Example: search for patients collection
    const result = await databases.listDocuments(
      process.env.DATABASE_ID!,
      process.env.PATIENT_TABLE_ID!,
      [
        // Queries.OR requires Appwrite's query helpers
      ]
    );

    const patient = result.documents.find(
      (doc) => doc.email === email || doc.phone === phone
    );

    if (!patient) {
      return NextResponse.json({ exists: false });
    }

    return NextResponse.json({ exists: true, patietId: patient.$id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Database query failed" }, { status: 500 });
  }
}
