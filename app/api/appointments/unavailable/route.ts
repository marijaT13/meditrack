
import { NextResponse } from "next/server";
// your Appwrite client
import { Query } from "appwrite";
import { APPOINTMENT_TABLE_ID, DATABASE_ID, databases } from "@/lib/appwrite.config";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const doctorId = searchParams.get("doctor");
  const date = searchParams.get("date");

  if (!doctorId || !date) {
    return NextResponse.json(
      { error: "Missing doctor or date" },
      { status: 400 }
    );
  }

  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const response = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_TABLE_ID!,
      [
        Query.equal("primaryPhysician", doctorId),
        Query.greaterThanEqual("schedule", startOfDay.toISOString()),
        Query.lessThanEqual("schedule", endOfDay.toISOString()),
        Query.contains("status", ["pending", "scheduled"]), // only active ones
      ]
    );

    const unavailable = response.documents.map((doc) => doc.schedule);

    return NextResponse.json({ unavailable });
  } catch (error) {
    console.error("Failed to fetch unavailable slots:", error);
    return NextResponse.json(
      { error: "Could not fetch unavailable slots" },
      { status: 500 }
    );
  }
}
