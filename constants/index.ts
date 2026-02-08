import { Gender } from "@/types";

export const GenderOptions = ["Male", "Female", "Other"];

export const PatientFormDefaultValues = {
  userId: "",
  name: "",
  email: "",
  phone: "",
  birthDate: new Date(Date.now()),
  gender: "Female" as Gender,
  address: "",
  occupation: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  primaryPhysician: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  allergies: "",
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationType: "Birth Certificate",
  identificationNumber: "",
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const IdentificationTypes = [
  "Извод од матично",
  "Студенска легитимација",
  "Здравствена книшка",
  "Возачка дозвола",
  "Лична карта",
  "Пасош",
];

export const Doctors = [
  {
    image: "/assets/images/dr-green.png",
    name: "Живко Попов",
  },
  {
    image: "/assets/images/dr-cameron.png",
    name: "Дијана Стоименова",
  },
  {
    image: "/assets/images/dr-livingston.png",
    name: "Владимир Рендевски",
  },
  {
    image: "/assets/images/dr-peter.png",
    name: "Александар Божиновски",
  },
  {
    image: "/assets/images/dr-powell.png",
    name: "Марија Ровчанин",
  },
  {
    image: "/assets/images/dr-remirez.png",
    name: "Кире Јовановски",
  },
  {
    image: "/assets/images/dr-lee.png",
    name: "Анита Цветковска",
  },
  {
    image: "/assets/images/dr-cruz.png",
    name: "Оливера П.Струмениковска",
  },
  {
    image: "/assets/images/dr-sharma.png",
    name: "Слободан Дамјановски",
  },
];

export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};