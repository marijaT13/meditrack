// app/patients/[userId]/register/page.tsx
import Image from "next/image";
import { redirect } from "next/navigation";

import RegisterForm from "@/components/forms/RegisterForm";
import { getPatient, getUser } from "@/lib/actions/patient.actions";

type SearchParamProps = {
  params: { userId: string };
};

const RegisterPage = async ({ params }: SearchParamProps) => {
  const { userId } = params;

  // Validate userId length to avoid Appwrite errors
  if (!userId || userId.length > 36) {
    redirect("/"); // or show an error page
  }

  // Fetch user and patient in parallel
  const [user, patient] = await Promise.all([getUser(userId), getPatient(userId)]);

  // If user doesn't exist, redirect to initial form or error
  if (!user) {
    redirect("/patients"); // or show error
  }

  // If patient already exists, redirect to their appointment page
  if (patient) {
    redirect(`/patients/${userId}/new-appointment`);
  }

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="MediCall Logo"
            className="mb-12 h-10 w-fit"
          />

          <RegisterForm user={user} />

          <p className="copyright py-12">© 2025 MediCall</p>
        </div>
      </section>

      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="Register Illustration"
        className="side-img max-w-[390px]"
      />
    </div>
  );
};

export default RegisterPage;
