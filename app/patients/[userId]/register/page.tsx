import RegisterForm from '@/components/forms/RegisterForm';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { getUser } from '@/lib/actions/patient.actions';

type SearchParamProps = {
  params: {
    userId: string;
  };
};

const Register = async ({params:{userId}}:SearchParamProps) => {
    const user = await getUser(userId);
  console.log("Fetched user:", user);
    return (
        <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image 
            src="/assets/icons/logo-full2.svg"
            height={900}
            width={900}
            alt="MediCall logo"
            className="mb-12 h-12 w-fit"
          />

          <RegisterForm user={user?.user} />
            
            <p className="copyright py-12">
              ©2025 MediCall
            </p>
        </div>
      </section>
      <Image 
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="Register illustration"
        className="side-img max-w-[390px]"
      /> 
    </div>
    );
}
export default Register;