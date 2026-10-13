// Mock data for the DTDC / International Rate Calculator (Figma 1:6260). Frontend only.
export type DocType = "DOX" | "NDOX";

export type Calc = {
  id: number;
  date: string;
  doc: DocType;
  country: string;
  weight: string;
  rates: string;
  tariff: string;
};

export const DOC_TYPES: DocType[] = ["DOX", "NDOX"];
export const COUNTRIES = ["United States Of America", "United Kingdom", "Germany"];

// Courier Rate Comparison: [label, DHL, FEDEX, DTDC - WWE] (Figma typos kept: "4.010", "Margene")
export const RATE_HEAD = ["Rate Details", "DHL", "FEDEX", "DTDC - WWE"];
export const RATE_ROWS = [
  ["Fuel Surcharge (FSC)*", "27.75 %", "29.00 %", "36.00 %"],
  ["GST", "18 %", "18 %", "18 %"],
  ["TS Rate", "₹ 3,630", "₹ 3,510", "₹ 4.010"],
  ["CP Margene %", "15 %", "15 %", "15 %"],
];
export const RATE_TOTAL = ["Tariff", "₹ 4,174", "₹ 4,044", "₹ 4,611"];

export const BREAKDOWN_HEAD = ["Component", "Rate / Value", "Amount"];
export const BREAKDOWN_ROWS = [
  ["Base TS Rate", "-----", "3,516"],
  ["GST", "15 %", "526"],
  ["TS Rate", "₹ 29.00", "1,020"],
  ["CP Margene %", "18 %", "758"],
];
export const BREAKDOWN_TOTAL = ["Total Tariff", "", "₹ 4,044"];

export const RATE_CHART_REF = "DHL: 22 Jan 2024   I   FedEx: 31 Dec 2023   I   WWE: 22 Jan 2024";

export const RECENT_HEAD = ["Date / Time", "Document Type", "Country", "Weight (kg)", "Rates", "Tarif", "Action"];
export const RECENT_CALCS: Calc[] = [
  { id: 1, date: "22 Apr 2025, 10:30 AM", doc: "DOX", country: "United States Of America", weight: "1.5", rates: "DHL / FedEx / DTDC", tariff: "₹ 4,044" },
  { id: 2, date: "21 Apr 2025, 04:15 PM", doc: "NDOX", country: "United Kingdom", weight: "2.3", rates: "DHL / FedEx / DTDC", tariff: "₹ 5,892" },
  { id: 3, date: "20 Apr 2025, 11:20 AM", doc: "DOX", country: "Germany", weight: "1.8", rates: "DHL / FedEx / DTDC", tariff: "₹ 4,623" },
];
