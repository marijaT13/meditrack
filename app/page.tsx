import PatientForm from "@/components/forms/PatientForm";
import PasskeyModal from "@/components/PasskeyModal";
import { SearchParamProps } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default function Home({searchParams}: SearchParamProps) {
  const isAdmin = searchParams.admin === 'true';
  //OTP VERIFICATION

  return (
    <div className="flex h-screen max-h-screen">

      {isAdmin && <PasskeyModal/>}
      
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image 
            src="/assets/icons/logo-full2.svg"
            height={900}
            width={900}
            alt="MediCall logo"
            className="mb-12 h-12 w-fit"
          />

          <PatientForm />

          <div className="text-14-regular m-20 flex justify-between">
            <p className="copyright">
              ©2025 MediCall
            </p>
            <Link href="/?admin=true" className="text-green-500">
              Admin
            </Link>
          </div>
        </div>
      </section>
      <Image 
        src="/assets/images/onboarding-img.png"
        height={1000}
        width={1000}
        alt="Onboarding illustration"
        className="side-img max-w-[50%]"
      /> 
    </div>
  );
}
