import Image from "next/image";
import { Icon } from "@/components/Icon";
import { DASH_STATS, LEAD_SOURCES, LEADS_TREND, TREND_X_TICKS } from "@/lib/mock/dashboard";

const PLOT = 616.967; // Figma plot width (px) — bars/ticks scale with the card
const AXIS = 66; // y-axis offset from the label column
const along = (px: number) => `calc(${AXIS}px + (100% - ${AXIS}px) * ${px / PLOT})`;

function StatCard({ label, value, caption, icon }: (typeof DASH_STATS)[number][number]) {
  return (
    <div className="flex items-center justify-between rounded-[16px] border border-stroke2 bg-primary p-[19px]">
      <div className="flex flex-col gap-[6px] whitespace-nowrap">
        <p className="text-[16px] font-medium tracking-[-0.64px] text-nav opacity-80">{label}</p>
        <p className="text-[30px] font-bold tracking-[0.6px] text-black">{value}</p>
        <p className="text-[14px] tracking-[-0.56px] text-nav opacity-70">{caption}</p>
      </div>
      <Icon name={icon} size={32} className="text-nav" />
    </div>
  );
}

function LeadsTrend() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-5 rounded-[16px] border border-stroke2 bg-primary p-[19px] xl:flex-1">
      <p className="text-[18px] font-medium tracking-[-0.36px] text-black">Leads Trend</p>
      <div className="max-md:overflow-x-auto">
        <div className="relative h-[368px] max-md:min-w-[520px]">
          <div className="absolute top-0 left-[66px] h-[361.47px] w-px bg-black/50" />
          <div className="absolute top-[347.34px] right-0 left-[66px] h-px bg-black/50" />
          {LEADS_TREND.map((row, i) => (
            <div key={row.label}>
              <div className="absolute left-0 flex items-center gap-3" style={{ top: 25.38 + 58 * i }}>
                <p className="w-[52px] text-right text-[16px] font-medium tracking-[-0.64px] opacity-70">{row.label}</p>
                <div className="h-[0.5px] w-[3.32px] bg-black" />
              </div>
              {/* Hover → overlay (Dissolve 300ms ease-out) anchored at the bar's end */}
              <div
                className="group absolute left-[66px] h-9 rounded-r-[12px] bg-linear-to-b from-[#6195f0] to-[#8cb6ff]"
                style={{ top: 17.38 + 58 * i, width: `calc((100% - ${AXIS}px) * ${row.width / PLOT})` }}
              >
                <div className="pointer-events-none absolute top-0 left-full z-10 flex w-[106px] flex-col items-center gap-3 rounded-[12px] border border-stroke2 bg-[linear-gradient(135.15deg,#f8fcfd_8.81%,#c2edf8_91.19%)] p-3 text-[14px] font-medium tracking-[-0.56px] text-nav opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="text-center opacity-70">{row.tip}</p>
                  <p className="w-[80px] text-right opacity-70">Leads - {row.leads}</p>
                </div>
              </div>
            </div>
          ))}
          {TREND_X_TICKS.map((t) => (
            <div key={t.label} className="absolute top-[347.34px] flex w-10 -translate-x-1/2 flex-col items-center gap-[2px]" style={{ left: along(t.left + 20 - AXIS) }}>
              <div className="h-[3.32px] w-[0.5px] bg-black" />
              <p className="text-center text-[12px] font-medium tracking-[-0.48px] opacity-70">{t.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LeadSources() {
  return (
    <div className="flex w-full shrink-0 flex-col gap-5 rounded-[16px] border border-stroke2 bg-primary p-[19px] xl:w-[352px]">
      <p className="text-[18px] font-medium tracking-[-0.36px] text-black">Leads Sources</p>
      <div className="flex w-full flex-col items-center gap-5">
        <Image src="/img/donut.svg" alt="Lead sources chart" width={200} height={200} />
        <ul className="flex w-full flex-col gap-4">
          {LEAD_SOURCES.map((s) => (
            <li key={s.label} className="flex items-center justify-between text-[14px] tracking-[-0.56px] text-black">
              <span className="flex items-center gap-[7px]">
                <Image src={s.dot} alt="" width={10} height={10} />
                {s.label}
              </span>
              <span className="font-medium">{s.pct}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [row1, row2, row3] = DASH_STATS;
  // Figma 1:6021 sits at y=77.44 (other screens at 77) → 1px extra top padding
  return (
    <div className="flex flex-col gap-[19px] p-4 sm:p-6 sm:pt-[25px]">
      {[row1, row2].map((row, i) => (
        <div key={i} className="grid grid-cols-1 gap-[19px] sm:grid-cols-2 xl:grid-cols-4">
          {row.map((s) => <StatCard key={s.label} {...s} />)}
        </div>
      ))}
      <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-3">
        {row3.map((s) => <StatCard key={s.label} {...s} />)}
      </div>
      <div className="flex flex-col items-start gap-[18px] xl:flex-row">
        <LeadsTrend />
        <LeadSources />
      </div>
    </div>
  );
}
