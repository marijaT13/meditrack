import * as sdk from 'node-appwrite';
export const {
    PROJECT_ID,
    API_KEY,
    DATABASE_ID,
    PATIENT_TABLE_ID,
    APPOINTMENT_TABLE_ID,
    DOCTOR_TABLE_ID,
    NEXT_PUBLIC_BUCKET_ID,
    NEXT_PUBLIC_ENDPOINT
} = process.env;

const client = new sdk.Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT!) // safe, public
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID!) // safe, public
  .setKey(process.env.APPWRITE_API_KEY!); // secret, keep server-side only


export const databases = new sdk.Databases(client);
export const users = new sdk.Users(client);
export const messaging = new sdk.Messaging(client);
export const storage = new sdk.Storage(client);