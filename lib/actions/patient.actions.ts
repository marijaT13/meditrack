'use server'
import { ID, Models, Query } from "node-appwrite"
import { DATABASE_ID, databases, NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID, NEXT_PUBLIC_BUCKET_ID, PATIENT_TABLE_ID, storage, users } from "../appwrite.config"
import { parseStringify } from "../utils";
 import { InputFile } from 'node-appwrite/file';
import { CreateUserParams, RegisterUserParams } from "@/types";


export const createUser = async(user:CreateUserParams) => {
    try{
        const newUser = await users.create(
            ID.unique(),
            user.email,
            user.phone,
            undefined,
            user.name
        )
        if (newUser && newUser.$id) {
    const fetchedUser = await getUser(newUser.$id); // ✅ use variable directly
    console.log("Fetched user:", fetchedUser);
} else {
    console.error("newUser.$id is missing");
}
    return parseStringify(newUser);
    } catch(error:any){
        if(error && error?.code === 409){
               const existingUser = await users.list([
                Query.equal('email', [user.email])
            ])
            return existingUser.users[0]
        }
                throw error; // rethrow other errors

    }   
};

export const getUser = async(userId: string) => {
      console.log("getUser called with userId:", userId);
    try{
        const user = await users.get(userId);
        return parseStringify(user);
    } catch(error){
        console.log( "An error occurred while retrieving the user details:",
      error);
    }
};

export const registerPatient = async({identificationDocument, ...patient}: RegisterUserParams) =>{
    try{
        let file;
        if (identificationDocument){
            const inputFile = InputFile.fromBuffer(
                identificationDocument?.get('blobFile') as Blob,
                identificationDocument?.get('fileName') as string
            )
            file = await storage.createFile(NEXT_PUBLIC_BUCKET_ID!, ID.unique(), inputFile);
        }
        const patient = await databases.createDocument(
            DATABASE_ID!,
            PATIENT_TABLE_ID!,
            ID.unique(),
            {
                identificationDocumentId: file?.$id ? file.$id : null,
                identificationDocumentUrl: 
            `${NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${NEXT_PUBLIC_APPWRITE_ENDPOINT}
                /files/${file?.$id}/view?project=${NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
            }
        )
        return parseStringify(patient);
    }catch(error){
        console.log(error);
    }
}

export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_TABLE_ID!,
      [Query.equal("userId", [userId])]
    );

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
  }
};