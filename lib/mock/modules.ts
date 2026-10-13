// Mock data for Modules (Figma 1:6487). Frontend only.
import type { IconName } from "@/components/Icon";

export const MODULES: { name: string; icon: IconName; access: string }[] = [
  { name: "Sales", icon: "shopping-bag", access: "Dashboard, Leads, Follow Ups" },
  { name: "BDE", icon: "call", access: "Dashboard, Leads, Follow Ups" },
  { name: "Finance", icon: "bitcoin-card", access: "Dashboard, Leads, Follow Ups" },
];
