"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../ui/SubmitButton";
import { DoctorFormValidation } from "@/lib/validation";
import { FormFieldType } from "./PatientForm";
import { decryptKey } from "@/lib/utils";
import { checkDoctorExists } from "@/lib/actions/doctor.actions";
import { account } from "@/lib/appwrite.config";
import z from "zod";

const DoctorLoginValidation = z.object({
  email: z.string().email("Внесете валидна е-пошта"),
});

interface DoctorFormValues {
  email: string;
}

const DoctorForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [adminVerified, setAdminVerified] = useState(false);

  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(DoctorLoginValidation),
    defaultValues: { email: ""},
  });

  // ✅ Check if admin passkey is verified
  useEffect(() => {
    if (typeof window !== "undefined") {
      const encryptedKey = localStorage.getItem("accessKey");
      if (encryptedKey) {
        const accessKey = decryptKey(encryptedKey);
        if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
          setAdminVerified(true);
        }
      }
    }
  }, []);

 const onSubmit = form.handleSubmit(async (values) => {
  if (!adminVerified) {
    setError("Мора да внесете верификациски код.");
    return;
  }

  setIsLoading(true);
  setError("");

  try {
    // 1. Check doctor existence in collection
    const doctor = await checkDoctorExists(values.email);

    if (!doctor) {
      setError("Вие не сте регистрирани како доктор.");
      return;
    }
    localStorage.setItem("doctorId", doctor.$id);
    router.push(`/doctors/${doctor.$id}/profile`)
  } catch (err) {
    console.error(err);
    setError("Невалидни акредитив. Обидете се повторно.");
  } finally {
    setIsLoading(false);
  }
});

  if (!adminVerified) {
    return (
      <p className="text-red-500 text-center mt-8">
        Забранет пристап. Ве молиме внесете го верификацискиот код.
      </p>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6 flex-1">
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Име и презиме"
          placeholder="Живко Попов"
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Е-пошта"
          placeholder="doctor@example.com"
        />
        <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="phone"
          label=" Телефонски број"
          placeholder="(389)70123456"
        />

        {error && <p className="text-red-500">{error}</p>}

        <SubmitButton isLoading={isLoading}>Најави се</SubmitButton>
      </form>
    </Form>
  );
};

export default DoctorForm;
