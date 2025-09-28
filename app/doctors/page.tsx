import Image from "next/image";
import DoctorsForm from "@/components/forms/DoctorsForm";

export default function DoctorsPage() {
  return (
    <div className="flex h-screen max-h-screen">
      
      <div className="relative w-1/2 hidden md:flex items-center justify-center">
        <Image
          src="/assets/images/doctors-page.png"
          alt="Doctors illustration"
          width={400}
          height={400}
          className="w-3/4 h-auto"
        />
      </div>

      
      <section className="flex w-full md:w-1/2 items-center justify-center p-6">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-green-500 rounded-full -z-10"></div>
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-green-600 rounded-full -z-10"></div>

        <div className="max-w-[400px] w-full space-y-6">
          <Image
            src="/assets/icons/logo-full2.svg"
            height={48}
            width={180}
            alt="MediTrack logo"
            className="mb-4 "
          />
          <p className="text-dark-700">
           Најавете се тука.
          </p>

          <DoctorsForm />

          <p className="text-center text-sm text-gray-500 mt-4">
            ©2025 МediTrack
          </p>
        </div>
      </section>
    </div>
  );
}
