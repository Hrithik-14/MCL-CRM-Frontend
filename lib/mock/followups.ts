// Mock data for Follow Ups (Figma 1:6190, history accordion 1:8003, New Follow Up 1:8040). Frontend only.
export type FollowUpStatus = "Pending" | "Completed" | "Overdue";

export type FollowUp = {
  id: number;
  note: string;
  contact: string;
  type: string;
  assigned: string;
  status: FollowUpStatus;
  due: string;
  completed: string; // "------" when not completed (Figma)
};

const base = { note: "Follow Up On Proposal", contact: "MediShip - Ribeesh", type: "WhatsApp", assigned: "Praveen", due: "10/8/2026" };

export const FOLLOW_UPS: FollowUp[] = [
  { ...base, id: 1, status: "Completed", completed: "10/8/2026" },
  { ...base, id: 2, status: "Pending", completed: "------" },
  { ...base, id: 3, status: "Overdue", completed: "------" },
  { ...base, id: 4, status: "Completed", completed: "10/8/2026" },
  { ...base, id: 5, status: "Completed", completed: "10/8/2026" },
];

// "Previous Follow Up History" — one completed follow-up per contact
export const FOLLOW_UP_HISTORY = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: "Vimal Kumar",
  entries: [{ note: "Follow Up On Proposal", contact: "MediShip", type: "WhatsApp", assigned: "Praveen", status: "Completed" as const, due: "10/8/2026", completed: "10/8/2026" }],
}));

// New Follow Up select options (Figma shows only the placeholder values)
export const LEAD_CONTACT_OPTIONS = ["MediShip - Ribeesh", "CRN Solutions - Aravind Nair", "Vimal Kumar"];
export const FOLLOW_UP_TYPE_OPTIONS = ["WhatsApp", "Call", "Email", "Meeting"];
