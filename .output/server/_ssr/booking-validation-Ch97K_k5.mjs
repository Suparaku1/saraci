import { Kt as string } from "../_libs/@ai-sdk/gateway+[...].mjs";
// node_modules/.nitro/vite/services/ssr/assets/booking-validation-Ch97K_k5.js
var PHONE_RULE = "Numri duhet të fillojë me 06 dhe të ketë 10 numra (p.sh. 0691234567).";
var EMAIL_RULE = "Shkruani një email të vlefshëm, p.sh. emri@gmail.com.";
var NAME_RULE = "Shkruani emrin dhe mbiemrin.";
var SERVICE_RULE = "Zgjidhni ose shkruani shërbimin (p.sh. pastrim, mbushje, ortodonci, implant).";
var EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
var firstNameSchema = string().trim().min(2, NAME_RULE).max(60);
var lastNameSchema = string().trim().min(2, NAME_RULE).max(60);
var phoneSchema = string().transform((v) => v.replace(/[\s\-()]/g, "")).refine((v) => /^06\d{8}$/.test(v), PHONE_RULE);
var emailSchema = string().trim().toLowerCase().refine((v) => EMAIL_RE.test(v), EMAIL_RULE);
var serviceSchema = string().trim().min(3, SERVICE_RULE).max(120);
function isValidPhone(v) {
	return /^06\d{8}$/.test(v.replace(/[\s\-()]/g, ""));
}
function isValidEmail(v) {
	return EMAIL_RE.test(v.trim());
}
function splitFullName(full) {
	const parts = full.trim().split(/\s+/);
	return {
		firstName: parts[0] ?? "",
		lastName: parts.slice(1).join(" ")
	};
}
export { emailSchema as a, isValidPhone as c, serviceSchema as d, splitFullName as f, SERVICE_RULE as i, lastNameSchema as l, NAME_RULE as n, firstNameSchema as o, PHONE_RULE as r, isValidEmail as s, EMAIL_RULE as t, phoneSchema as u };
