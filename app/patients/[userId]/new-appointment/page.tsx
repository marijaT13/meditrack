import AppointmentForm from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";

export default async function Appointment(props: SearchParamProps) {
  const params = await props.params;
  const { userId } = params;
  const patient = await getPatient(userId);

  return (
    <div className="flex flex-col md:flex-row h-screen max-h-screen">
      {/* Left side: Form */}
      <section className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="max-w-[600px] w-full space-y-6">
          <Image
            src="/assets/icons/logo-full2.svg"
            height={48}
            width={180}
            alt="MediTrack logo"
            className="mb-6"
          />
          <AppointmentForm
            type="create"
            userId={userId}
            patientId={patient?.$id}
          />
          <p className="text-center text-sm text-gray-500 mt-4">
            ©2025 МediTrack
          </p>
        </div>
      </section>

      {/* Right side: Image */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center">
        <Image
          src="/assets/images/new-appointment.png"
          height={800}
          width={800}
          alt="Appointment illustration"
          className="w-full h-auto object-contain"
        />
      </div>
    </div>
  );
}
