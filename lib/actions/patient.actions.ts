'use server'
import { ID, Models, Query } from "node-appwrite"
import { DATABASE_ID, databases, NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID, NEXT_PUBLIC_BUCKET_ID, PATIENT_TABLE_ID, storage, users } from "../appwrite.config"
import { parseStringify } from "../utils";
 import { InputFile } from 'node-appwrite/file';
import { RegisterUserParams } from "@/types";
type CreateUserParams = {
    email: string;
    password?: string;
    phone: string;
    name: string;
};

export const createUser = async(user:CreateUserParams) => {
    try{
        const newUser = await users.create(
            ID.unique(),
            user.email,
            user.phone,
            undefined,
            user.name
        )
        return newUser;
    } catch(error:any){
        if(error && error?.code ===409){
               const existingUser = await users.list([
                Query.equal('email', [user.email])
            ])
            return existingUser.users[0]
        }
    }   
};

export const getUser = async(userID:string) => {
    try{
        const user = await users.get(userID);
        return parseStringify({ user });
    } catch(error){
        console.log(error);
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
                identificationDocumentId: file?.$id || null,
                identificationDocumentUrl: `${NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${NEXT_PUBLIC_APPWRITE_ENDPOINT}
                /files/${file?.$id}/view?project=${NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
            }
        )
        return parseStringify(patient);
    }catch(error){
        console.log(error);
    }
}

