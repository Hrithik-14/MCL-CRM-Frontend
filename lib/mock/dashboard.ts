// Mock data for the Dashboard (Figma 1:6020). Frontend only.
import type { IconName } from "@/components/Icon";
export const DASH_STATS: { label: string; value: string; caption: string; icon: IconName }[][] = [
  [
    { label: "Total Leads", value: "12", caption: "All time", icon: "chart" },
    { label: "New Leads", value: "02", caption: "Awaiting Contact", icon: "won" },
    { label: "Active Leads", value: "09", caption: "In Kanban", icon: "active" },
    { label: "Converted", value: "01", caption: "Leads Won", icon: "converted" },
  ],
  [
    { label: "Lost Leads", value: "01", caption: "Leads Lost", icon: "loss" },
    { label: "Customer", value: "03", caption: "Active Acounts", icon: "profile-2user" },
    { label: "Pending Follow Ups", value: "05", caption: "Due Today", icon: "calendar-pending" },
    { label: "Overdue Follow Ups", value: "01", caption: "Action Required", icon: "calendar-remove" },
  ],
  [
    { label: "Total Lead Value", value: "₹27.3L", caption: "Expected Kanban", icon: "dollar-circle" },
    { label: "Converted Value", value: "₹47K", caption: "Revenue Secured", icon: "converted-value" },
    { label: "Conversion Rate", value: "8.3%", caption: "Leads - Customers", icon: "global" },
  ],
];

// Bar widths are the Figma px values on a 616.967px plot; tooltips = overlays 1:7151–1:7158.
export const LEADS_TREND = [
  { label: "New", width: 498.87, tip: "New", leads: 850 },
  { label: "Cntctd", width: 536.888, tip: "Contacted", leads: 970 },
  { label: "Intrstd", width: 418.301, tip: "Interested", leads: 720 },
  { label: "Prpsl", width: 498.87, tip: "Proposal", leads: 880 },
  { label: "Cnvrtd", width: 226.148, tip: "Converted", leads: 440 },
  { label: "Lost", width: 41.877, tip: "Lost", leads: 140 },
];
export const TREND_X_TICKS = [
  { label: "110", left: 74.73 },
  { label: "220", left: 135.06 },
  { label: "330", left: 203.06 },
  { label: "440", left: 271.06 },
  { label: "550", left: 339.06 },
  { label: "660", left: 407.06 },
  { label: "770", left: 475.06 },
  { label: "880", left: 543.06 },
  { label: "1000", left: 611.06 },
];

export const LEAD_SOURCES = [
  { label: "Meta ads", pct: "38%", dot: "/img/legend-1.svg" },
  { label: "Direct Office", pct: "24%", dot: "/img/legend-2.svg" },
  { label: "B2B", pct: "20%", dot: "/img/legend-3.svg" },
  { label: "Co - Courier", pct: "12%", dot: "/img/legend-4.svg" },
  { label: "Other", pct: "6%", dot: "/img/legend-5.svg" },
];
