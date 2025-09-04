'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../ui/SubmitButton"
import { useState } from "react"
import { PatientFormValidation, UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser, registerPatient } from "@/lib/actions/patient.actions"
import {FormFieldType} from "./PatientForm"
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"

import { SelectItem } from "../ui/select"
import Image from "next/image"
import {FileUploader} from "../FileUploader"

interface AppwriteUser {
  $id: string
  $createdAt: string
  $updatedAt: string
  email: string
  name?: string
}


type PatientFormValues = z.infer<typeof PatientFormValidation>;

const RegisterForm = ({user}:{user: AppwriteUser}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

 const form = useForm<PatientFormValues>({
  resolver: zodResolver(PatientFormValidation),
  defaultValues: {
    ...PatientFormDefaultValues,
    name: "",
    email: "",
    phone: "",
    
  },
});

    const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    setIsLoading(true);

  try {
    // 1️⃣ Create the user (if not already created)
    const newUser = await createUser({
      email: values.email,
      phone: values.phone,
      name: values.name,
    });

    if (!newUser || !newUser.$id) {
      throw new Error("User creation failed or $id is missing");
    }

    console.log("New user created:", newUser);

    // 2️⃣ Prepare file data
    let formData: FormData | undefined;
    if (values.identificationDocument && values.identificationDocument.length > 0) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });

      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.identificationDocument[0].name);
    }

    // 3️⃣ Register patient
    const patientData = {
      ...values,
      userId: newUser.$id, // ✅ attach actual user ID
      birthDate: new Date(values.birthDate),
      identificationDocument: formData,
    };

    //@ts-ignore
    const newPatient = await registerPatient(patientData);

    console.log("Patient registered:", newPatient);

    if (newPatient) {
      router.push(`/patients/${newUser.$id}/new-appointment`);
    }

  } catch (error) {
    console.error("Error submitting form:", error);
  } finally {
    setIsLoading(false);
  }
};
    return(
       <Form {...form}>
         <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 space-y-12"
      >
       <section className="space-y-4">
        <h1 className="header">Welcome 👋</h1>
        <p className="text-dark-700">Tell us more about yourself.</p>
       </section>

        <section className="space-y-6">
         <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal information</h2>
         </div>
       </section>

        <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            label="Full Name"
            placeholder="Marija Tashevska"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
        />
        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Email"
                placeholder="tashevska.marija@uklo.edu.mk"
                iconSrc="/assets/icons/email.svg"
                iconAlt="user"
            />    
            <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="phone"
                label="Phone Number"
                placeholder="(389)70123456"
            />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="birthDate"
                label="Date of Birth"
            />    
            <CustomFormField
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                name="gender"
                label="Gender"
                renderSkeleton={(field) =>
                    <FormControl>
                        <RadioGroup 
                        className="flex h-11 gap-3 xl:justify-between"
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                            {GenderOptions.map((option) => (
                                <div key={option}
                                className="radio-group">
                                    <RadioGroupItem value={option} id={option}/>
                                    <Label htmlFor={option} className="cursor-pointer">{option}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </FormControl> 
                }
            />
        </div>

       <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="address"
                label="Address"
                placeholder="ul. Partizanska, bb, Bitola" 
        />  
        <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="occupation"
                label="Occupation"
                placeholder="Software Engineer"      
        />  
       </div>

       <div className="flex flex-col gap-6 xl:flex-row">
         <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="emergencyContactName"
                label="Emergency Contact Name"
                placeholder="Guardian's Name" 
        />  
        <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="emergencyContactNumber"
                label="Emergency Contact Number"
                placeholder="(389)70/123-456"      
        />  
       </div>

        <section className="space-y-6">
         <div className="mb-9 space-y-1">
            <h2 className="sub-header">
                Medical information</h2>
         </div>
       </section> 

       <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="primaryPhysician"
            label="Primary Physician"
            placeholder="Select a physician"
        >
            {Doctors.map((doctor) => (
                <SelectItem key={doctor.name} 
                value={doctor.name}>
                    <div className="flex cursor-pointer items-center gap-2">
                    <Image 
                    src={doctor.image}
                    width={32}
                    height={32}
                    alt="doctor.name"
                    className="rounded-full border border-dark-500"
                    />
                    <p>{doctor.name}</p>
                    </div>
                </SelectItem>
            ))}
        </CustomFormField>    

       <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insuranceProvider"
            label="Insurance Provider"
            placeholder="Kroacija Osiguruvanje" 
        />  
        <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insurancePolicyNumber"
            label="Insurance Policy Number"
            placeholder="ABC123456789"      
        />  
       </div>
        
       <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="allergies"
            label="Allergies (if any)"
            placeholder="Polleen, Dust, Penicillin etc." 
        />  
        <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="currentMedications"
            label="Current medication (if any)"
            placeholder="Aspirin, Ibuprofen 200mg, Paracetamol 500mg etc."      
        />  
       </div>

        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="familyMedicalHistory"
                label="Family Medical History"
                placeholder="Mother: Diabetes, Father: Hypertension etc."
            />  
            <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="pastMedicalHistory"
                label="Past Medical History"
                placeholder="Surgeries, Chronic illnesses, Major injuries etc."      
            />  
       </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verfication</h2>
          </div>

          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="identificationType"
            label="Identification Type"
            placeholder="Select identification type"
          >
            {IdentificationTypes.map((type, i) => (
              <SelectItem key={type + i} value={type}>
                {type}
              </SelectItem>
            ))}
          </CustomFormField>

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="identificationNumber"
            label="Identification Number"
            placeholder="123456789"
          />

          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="identificationDocument"
            label="Scanned Copy of Identification Document"
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader files={field.value} onChange={field.onChange} />
              </FormControl>
            )}
          />
        </section>

        <section className="space-y-6">
         <div className="mb-9 space-y-1">
            <h2 className="sub-header">
                Consent and Privacy
            </h2>
         </div>
       </section> 
        <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="treatmentConsent"
            label="I consent to treatment."
        />
        <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="disclosureConsent"
            label="I consent to disclosure of information."
        />
        <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="privacyConsent"
            label="I consent to Privacy Policies."
        />


        <SubmitButton isLoading={isLoading}> Get Started</SubmitButton>               
      </form>
    </Form>
    );      
};
export default RegisterForm