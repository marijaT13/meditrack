import Image from "next/image";
import { redirect } from "next/navigation";

import RegisterForm from "@/components/forms/RegisterForm";
import { getPatient, getUser } from "@/lib/actions/patient.actions";

type SearchParamProps = {
  params: { userId: string };
};

const RegisterPage = async ({ params }: SearchParamProps) => {
  const userId = params.userId;

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
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image
            src="/assets/icons/logo-full2.svg"
            height={1000}
            width={1000}
            alt="MediCall Logo"
            className="mb-12 h-10 w-fit"
          />

          {/* Pass user object to the form */}
          <RegisterForm user={user} />

          <p className="copyright py-12">© 2025 MediCall</p>
        </div>
      </section>

      <Image
        src="/assets/images/register-img.png"
        height={500}
        width={500}
        alt="Register Illustration"
        className="side-img max-w-[30%] mr-11"
      />
    </div>
  );
};

export default RegisterPage;
