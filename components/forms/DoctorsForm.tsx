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
import { verifyOrCreateDoctor } from "@/lib/actions/doctor.actions";

// Server action

interface DoctorFormValues {
  email: string;
  phone: string;
}

const DoctorForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [adminVerified, setAdminVerified] = useState(false);

  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(DoctorFormValidation),
    defaultValues: { email: "", phone: "" },
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
      setError("You must enter the admin passkey first.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await verifyOrCreateDoctor(values.email, values.phone);
      router.push("/admin");
    } catch (err) {
      console.error(err);
      setError("Failed to verify or register doctor.");
    } finally {
      setIsLoading(false);
    }
  });

  if (!adminVerified) {
    return (
      <p className="text-red-500 text-center mt-8">
        Access denied. Please enter the admin passkey first.
      </p>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6 flex-1">
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
