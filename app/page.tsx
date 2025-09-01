import PatientForm from "@/components/forms/PatientForm";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen max-h-screen">
      {/**OTP verification aka passkeymodal */}
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image 
            src="/assets/icons/logo-full.svg"
            height={900}
            width={900}
            alt="MediCall logo"
            className="mb-12 h-12 w-fit"
          />

          <PatientForm />

          <div className="text-14-regular m-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
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
