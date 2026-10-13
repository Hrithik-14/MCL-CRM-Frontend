import { LeadsView } from "@/components/leads/LeadsView";

// Shared by Leads- Table (1:6132) and Leads- Pipeline (1:6990): header + view toggle stay mounted,
// so the toggle pill slides and only the view below swaps.
export default function LeadsListLayout({ children }: { children: React.ReactNode }) {
  return <LeadsView>{children}</LeadsView>;
}
