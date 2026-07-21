import { z } from "zod";
import { calculateAge } from "../utils/date";
import { GENDER_OPTIONS } from "../types/registration.types";

export const usernameRegex = /^[a-zA-Z0-9_]+$/;
export const mobileRegex = /^[0-9]{10}$/;
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const pincodeRegex = /^[0-9]{4,10}$/;

export function isUsernameFormatValid(value: string): boolean {
  return value.trim().length >= 4 && value.trim().length <= 30 && usernameRegex.test(value.trim());
}

export function isEmailFormatValid(value: string): boolean {
  return emailRegex.test(value.trim());
}

export function isMobileFormatValid(value: string): boolean {
  return mobileRegex.test(value.trim());
}

export const registrationSchema = z
  .object({
    sponsorId: z.string().trim().min(1, "Sponsor ID is required"),

    username: z
      .string()
      .trim()
      .min(4, "Username must be at least 4 characters")
      .max(30, "Username must not exceed 30 characters")
      .regex(usernameRegex, "Only letters, numbers and underscore are allowed"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),

    confirmPassword: z.string().min(1, "Please confirm your password"),

    firstName: z.string().trim().min(1, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),

    email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),

    mobileNumber: z
      .string()
      .trim()
      .min(1, "Mobile number is required")
      .regex(mobileRegex, "Enter a valid 10-digit mobile number"),

    gender: z
      .string()
      .min(1, "Please select a gender")
      .refine((value) => (GENDER_OPTIONS as string[]).includes(value), {
        message: "Please select a valid gender",
      }),

    dob: z
      .string()
      .min(1, "Date of birth is required")
      .refine((value) => calculateAge(value) >= 18, {
        message: "You must be at least 18 years old to register",
      }),

    fatherName: z.string().trim().min(1, "Father's name is required"),

    address1: z.string().trim(),
    address2: z.string().trim(),
    country: z.string().trim(),
    state: z.string().trim(),
    city: z.string().trim(),
    pincode: z
      .string()
      .trim()
      .refine((value) => value === "" || pincodeRegex.test(value), {
        message: "Pincode must be numeric (4-10 digits)",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegistrationSchemaType = z.infer<typeof registrationSchema>;
