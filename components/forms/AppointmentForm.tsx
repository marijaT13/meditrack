"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../ui/SubmitButton"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"
import { create } from "node:domain"
import { Doctors } from "@/constants"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import { FormFieldType } from "./PatientForm"
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.actions"
import { getAppointmentSchema } from "@/lib/validation"
import { Appointment } from "@/types/appwrite.types"

const AppointmentForm = ({
  userId,
  patientId,
  type,
  appointment,
  setOpen
  
}: {userId:string;
    patientId: string;
    type: "create" | "schedule" | "cancel";
    appointment?: Appointment;
    setOpen?: Dispatch<SetStateAction<boolean>>;
    
}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [unavailable, setUnavailable] = useState<Date[]>([]);

    const  AppointmentFormValidation = getAppointmentSchema(type);
        
    const form = useForm<z.infer<typeof AppointmentFormValidation>>({
            resolver: zodResolver(AppointmentFormValidation),
            defaultValues: {
            primaryPhysician: appointment ? appointment.primaryPhysician : " ",
            schedule: appointment ? new Date(appointment.schedule) : new Date(),
            reason: appointment ? appointment.reason : "",
            note: appointment ? appointment.note : "",
            cancellationReason: "", 
            },
        });

  useEffect(() => {
  const fetchUnavailable = async () => {
    const doctor = form.watch("primaryPhysician");
    const schedule = form.watch("schedule"); // user-picked date

    if (!doctor || !schedule) return;

    try {
      const day = new Date(schedule).toISOString().split("T")[0]; // YYYY-MM-DD
      const res = await fetch(
        `/api/appointments/unavailable?doctor=${doctor}&date=${day}`
      );

      if (!res.ok) {
        console.error("API error:", res.status, await res.text());
        return;
      }

      const data = await res.json();
      setUnavailable(data.unavailable.map((t: string) => new Date(t)));
    } catch (err) {
      console.error("Failed to load unavailable slots", err);
    }
  };

  fetchUnavailable();
  }, [form.watch("primaryPhysician"), form.watch("schedule")]);


    const onSubmit = async (
    values: z.infer<typeof AppointmentFormValidation>
  ) => {
    setIsLoading(true);

     let status;
     switch(type){
      case 'schedule':
        status='scheduled';
        break;
      case 'cancel':
        status='cancelled';
        break;
      default:
        status='pending';
     }
     
     try {
      if (type === 'create' && patientId) {
        
        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          status: status as Status,
          note: values.note,
        }
        const appointment = await createAppointment(appointmentData);

        if (appointment) {
          form.reset();
          router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`);
        }
      }else{
        console.log("Updating appointment with values:", values);
        const appointmentToUpdate = {
          userId,
          appointmentId:appointment?.$id!,
          appointment:{
            primaryPhysician: values?.primaryPhysician,
            schedule: new Date(values?.schedule),
            status: status as Status,
            cancellationReason: values?.cancellationReason!,
          },
          type,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
        const updatedAppointment = await updateAppointment(appointmentToUpdate);
        if (updatedAppointment) {
          setOpen && setOpen(false);
          form.reset();
        }
      }
    } catch (error) {
      console.error("Failed to create appointment:", error);
      alert("Не може да се закаже термин, обидете се повторно");
    }
    setIsLoading(false);
  }

  let buttonLabel;
  switch (type) {
    case "cancel":
      buttonLabel = "Откажи термин";
      break;
    case "schedule":
      buttonLabel = "Закажи термин";
      break;
    default:
      buttonLabel = "Поднеси барање";
  }
    return(
       <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
       {type === 'create' && <section className="mb-12 space-y-4">
        <h1 className="header">Креирај нов термин</h1>
        <p className="text-dark-700">Поднеси барање за нов термин.</p>
       </section>}

        {type !=="cancel" &&(
          <>
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="primaryPhysician"
            label="Доктор"
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
                name="schedule"
                label="Датум и време на термин"
                showTimeSelect
                dateFormat="yyyy/MM/dd - h:mm aa"
                minDate={new Date()}
                excludeTimes={unavailable}  
              >
              </CustomFormField>
            
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Причина за термин"
                placeholder="Внеси причина за барање на термин"
              />
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Белешка"
                placeholder="Внеси белешка (опционално)"
              />
            </div>

          </>
        )}
        {type === "cancel" &&(
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Причина за откажување"
            placeholder="Внеси причина за откажување"
          />
        )}
        <SubmitButton isLoading={isLoading} 
        className={`${type === 'cancel' ? 'shad-danger-btn' : 
        'shad-primary-btn'} w-full`}> {buttonLabel} </SubmitButton>               
      </form>
    </Form>
    );      
};

export default AppointmentForm;