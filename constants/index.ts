
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
  "Birth Certificate",
  "Driver's License",
  "Medical Insurance Card/Policy",
  "Military ID Card",
  "National Identity Card",
  "Passport",
  "Resident Alien Card (Green Card)",
  "Social Security Card",
  "State ID Card",
  "Student ID Card",
  "Voter ID Card",
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