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
import { useRouter } from "next/navigation";
import { getAppointmentsByPatient } from "@/lib/actions/appointment.actions";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function ProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params);
  const router = useRouter();

  const [patient, setPatient] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

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
          ...data,
          birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
        });
      }
    } catch (err) {
      console.error("Failed to fetch patient:", err);
    }
  };

  loadPatient();
}, [userId, form]);

//appointments
 useEffect(() => {
  const loadAppointments = async () => {
    try {
      setLoadingAppointments(true);
      const res = await getAppointmentsByPatient(userId);
      console.log("Loaded appointments for", userId, res);
      setAppointments(res || []);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    } finally {
      setLoadingAppointments(false);
    }
  };
  loadAppointments();
}, [userId]);


  // Save patient
const onSubmit = async (values: ProfileFormValues) => {
  console.log("Submitting values:", values);

  try {
    setIsSaving(true);

    const updatedPayload = {
      ...patient,   // keep existing values
      ...values,    // overwrite with new form values
       birthDate: values.birthDate
        ? new Date(values.birthDate).toISOString()
        : patient.birthDate,
    };

    console.log("Final payload to Appwrite:", updatedPayload);

    const updated = await updatePatient(patient.$id, updatedPayload);

    setPatient(updated);
    setIsEditing(false);
    alert("Profile updated!");
  } catch (err) {
    console.error("Failed to update:", err);
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

    const upcomingAppointments = appointments.filter(
      (a) => a.status === "scheduled"
    );
    const pendingAppointments = appointments.filter(
      (a) => a.status === "pending"
    );
    const cancelledAppointments = appointments.filter(
      (a) => a.status === "cancelled"
    );

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
        <Button>
          <Link href={`/patients/${userId}/new-appointment`}>
            <Image
            src="/assets/icons/add-appointment.svg"
            alt="schedule appointment"
            height={32}
            width={32}
            />
        </Link>
       </Button>
       
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
          <p className="text-gray-700">{patient.email}</p>
          <p className="text-gray-700">{patient.phone}</p>
        </section>
  
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-7xl">
    {/* Profile card */}
    <Card className="shadow-md rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Профил</CardTitle>
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

            <div className="flex justify-between mt-4">
              <Button
                onClick={() => {
                  form.reset({
                    ...patient,
                    birthDate: patient.birthDate ? new Date(patient.birthDate) : undefined,
                  });
                  setIsEditing(true);
                }}
                className="shad-primary-btn"
              >
                Edit Profile
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  localStorage.removeItem("session");
                  localStorage.removeItem("user");
                  router.push("/");
                }}
                className="shad-danger-btn"
              >
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {fields.map((f) => (
                <CustomFormField
                  key={f.name}
                  fieldType={f.type}
                  form={form}
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
      <div className="space-y-6">
      {/* Upcoming */}
      <Card className="shadow-2xl border rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-green-600">
            Вашите термини
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full space-y-4">
          {/* Upcoming */}
      <AccordionItem value="upcoming">
        <AccordionTrigger className="text-green-600 font-semibold text-lg">
          Закажани термини
        </AccordionTrigger>
        <AccordionContent>
          {upcomingAppointments.length > 0 ? (
            <ul className="space-y-3">
              {upcomingAppointments.map((appt) => (
                <li
                  key={appt.$id}
                  className="p-3 border rounded-lg shadow-sm bg-green-600/80"
                >
                  <p className="font-medium text-gray-200">
                    {new Date(appt.schedule).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-300">
                    Со Др. {appt.primaryPhysician}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Немате закажани термини.</p>
          )}
        </AccordionContent>
      </AccordionItem>
      {/* Pending */}
      <AccordionItem value="pending">
        <AccordionTrigger className="text-yellow-600 font-semibold text-lg">
          Термини во исчекување
        </AccordionTrigger>
        <AccordionContent>
          {pendingAppointments.length > 0 ? (
            <ul className="space-y-3">
              {pendingAppointments.map((appt) => (
                <li
                  key={appt.$id}
                  className="p-3 border rounded-lg shadow-sm bg-yellow-600/80"
                >
                  <p className="font-medium text-gray-200">
                   Барање за {new Date(appt.schedule).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-300">
                    Со Др. {appt.primaryPhysician}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Немате термини во исчекување. </p>
          )}
        </AccordionContent>
      </AccordionItem>
        {/* Cancelled */}
      <AccordionItem value="cancelled">
        <AccordionTrigger className="text-red-500 font-semibold text-lg">
          Откажани термини
        </AccordionTrigger>
        <AccordionContent>
          {cancelledAppointments.length > 0 ? (
            <ul className="space-y-3">
              {cancelledAppointments.map((appt) => (
                <li
                  key={appt.$id}
                  className="p-3 border rounded-lg shadow-sm bg-red-600/80"
                >
                  <p className="font-medium text-gray-200">
                    {new Date(appt.schedule).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-300">
                    Со Др. {appt.primaryPhysician}
                  </p>
                  {appt.cancellationReason && (
                    <p className="text-xs text-red-400 mt-1">
                      Причина: {appt.cancellationReason}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Немате откажани термини.</p>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
        </CardContent>
      </Card>
    </div>
  </div>
</main>
</div>
  );
}