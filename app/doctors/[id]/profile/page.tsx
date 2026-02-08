
import LogoutButton from "@/components/LogoutButton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { databases, DATABASE_ID, DOCTOR_TABLE_ID, APPOINTMENT_TABLE_ID, PATIENT_TABLE_ID } from "@/lib/appwrite.config";
import Image from "next/image";
import Link from "next/link";
import { Models } from "appwrite";
import { Query } from "node-appwrite";

interface Props {
  params: Promise<{
    id: string;
  }>;

}

const DoctorProfilePage = async ({ params }: Props) => {
  const { id: doctorId } = await params;

  // Fetch doctor document
  const doctor = await databases.getDocument(
    DATABASE_ID!,
    DOCTOR_TABLE_ID!,
    doctorId
  );
 const appointments = await databases.listDocuments(
     DATABASE_ID!,
     APPOINTMENT_TABLE_ID!, // your appointments collection
     [Query.equal("primaryPhysician", doctor.name)]
   );

   type AppointmentDocument = Models.Document & {
  patient?: string; // patient ID stored in appointment
};

type AppointmentWithPatient = Models.Document & {
  patient: Models.Document | null;
};
    // Fetch related patients
 const appointmentsWithPatients: AppointmentWithPatient[] = await Promise.all(
  (appointments.documents as AppointmentDocument[]).map(async (appt) => {
    try {
      if (!appt.patient) {
        return { ...appt, patient: null };
      }

      const patient = await databases.getDocument(
        DATABASE_ID!,
        PATIENT_TABLE_ID!,
        appt.patient 
      );

      return { ...appt, patient };
    } catch (err: unknown) {
      console.error("Не постои пациент со закажан термин.", appt.patient);
      return { ...appt, patient: null };
    }
  })
);

  
  return (
    <div className="remove-scrollbar mx-auto flex max-w-7xl flex-col space-y-14">
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-green-500 rounded-full -z-10"></div>
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-green-600 rounded-full -z-10"></div>
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

        <Button asChild>
          <Link href="/admin">
          <Image
                  src="/assets/icons/admin-dashboard.svg"
                  width={32}
                  height={32}
                  alt="admin dashboard"
                  />
          </Link>
        </Button>
      </header>

      <main className="admin-main">
        {/* Doctor Info */}
        <section className="w-full space-y-4 text-center">
          <Image
            src={doctor.image}
            alt={doctor.name}
            width={100}
            height={100}
            className="mx-auto rounded-full shadow-md"
          />
          <h1 className="header">Добредојде, {doctor.name}</h1>
          <p className="text-dark-700">{doctor.email}</p>
          <p className="text-dark-700">{doctor.phone}</p>
        </section>

        {/* Patients with Appointments */}
        <section className="grid place-items-center">
          <Card className="w-full max-w-4xl shadow-md rounded-2xl ">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Пациенти со закажани термини ({appointments.total})
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              {appointments.total === 0 ? (
                <p className="text-gray-500">Нема пациенти закажано.</p>
              ) : (
                <Accordion type="single" collapsible>
                  {appointmentsWithPatients.map((appt: any) => (
                    <AccordionItem key={appt.$id} value={appt.$id} className="border-b">
                      <AccordionTrigger>
                        {appt.patient?.name || "Пациент без име"} —{" "}
                         {new Date(appt.schedule).toLocaleDateString()}

                      </AccordionTrigger>
                      <AccordionContent className="space-y-2 text-sm text-gray-400">
                        <p><strong>Име:</strong> {appt.patient?.name || "—"}</p>
                        <p><strong>Е-пошта:</strong> {appt.patient?.email || "—"}</p>
                        <p><strong>Телефон:</strong> {appt.patient?.phone || "—"}</p>
                        <p><strong>Белешка:</strong> {appt.note || "—"}</p>
                        <p><strong>Причина:</strong> {appt.reason}</p>
                    </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
           <LogoutButton/>
        </section>
      </main>
    </div>
  );
};

export default DoctorProfilePage;