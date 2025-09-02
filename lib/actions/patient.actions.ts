"use server"
import { ID, Models, Query } from "node-appwrite"
import { users } from "../appwrite.config"
import { parseStringify } from "../utils";
// import { InputFile } from "node-appwrite";

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

export const getUser = async(userId:string) => {
    try{
        const user = await users.get(userId);
        return parseStringify({ user });
    } catch(error){
        console.log(error);
    }
};

// export const registerPatient = async({identificationDocument, ...patient}: RegisterUserParams) =>{
//     try{
//         let file;
//         if (identificationDocument){
//             const inputFile = InputF()
//         }
//     }catch(error){
//         console.log(error);
//     }
// }

