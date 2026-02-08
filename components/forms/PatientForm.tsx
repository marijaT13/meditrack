"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../ui/SubmitButton";
import { UserFormValidation } from "@/lib/validation";
import { createUser, sendOtp} from "@/lib/actions/patient.actions";

export enum FormFieldType {
 INPUT='input',
    TEXTAREA='textarea',
    PHONE_INPUT='phoneInput',
    CHECKBOX='checkbox',
    DATE_PICKER='datePicker',
    SELECT='select',
    SKELETON='skeleton',
}

const PatientForm = ({ onExistingUser }: { onExistingUser?: (user: { userId: string; email: string }) => void }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
 

  const form = useForm({
    resolver: zodResolver(UserFormValidation),
    defaultValues: { name: "", email: "", phone: "" },
  });

  const onSubmit = async (values: any) => {
  setIsLoading(true);
  try {
    const newUser = await createUser(values); // returns either a new or existing user
    const userId = newUser.$id;

    if (newUser?.$id) {
      // If the user is newly created → go to patient registration
      if (newUser.isNew) {
        router.push(`/patients/${userId}/register`);
      } else {
        await sendOtp(newUser.email);
        onExistingUser?.({userId:newUser.$id, email:newUser.email});
      }
    }
  } catch (error: any) {
    console.error("Error in form submission:", error);
    form.setError("email", {
      type: "manual",
      message: "Настана грешка. Обидете се повторно.",
    });
  } finally {
    setIsLoading(false);
  }
};


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full  mx-auto">
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          form={form}
          name="name"
          label="Целосно име и презиме"
          placeholder="Marija Tashevska"
          
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          form={form}
          name="email"
          label="Е-пошта"
          placeholder="tashevska.marija@uklo.edu.mk"
        />
        <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          form={form}
          name="phone"
          label="Телефонски број"
          placeholder="(389)70123456"
        />
        <SubmitButton isLoading={isLoading}>Започни</SubmitButton>
      </form>
    </Form>
  );
};

export default PatientForm;
