import Image from "next/image";
import { redirect } from "next/navigation";

import RegisterForm from "@/components/forms/RegisterForm";
import { getPatient, getUser } from "@/lib/actions/patient.actions";

type PageProps = {
 params: Promise<{
    userId: string;
  }>;
};

export default async function RegisterPage({ params }: PageProps) {
  const { userId } = await params;

  // Validate userId length to avoid Appwrite errors
  if (!userId || userId.length > 36) {
    redirect("/"); 
  }

  // Fetch user and patient in parallel
  const [user, patient] = await Promise.all([getUser(userId), getPatient(userId)]);

  // If user doesn't exist → redirect
  if (!user) redirect("/patients");

  // If patient already exists → redirect to new appointment
  if (patient) redirect(`/patients/${userId}/new-appointment`);

  return (
    <div className="flex h-screen max-h-screen">
    
     <div className="absolute -top-16 -left-16 w-40 h-40 rounded-full bg-blue-600 opacity-50 -z-30"></div>
      <div className="absolute top-8 right-8 w-32 h-20 rounded-full bg-red-600 opacity-40 -z-30"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-green-900 -z-40 opacity-60"></div>

      <div
          className="absolute bottom-8 right-16 w-32 h-32 bg-green-600 -z-30"
          style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)", opacity: 0.3 }}
        ></div>
    
        <section className="remove-scrollbar container ">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          
          <Image
            src="/assets/icons/logo-full2.svg"
            height={1000}
            width={1000}
            alt="MediTrack Logo"
            className="mb-12 h-10 w-fit"
          />

          {/* Pass user object to the form */}
          <RegisterForm user={user} />

          <p className="text-center text-sm text-gray-500 py-5">
            ©2025 МediTrack
          </p>
        </div>
      </section>
    </div>
  );
};

