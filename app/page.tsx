"use client";

import { Icon, type IconName } from "@/components/Icon";
import { Loading, Skeleton } from "@/components/skeletons";
import { LoadFailed } from "@/components/ui";
import { useApi } from "@/lib/api";

type Summary = {
  kpis: {
    totalLeads: number;
    newLeads: number;
    activeLeads: number;
    convertedLeads: number;
    lostLeads: number;
    activeCustomers: number;
    followUpsDueToday: number;
    followUpsOverdue: number;
    openLeadValue: number;
    convertedValue: number;
    conversionRate: number;
  };
  byStatus: { status: { id: string; name: string }; count: number }[];
  bySource: { source: { id: string; name: string } | null; count: number; share: number }[];
};

const AXIS = 66; // y-axis offset from the label column
const along = (frac: number) => `calc(${AXIS}px + (100% - ${AXIS}px) * ${frac})`;
const count = (n = 0) => String(n).padStart(2, "0"); // the design shows "02", "09"…
// ₹27.3L / ₹4.2Cr / ₹47K, as in the design
const compact = (n = 0) => (n >= 1e7 ? `₹${+(n / 1e7).toFixed(1)}Cr` : n >= 1e5 ? `₹${+(n / 1e5).toFixed(1)}L` : n >= 1e3 ? `₹${+(n / 1e3).toFixed(1)}K` : `₹${n}`);
// Design's short row labels; other (custom) statuses are cut to fit the label column.
const SHORT: Record<string, string> = { Contacted: "Cntctd", Interested: "Intrstd", Proposal: "Prpsl", Converted: "Cnvrtd" };
// Legend colours from the design (public/img/legend-1…5.svg), repeated for extra sources.
const PALETTE = ["#8ca0fa", "#7c5cfc", "#10b981", "#f59e0b", "#6b7280"];

/** `value` null = still loading: a placeholder, never a "00" that looks like a real figure. */
function StatCard({ label, value, caption, icon }: { label: string; value: string | null; caption: string; icon: IconName }) {
  return (
    <div className="flex items-center justify-between rounded-[16px] border border-stroke2 bg-primary p-[19px]">
      <div className="flex flex-col gap-[6px] whitespace-nowrap">
        <p className="text-[16px] font-medium tracking-[-0.64px] text-nav opacity-80">{label}</p>
        {value === null ? <Skeleton className="my-[3px] h-[31px] w-20" /> : <p className="text-[30px] font-bold tracking-[0.6px] text-black">{value}</p>}
        <p className="text-[14px] tracking-[-0.56px] text-nav opacity-70">{caption}</p>
      </div>
      <Icon name={icon} size={32} className="text-nav" />
    </div>
  );
}

// 1, 2, 5 × 10ⁿ step so the five axis ticks read cleanly.
function niceStep(max: number) {
  const raw = Math.max(1, max) / 5;
  const pow = 10 ** Math.floor(Math.log10(raw));
  return ([1, 2, 5, 10].find((m) => m * pow >= raw) ?? 10) * pow;
}

// Loading: six bar outlines in the chart's own rows, 58px apart like the bars.
const TREND_PLACEHOLDER = [70, 45, 85, 30, 55, 20];

function LeadsTrend({ rows }: { rows: Summary["byStatus"] | null }) {
  const step = niceStep(Math.max(0, ...(rows ?? []).map((r) => r.count)));
  const scale = step * 5;
  const axisY = 57.34 + 58 * Math.max(0, (rows ?? TREND_PLACEHOLDER).length - 1); // Figma: 347.34 for six rows
  return (
    <div className="flex w-full min-w-0 flex-col gap-5 rounded-[16px] border border-stroke2 bg-primary p-[19px] xl:flex-1">
      <p className="text-[18px] font-medium tracking-[-0.36px] text-black">Leads Trend</p>
      {!rows ? (
        <Loading className="relative" label="Loading the leads trend…">
          <div style={{ height: axisY + 20.66 }}>
            {TREND_PLACEHOLDER.map((w, i) => (
              <div key={i} className="absolute flex w-full items-center gap-[14px]" style={{ top: 17.38 + 58 * i }}>
                <Skeleton className="h-4 w-[52px]" />
                <Skeleton className="h-9 rounded-l-none rounded-r-[12px]" style={{ width: `calc((100% - ${AXIS}px) * ${w / 100})` }} />
              </div>
            ))}
          </div>
        </Loading>
      ) : (
      <div className="max-md:overflow-x-auto">
        <div className="relative max-md:min-w-[520px]" style={{ height: axisY + 20.66 }}>
          <div className="absolute top-0 left-[66px] w-px bg-black/50" style={{ height: axisY + 14.13 }} />
          <div className="absolute right-0 left-[66px] h-px bg-black/50" style={{ top: axisY }} />
          {rows.map((row, i) => (
            <div key={row.status.id}>
              <div className="absolute left-0 flex items-center gap-3" style={{ top: 25.38 + 58 * i }}>
                <p className="w-[52px] truncate text-right text-[16px] font-medium tracking-[-0.64px] opacity-70">{SHORT[row.status.name] ?? row.status.name.slice(0, 7)}</p>
                <div className="h-[0.5px] w-[3.32px] bg-black" />
              </div>
              {/* Hover → overlay (Dissolve 300ms ease-out) anchored at the bar's end */}
              <div
                className="group absolute left-[66px] h-9 rounded-r-[12px] bg-linear-to-b from-[#6195f0] to-[#8cb6ff]"
                style={{ top: 17.38 + 58 * i, width: `calc((100% - ${AXIS}px) * ${row.count / scale})` }}
              >
                <div className="pointer-events-none absolute top-0 left-full z-10 flex w-[106px] flex-col items-center gap-3 rounded-[12px] border border-stroke2 bg-[linear-gradient(135.15deg,#f8fcfd_8.81%,#c2edf8_91.19%)] dark:bg-[linear-gradient(135deg,#17222e_8%,#123847_92%)] p-3 text-[14px] font-medium tracking-[-0.56px] text-nav opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="text-center opacity-70">{row.status.name}</p>
                  <p className="w-[80px] text-right opacity-70">Leads - {row.count}</p>
                </div>
              </div>
            </div>
          ))}
          {[1, 2, 3, 4, 5].map((t) => (
            <div key={t} className="absolute flex w-10 -translate-x-1/2 flex-col items-center gap-[2px]" style={{ top: axisY, left: along(t / 5) }}>
              <div className="h-[3.32px] w-[0.5px] bg-black" />
              <p className="text-center text-[12px] font-medium tracking-[-0.48px] opacity-70">{step * t}</p>
            </div>
          ))}
        </div>
      </div>
      )}
    </div>
  );
}

// Donut: ring of radius 80 / width 40 in a 200px box, like the Figma graphic, drawn from the data.
function LeadSources({ rows: data }: { rows: Summary["bySource"] | null }) {
  const rows = data ?? [];
  const C = 2 * Math.PI * 80;
  const total = rows.reduce((n, r) => n + r.count, 0);
  const lens = rows.map((r) => (total ? (r.count / total) * C : 0));
  const starts = lens.map((_, i) => lens.slice(0, i).reduce((a, b) => a + b, 0));
  return (
    <div className="flex w-full shrink-0 flex-col gap-5 rounded-[16px] border border-stroke2 bg-primary p-[19px] xl:w-[352px]">
      <p className="text-[18px] font-medium tracking-[-0.36px] text-black">Leads Sources</p>
      <div className="flex w-full flex-col items-center gap-5">
        {/* Loading: the empty ring (shimmering) and legend rows stand in for the chart. */}
        <svg width={200} height={200} viewBox="0 0 200 200" role="img" aria-label={data ? "Lead sources chart" : "Loading the lead sources chart"} className={`-rotate-90 ${data ? "" : "motion-safe:animate-pulse"}`}>
          <circle cx={100} cy={100} r={80} fill="none" strokeWidth={40} className="stroke-[#e5e7eb] dark:stroke-[#243241]" />
          {rows.map((r, i) => (
            <circle key={r.source?.id ?? "none"} cx={100} cy={100} r={80} fill="none" stroke={PALETTE[i % PALETTE.length]} strokeWidth={40} strokeDasharray={`${lens[i]} ${C - lens[i]!}`} strokeDashoffset={-starts[i]!} />
          ))}
        </svg>
        {!data && (
          <Loading className="flex w-full flex-col gap-4" label="Loading the lead sources…">
            {[60, 45, 70].map((w, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4" style={{ width: `${w}%` }} />
                <Skeleton className="h-4 w-9" />
              </div>
            ))}
          </Loading>
        )}
        <ul className="flex w-full flex-col gap-4">
          {rows.map((s, i) => (
            <li key={s.source?.id ?? "none"} className="flex items-center justify-between text-[14px] tracking-[-0.56px] text-black">
              <span className="flex items-center gap-[7px]">
                <span className="size-[10px] rounded-full" style={{ background: PALETTE[i % PALETTE.length] }} />
                {s.source?.name ?? "No source"}
              </span>
              <span className="font-medium">{s.share}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const summary = useApi<Summary>("/dashboard/summary");
  const data = summary.data;
  const k = data?.kpis;
  // Until the first answer every figure is a placeholder (null); after a failed first load, the "no value" mark.
  const fig = (f: (k: Summary["kpis"]) => string) => (k ? f(k) : summary.error ? "------" : null);
  const rows: { label: string; value: string | null; caption: string; icon: IconName }[][] = [
    [
      { label: "Total Leads", value: fig((k) => count(k.totalLeads)), caption: "All time", icon: "chart" },
      { label: "New Leads", value: fig((k) => count(k.newLeads)), caption: "Awaiting Contact", icon: "won" },
      { label: "Active Leads", value: fig((k) => count(k.activeLeads)), caption: "In Kanban", icon: "active" },
      { label: "Converted", value: fig((k) => count(k.convertedLeads)), caption: "Leads Won", icon: "converted" },
    ],
    [
      { label: "Lost Leads", value: fig((k) => count(k.lostLeads)), caption: "Leads Lost", icon: "loss" },
      { label: "Customer", value: fig((k) => count(k.activeCustomers)), caption: "Active Accounts", icon: "profile-2user" },
      { label: "Pending Follow Ups", value: fig((k) => count(k.followUpsDueToday)), caption: "Due Today", icon: "calendar-pending" },
      { label: "Overdue Follow Ups", value: fig((k) => count(k.followUpsOverdue)), caption: "Action Required", icon: "calendar-remove" },
    ],
    [
      { label: "Total Lead Value", value: fig((k) => compact(k.openLeadValue)), caption: "Expected Kanban", icon: "dollar-circle" },
      { label: "Converted Value", value: fig((k) => compact(k.convertedValue)), caption: "Revenue Secured", icon: "converted-value" },
      { label: "Conversion Rate", value: fig((k) => `${k.conversionRate}%`), caption: "Leads - Customers", icon: "global" },
    ],
  ];
  const [row1, row2, row3] = rows;
  // Figma 1:6021 sits at y=77.44 (other screens at 77) → 1px extra top padding
  return (
    <div className="flex flex-col gap-[19px] p-4 sm:p-6 sm:pt-[25px]">
      {!data && summary.error && <LoadFailed what="dashboard figures" onRetry={summary.reload} />}
      {[row1!, row2!].map((row, i) => (
        <div key={i} className="grid grid-cols-1 gap-[19px] sm:grid-cols-2 xl:grid-cols-4">
          {row.map((s) => <StatCard key={s.label} {...s} />)}
        </div>
      ))}
      <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-3">
        {row3!.map((s) => <StatCard key={s.label} {...s} />)}
      </div>
      <div className="flex flex-col items-start gap-[18px] xl:flex-row">
        <LeadsTrend rows={data?.byStatus ?? (summary.error ? [] : null)} />
        <LeadSources rows={data?.bySource ?? (summary.error ? [] : null)} />
      </div>
    </div>
  );
}
