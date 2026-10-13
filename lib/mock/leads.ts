// Mock data for Leads (Figma 1:6132 / 1:6990 / 1:6884). Frontend only.
export type Stage = "New" | "Contacted" | "Interested" | "Proposal" | "Converted" | "Lost";
export type Priority = "Low" | "Medium" | "High";

export type Lead = {
  id: number;
  title: string;
  source: string;
  stage: Stage;
  priority: Priority;
  value: string;
  payment: "Pending" | "Completed";
  owner: string;
  created: string;
};

export const LEADS: Lead[] = [
  { id: 1, title: "Lore Ipsum", source: "Meta Ads", stage: "New", priority: "Low", value: "₹2,49,000", payment: "Pending", owner: "Praveen", created: "10/8/2026" },
  { id: 2, title: "Lore Ipsum", source: "Direct Office", stage: "Contacted", priority: "Low", value: "₹2,49,000", payment: "Completed", owner: "Praveen", created: "10/8/2026" },
  { id: 3, title: "Lore Ipsum", source: "B2B", stage: "Proposal", priority: "Low", value: "₹2,49,000", payment: "Completed", owner: "Praveen", created: "10/8/2026" },
  { id: 4, title: "Lore Ipsum", source: "Co Courier", stage: "Converted", priority: "Medium", value: "₹2,49,000", payment: "Pending", owner: "Praveen", created: "10/8/2026" },
  { id: 5, title: "Lore Ipsum", source: "Meta Ads", stage: "Lost", priority: "Low", value: "₹2,49,000", payment: "Completed", owner: "Praveen", created: "10/8/2026" },
  { id: 6, title: "Lore Ipsum", source: "Meta Ads", stage: "Converted", priority: "High", value: "₹2,49,000", payment: "Pending", owner: "Praveen", created: "10/8/2026" },
];

export const LEAD_SOURCE_OPTIONS = ["Meta Ads", "Direct Office", "B2B", "Co Courier"];
export const PRIORITY_OPTIONS: Priority[] = ["Low", "Medium", "High"];
export const STAGE_OPTIONS: Stage[] = ["New", "Contacted", "Interested", "Proposal", "Converted", "Lost"];

// Pipeline board (Figma 1:7012): column value totals as designed; cards per column.
export const STAGE_TOTALS: Record<Stage, string> = {
  New: "₹3,63,000",
  Contacted: "₹2,49,000",
  Interested: "₹2,49,000",
  Proposal: "₹2,49,000",
  Converted: "₹2,49,000",
  Lost: "₹2,49,000",
};

const CARD_PRIORITIES: [Stage, Priority[]][] = [
  ["New", ["Low", "High", "Low"]],
  ["Contacted", ["Medium", "Low", "Low", "Low", "Low"]],
  ["Interested", ["Low", "Low", "Low", "Low"]],
  ["Proposal", ["Low", "Low", "Low", "Low", "Low", "Low"]],
  ["Converted", ["Low", "Low", "Low", "Low", "Low"]],
  ["Lost", ["Low", "Low"]],
];

export const PIPELINE: Lead[] = CARD_PRIORITIES.flatMap(([stage, ps], s) =>
  ps.map((priority, i) => ({
    id: 100 + s * 10 + i,
    title: "Lore Ipsum",
    source: "Meta Ads",
    stage,
    priority,
    value: "₹2,49,000",
    payment: "Pending" as const,
    owner: "Praveen",
    created: "10/8/2026",
  })),
);

// Leads- Contact (Figma 1:6884)
export const CONTACT = {
  title: "Lore Ipsum",
  status: "Contacted",
  source: "Meta Ads",
  owner: "Rajesh Kumar",
  stage: "New",
  priority: "Medium,",
  value: "₹2,49,000",
  district: "Kannur",
  created: "10/8/2026",
  updated: "30/8/2026",
  description: "Lorem Ipsum is simply dummy",
  customer: "Arshad",
  phone: "9845616544",
  email: "arshad03@gmail.com",
  address: "St Bride Printing Library in London, took a 1914 Cicero translation",
};

export const CONTACT_ACTIVITY = Array.from({ length: 7 }, (_, i) => ({
  id: i,
  text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
  at: "09/02/2026, 4:43 PM",
}));
