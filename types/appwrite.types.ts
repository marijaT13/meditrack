import { Models } from "node-appwrite";

export interface Patient extends Models.Document {
  email: string;
  password: string;
  phone: string;
  name: string;
  userId: string;
  birthDate: Date; // Consider using string if Appwrite expects ISO8601 (e.g. "1999-03-21")
  gender: string;
  address?: string;
  occupation?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  primaryPhysician?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  allergies?: string;
  currentMedication?: string;
  familyMedicalHistory?: string;
  pastMedicalHistory?: string;
  identificationType?: string;
  identificationNumber?: string;
  identificationDocument?: FormData;
  privacyConsent?: boolean;
  treatmentConsent?: boolean;
  disclosureConsent?: boolean;
}

export interface Appointment extends Models.Document {
  patient: Patient;
  schedule: Date;
  status: Status;
  primaryPhysician: string;
  reason: string;
  note: string;
  userId: string;
  cancellationReason: string | null;
}