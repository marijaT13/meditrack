import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const parseStringify = (value: any) => {
  if (value === undefined) return null; // or {}
  return JSON.parse(JSON.stringify(value));
};
export const convertFileToUrl = (file: File) => URL.createObjectURL(file);