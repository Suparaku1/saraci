export const BOOKING_TIME_ZONE = "Europe/Tirane";
export const CLINIC_ADMIN_EMAILS = ["orarishpe@gmail.com"];

export function zonedTimeToUtc(localIso: string, timeZone: string): Date {
  const date = new Date(`${localIso}Z`);
  const asLocal = new Date(date.toLocaleString("en-US", { timeZone }));
  return new Date(date.getTime() + date.getTime() - asLocal.getTime());
}

export function normalizeVerification(value: string) {
  return value.trim().toLowerCase().replace(/\s/g, "");
}