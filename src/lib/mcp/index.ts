import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listServices from "./tools/list-services";
import getAvailability from "./tools/get-availability";
import createBooking from "./tools/create-booking";
import cancelBooking from "./tools/cancel-booking";
import listMyAppointments from "./tools/list-my-appointments";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "saraci-dental-mcp",
  title: "Saraci Dental Clinic",
  version: "0.1.0",
  instructions:
    "Tools for Saraci Dental Clinic (Elbasan). Use `list_services` to see offered treatments, `get_availability` to find free 1-hour slots (Mon-Sat 09:00-19:00 Europe/Tirane), `create_booking` to reserve a slot for the signed-in user, `list_my_appointments` to review bookings, and `cancel_booking` to cancel by booking code.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listServices, getAvailability, createBooking, cancelBooking, listMyAppointments],
});
