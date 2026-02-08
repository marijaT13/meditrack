"use client";
import PatientForm from "@/components/forms/PatientForm";
import { PasskeyModal } from "@/components/PasskeyModal";
import { UserOtpModal } from "@/components/UserOtpModal";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [showPasskey, setShowPasskey] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpUser, setOtpUser] = useState<{ userId: string; email: string } | null>(null);

  return (
    <div className="flex h-screen max-h-screen">

      <div className="relative w-1/2 hidden md:flex items-center justify-center">
        <Image
          src="/assets/images/onboarding-img2.png"
          alt="Onboarding illustration"
          width={400}
          height={400}
          className="w-full h-auto"
        />
      </div>

      
      <section className="flex w-full md:w-1/2 items-center justify-center p-6">
        <div className="absolute -top-30 -right-32 w-[640px] h-[900px] bg-red-500 rotate-45 -z-10" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>

        <div className="max-w-[400px] w-full space-y-6">
          <Image
            src="/assets/icons/logo-full2.svg"
            height={48}
            width={180}
            alt="MediTrack logo"
            className="mb-4"
          />

          <p className="text-gray-800">
            Добредојде на MediTrack. Започни тука.
          </p>

          <PatientForm
           onExistingUser={(user) => {
            setOtpUser(user);
            setOtpModalOpen(true);
          }}
          />

          <div className="flex justify-between items-center mt-4 text-sm text-gray-800">
            <p>©{new Date().getFullYear()} MediTrack</p>
            <button
              className="text-green-400 hover:underline font-semibold"
              onClick={() => setShowPasskey(true)}
            >
              Доктор
            </button>
          </div>
        </div>
      </section>

      {/* Passkey Modal */}
      {showPasskey && (
        <PasskeyModal
          redirectTo="/doctors"
          onClose={() => setShowPasskey(false)}
        />
      )}

      {otpModalOpen && otpUser && (
      <UserOtpModal
        userId={otpUser.userId}
        email={otpUser.email}
        redirectTo="/profile" // this will become /patients/[id]/new-appointment
        onClose={() => {
          setOtpModalOpen(false);
          setOtpUser(null);
        }}
      />
    )}
    </div>
  );
}
