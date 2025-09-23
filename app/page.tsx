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
      
      <section className="remove-scrollbar flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          
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
          
          <div className="text-14-regular m-4 flex justify-between">
            <p className="copyright ">
              ©2025 MediTrack
            </p>
            <button
              className="text-green-600 hover:underline text-3xl-bold"
              onClick={() => setShowPasskey(true)}
            >
              Администратор
            </button>
          </div>
        </div>
      </section>
        <div className="relative w-full h-64 sm:w-1/2 sm:h-full">
        <Image
          src="/assets/images/onboarding-img.png"
          alt="Onboarding illustration"
          width={1000}
          height={1000}
          className="w-full h-auto hidden md:inline-flex"
        />
      </div>
        
    </div>
  );
}
