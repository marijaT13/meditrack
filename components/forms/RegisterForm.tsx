"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SelectItem } from "@/components/ui/select";
import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/constants";
import { registerPatient } from "@/lib/actions/patient.actions";
import { PatientFormValidation } from "@/lib/validation";

import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";
import CustomFormField from "../CustomFormField";
import { FormFieldType } from "./PatientForm";
import FileUploader from "../FileUploader";
import SubmitButton from "../ui/SubmitButton";


const RegisterForm = ({ user }: { user: any }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: { 
      name: user.name, 
      email: user.email, 
      phone: user.phone,
      treatmentConsent: false,
    disclosureConsent: false,
    privacyConsent: false,},
  });

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    console.log(
      "Submitting form with values:", values
    );
    try {
      const newPatient = await registerPatient({ ...values, userId: user.$id });
      if (!newPatient) throw new Error("Неуспешна регистрација.");
      
      router.push(`/patients/${user.$id}/new-appointment`);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

   return(
       <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
       <section className="mb-12 space-y-4">
        <h1 className="header">Здраво ✨</h1>
        <p className="text-dark-700">Внеси ги своите податоци и закажи го твојот прв термин.</p>

        {/* NAME */}
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            form={form}
            name="name"
            label="Име и презиме"
            placeholder="Marija Tashevska"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
          />

          {/* EMAIL & PHONE */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              form={form}
              name="email"
              label="Е-пошта"
              placeholder="tashevska123@gmail.com"
              iconSrc="/assets/icons/email.svg"
              iconAlt="email"
            />

            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              form={form}
              name="phone"
              label="Телефонски број"
              placeholder="(+389) 70 456 356"
            />
          </div>

          {/* BirthDate & Gender */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              form={form}              name="birthDate"
              label="Датум на раѓање"
            />

            <CustomFormField
              fieldType={FormFieldType.SKELETON}
              form={form}              name="gender"
              label="Пол"
              renderSkeleton={(field) => (
                <FormControl>
                  <RadioGroup
                    className="flex h-11 gap-2 xl:justify-between"
                    onValueChange={field.onChange}
                    defaultValue={field.value ? String(field.value) : undefined}
                  >
                    {GenderOptions.map((option, i) => (
                      <div key={option + i} className="radio-group items-center">
                        <RadioGroupItem value={option} id={option} className="h-5 w-5 ml-2 border-hidden
                          data-[state=checked]:text-red-500
                        data-[state=checked]:bg-red-500
                        data-[state=unchecked]:bg-red-200"/>
                        <Label htmlFor={option}   
                        className="cursor-pointer px-4 py-2 transition-colors 
                        text-red-200 hover:text-red-300 
                        peer-checked:bg-red-500 peer-checked:text-red-300">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            />
          </div>

          {/* Address & Occupation */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              form={form}              name="address"
              label="Адреса на живеење"
              placeholder="ул. Партизанска бб, Битола"
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              form={form}              name="occupation"
              label="Професија"
              placeholder="Програмер"
            />
          </div>

          {/* Emergency Contact Name & Emergency Contact Number */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              form={form}              name="emergencyContactName"
              label="Име на контакт за итни случаеви"
              placeholder="Име на родител или старател"
            />

            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              form={form}              name="emergencyContactNumber"
              label="Број на контакт за итни случаеви"
              placeholder="(+389) 70 456 356"
            />
          </div>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Медицински информации</h2>
          </div>

          {/* PRIMARY CARE PHYSICIAN */}
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            form={form}            name="primaryPhysician"
            label="Матичен лекар"
            placeholder="Одбери лекар"
          >
            {Doctors.map((doctor, i) => (
              <SelectItem key={doctor.name + i} value={doctor.name}>
                <div className="flex cursor-pointer items-center gap-2">
                  <Image
                    src={doctor.image}
                    width={32}
                    height={32}
                    alt="doctor"
                    className="rounded-full border border-dark-500"
                  />
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>

          {/* INSURANCE & POLICY NUMBER */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              form={form}              name="insuranceProvider"
              label="Осигурување"
              placeholder="Кроација осигурување"
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              form={form}              name="insurancePolicyNumber"
              label="Број на полиса"
              placeholder="ABC123456789"
            />
          </div>

          {/* ALLERGY & CURRENT MEDICATIONS */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              form={form}              name="allergies"
              label="Алергени(ако има)"
              placeholder="Кикиритки, Пеницилин, Прашина, Полен итн."
            />

            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              form={form}              name="currentMedication"
              label="Тековни лекови (ако има)"
              placeholder="Ibuprofen 200mg, Levothyroxine 50mcg"
            />
          </div>

          {/* FAMILY MEDICATION & PAST MEDICATIONS */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              form={form}              name="familyMedicalHistory"
              label="Медицинска историја на фамилијата(ако е релевантна)"
              placeholder="Дијабетес, Хипертензија, Рак итн."
            />

            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              form={form}              name="pastMedicalHistory"
              label="Претходни медицински состојби и интервенции"
              placeholder="Апендектомија, Астма, Хипертензија итн."
            />
          </div>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Идентификација и верификација</h2>
          </div>
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            form={form}            name="identificationNumber"
            label="Матичен број"
            placeholder="0202002415000"
          />
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            form={form}            name="identificationType"
            label="Вид на иденфитикација"
            placeholder="Селектирај тип на идентификација"
          >
            {IdentificationTypes.map((type, i) => (
              <SelectItem key={type + i} value={type}>
                {type}
              </SelectItem>
            ))}
          </CustomFormField>

          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            form={form}            name="identificationDocument"
            label="Скениран документ за идентификација"
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader files={field.value as File[] | undefined} onChange={field.onChange} />
              </FormControl>
            )}
          />
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">
              Согласност и политики
            </h2>
          </div>

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            form={form}            name="treatmentConsent"
            label="Се согласувам да примам лекување за мојата здравствена состојба."
          />

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            form={form}            name="disclosureConsent"
            label="Се согласувам моите здравствени информации да се користат за понатамошни лекувања."
          />

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            form={form}            name="privacyConsent"
            label="Јас ги прегледав и се согласувам со правилата за приватност."
          />
        </section>
        <SubmitButton isLoading={isLoading}>Регистрирај се како пациент</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
