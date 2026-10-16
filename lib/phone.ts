import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  getExampleNumber,
  isSupportedCountry,
  parsePhoneNumberFromString,
  validatePhoneNumberLength,
  type CountryCode,
  type PhoneNumber,
} from "libphonenumber-js/max";
import examples from "libphonenumber-js/examples.mobile.json";

// International phone numbers: full numbering-plan metadata ("max" — real number patterns per country, not just
// digit counts), stored as E.164 ("+919876543210"). MCL-CRM-Backend/src/lib/phone.ts applies the same rules with
// the same pinned library version and messages, so the form and the API agree.

export type { CountryCode };

/**
 * Country preselected in phone fields, and used to read saved numbers that have no "+code".
 * MCL is India-based, so "IN". Set NEXT_PUBLIC_DEFAULT_PHONE_COUNTRY to change it (keep it equal to the API's
 * DEFAULT_PHONE_COUNTRY), or to "" for no preselected country.
 */
export const DEFAULT_PHONE_COUNTRY = toCountry(process.env.NEXT_PUBLIC_DEFAULT_PHONE_COUNTRY ?? "IN");

function toCountry(code: string | undefined) {
  const c = code?.trim().toUpperCase();
  return c && isSupportedCountry(c) ? (c as CountryCode) : undefined;
}

export const PHONE_MESSAGES = {
  required: "Enter a phone number.",
  noCountry: "Select a country.",
  incomplete: "This number appears incomplete.",
  badCountryCode: "Please check the country code and number.",
  invalid: "Enter a valid phone number for the selected country.",
  extension: "Enter the number without an extension.",
} as const;

/** Same as the API's check: "+…" numbers carry their own country; digits alone are read as `region`'s. */
export function checkPhone(input: string, region: CountryCode | null = DEFAULT_PHONE_COUNTRY ?? null): { e164: string } | { error: string } {
  const text = input.trim();
  if (!text) return { error: PHONE_MESSAGES.required };
  const country = text.startsWith("+") ? undefined : (region ?? undefined);
  if (!text.startsWith("+") && !country) return { error: PHONE_MESSAGES.noCountry };
  const length = validatePhoneNumberLength(text, country);
  if (length === "TOO_SHORT") return { error: PHONE_MESSAGES.incomplete };
  if (length === "INVALID_COUNTRY") return { error: PHONE_MESSAGES.badCountryCode };
  const number = parsePhoneNumberFromString(text, country);
  if (length || !number?.isValid()) return { error: PHONE_MESSAGES.invalid };
  if (number.ext) return { error: PHONE_MESSAGES.extension }; // E.164 cannot hold it, and it is never dropped silently
  return { e164: number.number };
}

/** Message for a phone field's submitted value ("" or what toE164 produced); undefined when it is fine. */
export function phoneError(value: string, required = false) {
  if (!value.trim()) return required ? PHONE_MESSAGES.required : undefined;
  const result = checkPhone(value, null); // toE164 already applied the selected country
  return "error" in result ? result.error : undefined;
}

const digitsOf = (s: string) => s.replace(/\D/g, "");
// An extension stays in the submitted value so the check can refuse it rather than lose it.
const withExt = (n: PhoneNumber) => (n.ext ? `${n.number} ext. ${n.ext}` : n.number);

/**
 * What the field submits: E.164 when the input can be read as a number (valid or not — the check explains),
 * otherwise "+code" + the typed digits, so the API and the check see the selected country without the code
 * being added twice. Without a country, national digits are returned as typed (the check asks for a country).
 */
export function toE164(text: string, country: CountryCode | undefined) {
  const t = text.trim();
  if (!digitsOf(t)) return "";
  if (t.startsWith("+")) {
    const n = parsePhoneNumberFromString(t);
    return n ? withExt(n) : `+${digitsOf(t)}`;
  }
  if (!country) return digitsOf(t);
  const n = parsePhoneNumberFromString(t, country);
  return n ? withExt(n) : `+${getCountryCallingCode(country)}${digitsOf(t)}`;
}

/** Formats while typing: "+…" text by its own calling code, anything else by the selected country. */
export function formatTyping(text: string, country: CountryCode | undefined) {
  const t = text.replace(/[^\d+()\-.\s]/g, "").trim(); // words around a pasted number ("Call +44 …") would blank it
  return (t.startsWith("+") ? new AsYouType() : new AsYouType(country)).input(t);
}

/** The number grouped as in international format, minus "+code " (shown beside it): "+44 20 7031 3000" → "20 7031 3000". */
const national = (n: PhoneNumber) => n.formatInternational().slice(n.countryCallingCode.length + 2);

/**
 * A complete international number (pasted, or typed with "+" / an international prefix such as "00") is moved
 * into the country picker and shown in national form. Numbers of the selected calling code stay as they are,
 * so the chosen country never jumps between countries that share a code (+1 US/Canada, +44 UK/Jersey…).
 */
export function fromInternational(text: string, country: CountryCode | undefined) {
  const n = parsePhoneNumberFromString(text, country);
  if (!n?.isValid() || !n.country) return null;
  const sameCode = country && !text.trim().startsWith("+") && n.countryCallingCode === getCountryCallingCode(country);
  return sameCode ? null : { country: n.country, text: national(n) };
}

/** On leaving the field: a valid number of the selected country, regrouped like saved numbers are shown. */
export function tidy(text: string, country: CountryCode | undefined) {
  const n = !text.trim().startsWith("+") && country ? parsePhoneNumberFromString(text, country) : undefined;
  return n?.isValid() && n.country ? national(n) : formatTyping(text, country);
}

/** National digits of `text` (international or not), for keeping them when the country is changed. */
export function nationalDigits(text: string) {
  if (!text.trim().startsWith("+")) return digitsOf(text);
  const f = new AsYouType();
  f.input(text);
  const code = f.getCallingCode();
  return digitsOf(text).slice(code?.length ?? 0);
}

/** Country whose flag to show for "+…" text, once the digits identify it. */
export function countryOf(text: string) {
  const f = new AsYouType();
  f.input(text);
  return f.getCountry();
}

/**
 * Splits a saved value for editing. Valid numbers (E.164, or legacy digits of the default country) get their
 * country and national form; anything else is shown exactly as saved and marked unverified — never altered.
 */
export function splitPhone(saved: string | null | undefined): { country?: CountryCode; text: string; unverified: boolean } {
  const s = saved?.trim() ?? "";
  if (!s) return { country: DEFAULT_PHONE_COUNTRY, text: "", unverified: false };
  const n = parsePhoneNumberFromString(s, DEFAULT_PHONE_COUNTRY);
  if (n?.isValid()) return n.country ? { country: n.country, text: national(n), unverified: false } : { text: n.formatInternational(), unverified: false };
  return { country: DEFAULT_PHONE_COUNTRY, text: saved ?? "", unverified: true };
}

/** Saved number for display ("+91 81234 56789"); unreadable legacy values are shown as saved. */
export function formatPhone(saved: string) {
  const n = parsePhoneNumberFromString(saved, DEFAULT_PHONE_COUNTRY);
  return n?.isValid() ? n.formatInternational() : saved;
}

/** Placeholder from the country's example number, e.g. "eg., 81234 56789". */
export function phonePlaceholder(country: CountryCode | undefined) {
  const n = country && getExampleNumber(country, examples);
  return n ? `eg., ${national(n)}` : "eg., +91 81234 56789";
}

export const flag = (country: CountryCode) => String.fromCodePoint(...[...country].map((ch) => 0x1f1a5 + ch.charCodeAt(0)));

// ---------- country list (names from the browser's Intl data; codes from the library — no hand-kept table) ----------
const fold = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

export type Country = { code: CountryCode; name: string; callingCode: string; words: string[] };
export const COUNTRIES: Country[] = getCountries()
  .map((code) => {
    const name = regionNames.of(code) ?? code;
    return { code, name, callingCode: getCountryCallingCode(code), words: fold(name).split(/[^a-z0-9]+/).filter(Boolean) };
  })
  .sort((a, b) => a.name.localeCompare(b.name));
export const countryName = (code: CountryCode) => COUNTRIES.find((c) => c.code === code)?.name ?? code;
export const callingCodeOf = (code: CountryCode) => getCountryCallingCode(code);

/** Search by name (accent-insensitive, any word), ISO code ("ae") or calling code ("+971", "971"). */
export function searchCountries(query: string) {
  const q = fold(query.trim()).replace(/^\+/, "");
  if (!q) return COUNTRIES;
  const ranked: [number, Country][] = [];
  for (const c of COUNTRIES) {
    const rank = /^\d+$/.test(q)
      ? c.callingCode === q ? 0 : c.callingCode.startsWith(q) ? 1 : -1
      : c.code.toLowerCase() === q ? 0 : fold(c.name).startsWith(q) ? 1 : c.words.some((w) => w.startsWith(q)) ? 2 : fold(c.name).includes(q) ? 3 : -1;
    if (rank >= 0) ranked.push([rank, c]);
  }
  return ranked.sort((a, b) => a[0] - b[0] || a[1].name.localeCompare(b[1].name)).map(([, c]) => c);
}
