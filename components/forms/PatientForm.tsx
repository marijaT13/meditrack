"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../ui/SubmitButton";
import { UserFormValidation } from "@/lib/validation";
import { createUser } from "@/lib/actions/patient.actions";

export enum FormFieldType {
 INPUT='input',
    TEXTAREA='textarea',
    PHONE_INPUT='phoneInput',
    CHECKBOX='checkbox',
    DATE_PICKER='datePicker',
    SELECT='select',
    SKELETON='skeleton',
}

const PatientForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(UserFormValidation),
    defaultValues: { name: "", email: "", phone: "" },
  });

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      const newUser = await createUser(values); // returns newUser.$id
      const userId = newUser.$id;

      if (newUser) router.push(`/patients/${userId}/register`);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Целосно име и презиме"
          placeholder="Marija Tashevska"
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Е-пошта"
          placeholder="tashevska.marija@uklo.edu.mk"
        />
        <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
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
