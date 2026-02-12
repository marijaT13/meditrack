'use client'

import {
    FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import {
  FieldValues,
  Path,
  ControllerRenderProps,
  UseFormReturn,
} from "react-hook-form";
import { FormFieldType } from "./forms/PatientForm";
import Image from "next/image";
import 'react-phone-number-input/style.css';
import PhoneInputWithCountrySelect from "react-phone-number-input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";

interface CustomProps<T extends FieldValues = FieldValues> {
  form: UseFormReturn<T> 
  fieldType: FormFieldType
  name: Path<T>
  label?: string
  placeholder?: string
  iconSrc?: string
  iconAlt?: string
  disabled?: boolean
  dateFormat?: string
  showTimeSelect?: boolean
  children?: React.ReactNode
  minDate?: Date
  maxDate?: Date
  excludeDates?: Date[]
  excludeTimes?: Date[]
  renderSkeleton?: (
    field: ControllerRenderProps<T, Path<T>>
  ) => React.ReactNode
}

const RenderField = <T extends FieldValues>({
  field,
  props,
}: {
  field: ControllerRenderProps<T, Path<T>>
  props: CustomProps<T>
}) => {
  const {
    fieldType,
    iconSrc,
    iconAlt,
    placeholder,
    showTimeSelect,
    dateFormat,
    renderSkeleton,
  } = props

 
  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex rounded-md border border-dark-500 bg-white">
          {iconSrc && (
            <Image
              src={iconSrc}
              height={20}
              width={20}
              alt={iconAlt || "icon"}
              className="ml-2"
            />
          )}
          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              className="shad-input border-0 text-black"
            />
          </FormControl>
        </div>
      )

    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea {...field} placeholder={placeholder} className="shad-textarea bg-white text-black" />
        </FormControl>
      );

    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInputWithCountrySelect
            defaultCountry="MK"
            international
            withCountryCallingCode
            value={field.value}
            onChange={field.onChange}
            placeholder={placeholder}
            className="input-phone text-black bg-white"
          />
        </FormControl>
      );

    case FormFieldType.DATE_PICKER:
      return (
        <div className="flex rounded-md border border-dark-500 bg-white">
          <Image
            src="/assets/icons/calendar.svg"
            height={20}
            width={20}
            alt="calendar"
            className="ml-2"
          />
          <FormControl>
            <DatePicker
              selected={field.value}
              onChange={field.onChange}
              dateFormat={dateFormat ?? "yyyy/MM/dd"}
              showTimeSelect={showTimeSelect}
              wrapperClassName="date-picker"
              minDate={props.minDate}
              maxDate={props.maxDate}
              excludeDates={props.excludeDates}
              excludeTimes={props.excludeTimes}
            />
          </FormControl>
        </div>
      );
        case FormFieldType.SKELETON:
    return renderSkeleton ? renderSkeleton(field) : null;
        
    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger className="shad-select-trigger">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="shad-select-content text-black">
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      );

    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-4">
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            {props.label && <label className="checkbox-label">{props.label}</label>}
          </div>
        </FormControl>
      );

    default:
      return null;
  }
}
const CustomFormField = <T extends FieldValues>(
  props: CustomProps<T>
) => {
  const { form, fieldType, name, label } = props

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full flex-1 ">
          {fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel>{label}</FormLabel>
          )}

          <RenderField<T> field={field} props={props} />

          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  )
}

export default CustomFormField;