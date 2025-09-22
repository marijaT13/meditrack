import AppointmentForm from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";
 
export default async function Appointment(props: SearchParamProps) {
  const params = await props.params;

  const {
    userId
  } = params;

  const patient = await getPatient(userId);

  return (
    <div className="flex h-screen max-h-screen">
    
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image 
            src="/assets/icons/logo-full2.svg"
            height={900}
            width={900}
            alt="MediCall logo"
            className="mb-12 h-12 w-fit"
          />
            <AppointmentForm
            type="create"
            userId={userId}
            patientId={patient?.$id} 
               />
          
            <p className="copyright mt-10 py-12">
              ©2025 MediCall
            </p>
          
        </div>
      </section>
      <Image 
        src="/assets/images/appointment-img.png"
        height={1000}
        width={1000}
        alt="Appointment illustration"
        className="side-img max-w-[390px] bg-bottom"
      /> 
    </div>
  );
}
