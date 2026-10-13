import { z } from "zod";

export const PHONE_RULE = "Numri duhet të fillojë me 06 dhe të ketë 10 numra (p.sh. 0691234567).";
export const EMAIL_RULE = "Shkruani një email të vlefshëm, p.sh. emri@gmail.com.";
export const NAME_RULE = "Shkruani emrin dhe mbiemrin.";
export const SERVICE_RULE = "Zgjidhni ose shkruani shërbimin (p.sh. pastrim, mbushje, ortodonci, implant).";

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;

export const firstNameSchema = z.string().trim().min(2, NAME_RULE).max(60);
export const lastNameSchema = z.string().trim().min(2, NAME_RULE).max(60);
export const phoneSchema = z
  .string()
  .transform((v) => v.replace(/[\s\-()]/g, ""))
  .refine((v) => /^06\d{8}$/.test(v), PHONE_RULE);
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .refine((v) => EMAIL_RE.test(v), EMAIL_RULE);
export const serviceSchema = z.string().trim().min(3, SERVICE_RULE).max(120);

export function isValidPhone(v: string) {
  return /^06\d{8}$/.test(v.replace(/[\s\-()]/g, ""));
}
export function isValidEmail(v: string) {
  return EMAIL_RE.test(v.trim());
}
export function splitFullName(full: string) {
  const parts = full.trim().split(/\s+/);
  return { firstName: parts[0] ?? "", lastName: parts.slice(1).join(" ") };
}
