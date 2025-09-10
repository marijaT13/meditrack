"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../ui/SubmitButton"
import { useState } from "react"
import { UserFormValidation } from "@/lib/validation"

import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"
import { create } from "node:domain"
import { Doctors } from "@/constants"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import { Brackets } from "lucide-react"

export enum FormFieldType{
    INPUT='input',
    TEXTAREA='textarea',
    PHONE_INPUT='phoneInput',
    CHECKBOX='checkbox',
    DATE_PICKER='datePicker',
    SELECT='select',
    SKELETON='skeleton',
}
type UserFormValues = z.infer<typeof UserFormValidation>;

const AppointmentForm = ({
  type, userId, patientId
}: {userId:string;
    patientId: string;
    type: "create" | "schedule" | "cancel";
}
) => {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
        const form = useForm<z.infer<typeof UserFormValidation>>({
            resolver: zodResolver(UserFormValidation),
            defaultValues: {
            name: "",
            email:"",
            phone:"",
            },
        });

    const onSubmit: SubmitHandler<UserFormValues> = async (values) => {
     setIsLoading(true);
    try {
         const userData = {
            name: values.name,
            email: values.email,
            phone: values.phone,
        };
        const newUser = await createUser(userData);
    if (newUser) router.push(`/patients/${newUser.$id}/register`);
        } catch (error) {
        console.log(error);
    }
     setIsLoading(false);
   }
   let buttonLabel; 
   switch(type){
    case 'cancel':
      buttonLabel='Cancel Appointment';
      break;
    case 'create':
      buttonLabel ='Create Appointment';
      break;
    case 'schedule':
      buttonLabel='Schedule Appointment';
      break;
    default:
      break;      
   }
    return(
       <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
       <section className="mb-12 space-y-4">
        <h1 className="header">New Appointment</h1>
        <p className="text-dark-700">Request a new appointment in seconds.</p>
       </section>

        {type !=="cancel" &&(
          <>
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="primaryPhysician"
            label="Doctor"
            placeholder="Select a doctor"
          >
            {Doctors.map((doctor, i) => (
              <SelectItem key={doctor.name + i} value={doctor.name}>
                <div className="flex cursor-pointer items-center gap-2">
                  <Image
                    src={doctor.image}
                    width={32}
                    height={32}
                    alt="doctor"
                    className="rounded-full border border-dark-500"
                  />
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>
              <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="shedule"
                label="Expected appointment date"
                showTimeSelect
                dateFormat="dd/MM/yyyy - h:mm aa"
              >
              </CustomFormField>
            
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="Reason"
                label="Reason for appointment"
                placeholder="Enter reason for appointment"
              />
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="Notes"
                label="Notes"
                placeholder="Enter additional notes"
              />
            </div>

          </>
        )}
        {type === "cancel" &&(
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Enter reason for cancellation"
          />
        )}
        <SubmitButton isLoading={isLoading} className={`${type === 
          'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}> {buttonLabel}</SubmitButton>               
      </form>
    </Form>
    );      
};
export default AppointmentForm