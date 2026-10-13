// Mock data for Customers (Figma 1:6812). Frontend only.
export type Customer = {
  id: number;
  name: string;
  company: string;
  phone: string;
  email: string; // Figma shows the address pre-truncated ("aravindn0@gm...")
  address: string;
  type: string;
  source: string;
  assigned: string;
  status: "Active" | "Inactive";
  created: string;
  note: string;
};

const base = {
  name: "Aravind Nair",
  company: "CRN Solutions",
  phone: "9800000001",
  email: "aravindn0@gm...",
  address: "St Bride Printing Library in London, took a 1914 Cicero translation",
  assigned: "Rajesh",
  status: "Active",
  created: "10/8/2026",
  note: "Ipsum is simply dummy text of the printing",
} as const;

export const CUSTOMERS: Customer[] = [
  { ...base, id: 1, type: "Call", source: "Direct Office" },
  { ...base, id: 2, type: "Follow Up", source: "Co Courier" },
  { ...base, id: 3, type: "Initial", source: "B2B" },
  { ...base, id: 4, type: "Initial", source: "Meta Ads" },
  { ...base, id: 5, type: "Initial", source: "Meta Ads" },
];
