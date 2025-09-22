
import Image from "next/image";
import DoctorsForm from "@/components/forms/DoctorsForm";

export default function DoctorsPage() {
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image
            src="/assets/icons/logo-full2.svg"
            height={900}
            width={900}
            alt="MediCall logo"
            className="mb-8 h-12 w-fit"
          />
          <section className="w-full space-y-4">
            <p className="text-dark-700 mb-8">
              Доктор или администратор? Најавете се тука.
            </p>
          </section>

          {/* Admin/Doctor Login */}
          <DoctorsForm />
          <p className="copyright m-4">
              ©2025 МediTrack
            </p>
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
