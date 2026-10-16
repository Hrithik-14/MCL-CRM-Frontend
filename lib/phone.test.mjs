// Run: npm test  (Node's built-in runner; strips the TypeScript types of lib/phone.ts — no extra dependencies)
// Numbers come from the library's own per-country example numbers or long-standing libphonenumber test lines
// (Google's +1 650-253-0000 and +44 20 7031 3000) — none are invented.
import assert from "node:assert/strict";
import { test } from "node:test";
import { getCountries, getExampleNumber, parsePhoneNumberFromString } from "libphonenumber-js/max";
import examples from "libphonenumber-js/examples.mobile.json";
import {
  checkPhone, COUNTRIES, DEFAULT_PHONE_COUNTRY, flag, formatPhone, formatTyping, fromInternational, nationalDigits,
  PHONE_MESSAGES as M, phoneError, phonePlaceholder, searchCountries, splitPhone, tidy, toE164,
} from "./phone.ts";

const ex = (c) => getExampleNumber(c, examples);

test("default country is India unless configured", () => assert.equal(DEFAULT_PHONE_COUNTRY, "IN"));

test("every country's example number, typed nationally with that country selected, submits as valid E.164", () => {
  for (const c of getCountries()) {
    const n = ex(c);
    const value = toE164(n.formatNational(), c);
    assert.equal(value, n.number, c);
    assert.equal(phoneError(value), undefined, c);
  }
});

test("the calling code is never added twice; trunk and international prefixes are understood", () => {
  for (const typed of ["81234 56789", "081234 56789", "91 81234 56789", "+91 81234 56789", "0091 81234 56789", "(812) 345-6789"])
    assert.equal(toE164(typed, "IN"), "+918123456789", typed);
  assert.equal(toE164("020 7031 3000", "GB"), "+442070313000");
  assert.equal(toE164("+1 (650) 253-0000", "IN"), "+16502530000"); // "+…" wins over the selected country
});

test("messages match the API for empty, incomplete, unknown code, impossible and missing country", () => {
  assert.equal(phoneError(""), undefined); // optional field left empty
  assert.equal(phoneError("", true), M.required);
  assert.equal(phoneError(toE164("81234", "IN")), M.incomplete);
  assert.equal(phoneError(toE164("+999 1234567", "IN")), M.badCountryCode);
  assert.equal(phoneError(toE164("123 456 7890", "US")), M.invalid); // NANP area codes never start with 1
  assert.equal(phoneError(toE164("81234 56789", undefined)), M.noCountry);
  assert.deepEqual(checkPhone("8123456789"), { e164: "+918123456789" }); // legacy digits → default country, like the API
  assert.equal(phoneError(toE164("+44 20 7031 3000 ext. 12", "IN")), M.extension); // refused, not silently dropped
  assert.equal(phoneError(toE164("020 7031 3000 x12", "GB")), M.extension);
});

test("pasted or typed international numbers move into the country picker; shared codes do not jump", () => {
  assert.deepEqual(fromInternational("+44 (0)20 7031-3000", "IN"), { country: "GB", text: "20 7031 3000" });
  assert.deepEqual(fromInternational("tel:+1-650-253-0000", "IN"), { country: "US", text: "650 253 0000" });
  assert.deepEqual(fromInternational("00 44 20 7031 3000", "IN"), { country: "GB", text: "20 7031 3000" }); // India's 00 prefix
  assert.equal(fromInternational(ex("CA").formatNational(), "US"), null); // +1 stays on the chosen country…
  assert.equal(toE164(ex("CA").formatNational(), "US"), ex("CA").number); // …and is still the right number
  assert.equal(parsePhoneNumberFromString(ex("JE").number).country, "JE"); // +44 shared with GB resolves to Jersey
  assert.equal(fromInternational("+44 20 70", "IN"), null); // incomplete: left as typed
});

test("leaving the field regroups a valid number; anything else is left as typed", () => {
  assert.equal(tidy("2070313000", "GB"), "20 7031 3000");
  assert.equal(tidy("020 7031 3000", "GB"), "20 7031 3000");
  assert.equal(tidy("8123456789", "IN"), "81234 56789");
  assert.equal(tidy("81234", "IN"), formatTyping("81234", "IN"));
});

test("pasted words never blank the digits; stray letters are ignored", () => {
  assert.equal(formatTyping("Call +44 20", "IN"), "+44 20");
  assert.equal(formatTyping("tel:+44 20", "IN"), "+44 20");
  assert.equal(formatTyping("81234a", "IN"), "81234");
});

test("changing country keeps the digits and drops only the old calling code", () => {
  assert.equal(nationalDigits("+44 20 7031 3000"), "2070313000");
  assert.equal(nationalDigits("81234-56789"), "8123456789");
  assert.equal(toE164(nationalDigits("+44 20 7031 3000"), "IN"), "+912070313000");
});

test("saved values: E.164 and legacy digits are split for editing; unreadable ones are shown untouched", () => {
  assert.deepEqual(splitPhone("+442070313000"), { country: "GB", text: "20 7031 3000", unverified: false });
  assert.deepEqual(splitPhone("8123456789"), { country: "IN", text: "81234 56789", unverified: false });
  assert.deepEqual(splitPhone(ex("CA").number), { country: "CA", text: ex("CA").formatInternational().slice(3), unverified: false });
  assert.deepEqual(splitPhone("12345"), { country: "IN", text: "12345", unverified: true });
  assert.deepEqual(splitPhone(null), { country: "IN", text: "", unverified: false });
  assert.equal(formatPhone("+442070313000"), "+44 20 7031 3000");
  assert.equal(formatPhone("12345"), "12345");
});

test("country search: name (any word, accents ignored), ISO code and calling code", () => {
  assert.ok(COUNTRIES.length > 240);
  assert.equal(searchCountries("india")[0].code, "IN");
  assert.equal(searchCountries("emirates")[0].code, "AE");
  assert.equal(searchCountries("ae")[0].code, "AE");
  assert.ok(searchCountries("cote").some((c) => c.code === "CI")); // Côte d’Ivoire
  assert.deepEqual(searchCountries("+971").map((c) => c.code), ["AE"]);
  assert.ok(["US", "CA"].every((c) => searchCountries("1").some((x) => x.code === c)));
  assert.equal(searchCountries("zzzz").length, 0);
  assert.equal(flag("IN"), "🇮🇳");
  assert.equal(phonePlaceholder("IN"), "eg., 81234 56789");
  assert.equal(phonePlaceholder("GB"), `eg., ${ex("GB").formatInternational().slice(4)}`);
});
