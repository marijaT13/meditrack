import * as sdk from 'node-appwrite';
export const {
    NEXT_PUBLIC_APPWRITE_PROJECT_ID,
    API_KEY,
    DATABASE_ID,
    PATIENT_TABLE_ID,
    APPOINTMENT_TABLE_ID,
    DOCTOR_TABLE_ID,
    NEXT_PUBLIC_BUCKET_ID,
    NEXT_PUBLIC_APPWRITE_ENDPOINT
  } = process.env;

const client = new sdk.Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) 
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!) 
  .setKey(process.env.API_KEY!); 

export const databases = new sdk.Databases(client);
export const users = new sdk.Users(client);
export const messaging = new sdk.Messaging(client);
export const storage = new sdk.Storage(client);