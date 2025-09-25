"use client";

import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { getPatient, updatePatient } from "@/lib/actions/patient.actions";
import { PatientFormValidation, ProfileFormValidation, ProfileFormValues } from "@/lib/validation";
import { FormFieldType } from "@/components/forms/PatientForm";
import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/CustomFormField";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";


export default function ProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params); // ✅ unwraps the Promise

  const [patient, setPatient] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileFormValidation),
    defaultValues: {},
  });

  // Load patient once
   useEffect(() => {
    const loadPatient = async () => {
      try {
        const data = await getPatient(userId);
        if (data) {
          setPatient(data);
          form.reset({
            ...patient,
            birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
          });
        }
      } catch (err) {
        console.error("❌ Failed to fetch patient:", err);
      }
    };

    loadPatient();
  }, [userId, form]);

  // Save patient
const onSubmit = async (values: ProfileFormValues) => {
  console.log("📝 Submitting values:", values);

  try {
    setIsSaving(true);

    const updatedPayload = {
      ...patient,   // keep existing values
      ...values,    // overwrite with new form values
       birthDate: values.birthDate
        ? new Date(values.birthDate).toISOString()
        : patient.birthDate,
    };

    console.log("➡️ Final payload to Appwrite:", updatedPayload);

    const updated = await updatePatient(patient.$id, updatedPayload);

    setPatient(updated);
    setIsEditing(false);
    alert("Profile updated!");
  } catch (err) {
    console.error("❌ Failed to update:", err);
    alert("Something went wrong.");
  } finally {
    setIsSaving(false);
  }
};



  if (!patient) {
    return <div className="p-4">Loading patient...</div>;
  }

  // All form fields in one config array
  const fields = [
    { name: "name", label: "Име и презиме", type: FormFieldType.INPUT, placeholder: "John Doe" },
    { name: "email", label: "Е-меил", type: FormFieldType.INPUT, placeholder: "example@email.com" },
    { name: "phone", label: "Телефонски број", type: FormFieldType.PHONE_INPUT, placeholder: "+389xxxxxxxxx" },
    { name: "birthDate", label: "Датум на раѓање", type: FormFieldType.DATE_PICKER },
    { name: "address", label: "Адреса на живеење", type: FormFieldType.INPUT, placeholder: "Enter your address" },
    { name: "primaryPhysician", label: "Матичен лекар", type: FormFieldType.INPUT, placeholder: "Your primary physician" },
    { name: "identificationNumber", label: "Матичен лекар", type: FormFieldType.INPUT, placeholder: "Your identification number" },
    { name: "insuranceProvider", label: "Осигурување", type: FormFieldType.INPUT, placeholder: "Enter your provider" },
  ];

  return (
     <div className="remove-scrollbar mx-auto flex max-w-7xl flex-col space-y-14">
      {/* background circles */}
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-red-600 rounded-full -z-10"></div>
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-blue-600 rounded-full -z-10"></div>

      {/* header */}
      <header className="admin-header flex items-center justify-between">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full2.svg"
            height={32}
            width={162}
            alt="logo"
            className="h-8 w-fit"
          />
        </Link>
      </header>

      {/* main content */}
      <main className="admin-main flex flex-col items-center space-y-10">
        <section className="w-full space-y-4 text-center">
          <Image
            src={"/assets/images/patient-profile.png"}
            alt={patient.name || "User"}
            width={100}
            height={100}
            className="mx-auto rounded-full shadow-md"
          />
          <h1 className="header">Здраво, {patient.name}</h1>
          <p className="text-dark-700">{patient.email}</p>
          <p className="text-dark-700">{patient.phone}</p>
        </section>

        {/* profile edit card */}
        <Card className="w-full max-w-2xl shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Профил</CardTitle>
          </CardHeader>
          <CardContent>
            {!isEditing ? (
              <div className="space-y-3">
                <p><strong>Име и презиме:</strong> {patient.name}</p>
                <p><strong>Е-меил:</strong> {patient.email}</p>
                <p><strong>Телефонски број:</strong> {patient.phone}</p>
                <p><strong>Дата на раѓање:</strong> {patient.birthDate ? new Date(patient.birthDate).toLocaleDateString() : "Not set"}</p>
                <p><strong>Адреса на живеење:</strong> {patient.address}</p>
                <p><strong>Пол:</strong> {patient.gender}</p>
                <p><strong>Матичен лекар:</strong> {patient.primaryPhysician}</p>
                <p><strong>Матичен број:</strong> {patient.identificationNumber}</p>
                <p><strong>Осигурување:</strong> {patient.insuranceProvider}</p>

                <Button
                onClick={() => {
                    form.reset({
                    ...patient,
                    birthDate: patient.birthDate ? new Date(patient.birthDate) : undefined,
                
                });
                    setIsEditing(true);
                }}
                className="shad-primary-btn mt-4"
                >
                Edit Profile
                </Button>

              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {fields.map((f) => (
                    <CustomFormField
                      key={f.name}
                      fieldType={f.type}
                      control={form.control}
                      name={f.name as keyof ProfileFormValues}
                      label={f.label}
                      placeholder={f.placeholder}
                    />
                  ))}

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={isSaving}
                      className={`shad-primary-btn px-4 py-2 rounded ${isSaving ? "bg-gray-400" : "bg-blue-500 text-white"}`}
                    >
                      {isSaving ? "Saving..." : "Save Profile"}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        form.reset({
                          ...patient,
                          birthDate: patient.birthDate ? new Date(patient.birthDate) : undefined,
                        });
                        setIsEditing(false);
                      }}
                      className="shad-secondary-btn"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}