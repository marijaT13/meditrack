"use client"
import PatientForm from "@/components/forms/PatientForm";
import { PasskeyModal } from "@/components/PasskeyModal";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
    const [showPasskey, setShowPasskey] = useState(false);


  return (
    <div className="flex h-screen max-h-screen">

      {showPasskey && <PasskeyModal redirectTo="/doctors" onClose={() => setShowPasskey(false)} />}
      
      <section className="remove-scrollbar container my-auto">
        
        <div className="sub-container max-w-[496px]">
          
          <Image 
            src="/assets/icons/logo-full2.svg"
            height={900}
            width={900}
            alt="MediTrack logo"
            className="mb-8 h-12 w-fit"
          />
           <section className='w-full space-y-4'>
                    <p className='text-dark-700 mb-8'>Добредојде на MediTrack. Започни тука.</p>
            </section>
          <PatientForm />
          
          <div className="text-14-regular m-20 flex justify-between">
            <p className="copyright">
              ©2025 MediTrack
            </p>
            <button
              className="text-green-600"
              onClick={() => setShowPasskey(true)}
            >
              Администратор
            </button>
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
