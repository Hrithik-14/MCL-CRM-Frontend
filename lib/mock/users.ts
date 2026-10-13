// Mock data for User Management (Figma 1:6503 users table, 1:6723 role cards). Frontend only.
export type User = {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive";
  assigned: number;
  converted: number;
  created: string;
};

const praveen = { name: "Praveen", email: "praveen77@gmail.com", phone: "9+87463419684614", status: "Active", assigned: 8, converted: 6, created: "10/8/2026" } as const;

export const USERS: User[] = ["BDE", "Sales", "BDE", "BDE", "BDE", "BDE"].map((role, i) => ({ id: i + 1, role, ...praveen }));

// "Showing 1 to 6 of 12 Users": pages 2-4 are not mocked.
export const UNLISTED_USERS = 6;

export const ROLE_OPTIONS = ["Admin", "Sales", "BDE"];

// Create New Role / Permissions overlays (1:7850, 1:7891) offer these five.
export const PERMISSION_OPTIONS = ["Dashboard", "Leads", "Customers", "Follow Ups", "Users"];

export type Member = { initials: string; color: string };
export type Role = { id: number; name: string; users: number; permissions: string[]; members: Member[]; extra: number };

const MEMBERS: Member[] = [
  { initials: "AB", color: "#676ff6" },
  { initials: "D", color: "#99a4b0" },
  { initials: "MK", color: "#30a74e" },
  { initials: "AJ", color: "#e90000" },
  { initials: "L", color: "#00bdd7" },
];

// Cards show "8" permissions; the chip row scrolls past the visible four.
const ALL = [...PERMISSION_OPTIONS, "Notifications", "DTDC Calculator", "Settings"];

export const ROLES: Role[] = ["Admin", "Sales", "Lore"].map((name, i) => ({ id: i + 1, name, users: 6, permissions: ALL, members: MEMBERS, extra: 2 }));
