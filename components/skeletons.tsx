import type { CSSProperties, ReactNode } from "react";

// Skeletons stand in for content that is genuinely loading, in its own shape and size, so nothing jumps when the data
// arrives. They are shown only until the first answer: a background refresh keeps the current content on screen
// (lib/api useApi keeps the previous data), and a failed load shows its error, never a skeleton.
// Screen readers hear "Loading…" once (role=status) instead of the decorative blocks.

/** One placeholder block: size and round it like the content it stands for. Shimmer style: globals.css .skeleton */
export function Skeleton({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return <span aria-hidden className={`skeleton block rounded-[8px] ${className}`} style={style} />;
}

/** A page header's count line ("12 Total Leads") until its number is known, instead of a misleading 0. */
export const SubtitleSkeleton = () => <Skeleton className="my-[2px] h-4 w-44" />;

/** A loading region: announced once, its placeholder blocks hidden from assistive technology. */
export function Loading({ children, className, label = "Loading…" }: { children: ReactNode; className?: string; label?: string }) {
  return (
    <div role="status" aria-busy className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

// Varied but stable bar lengths, so rows don't look like a barcode and don't change between renders.
const fill = (row: number, col: number) => `${55 + ((row * 7 + col * 13) % 40)}%`;

/**
 * Table rows under a table's (kept) header: one bar per column, rows spaced like the data rows. Columns are pixel
 * widths ("flex" = takes the rest); `grow` sizes them as shares of the row instead, for tables laid out that way.
 */
export function SkeletonRows({ columns, rows = 6, twoLine = false, grow = false }: { columns: (number | "flex")[]; rows?: number; twoLine?: boolean; grow?: boolean }) {
  const size = (w: number | "flex"): CSSProperties | undefined => (w === "flex" ? undefined : grow ? { flex: `${w} 0 0`, minWidth: w } : { width: w });
  return (
    <Loading>
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="flex items-center border-b border-stroke2 pt-[10px] pb-4">
          {columns.map((w, c) => (
            <div key={c} className={`flex flex-col gap-2 pr-4 ${w === "flex" ? "min-w-0 flex-1" : "shrink-0"}`} style={size(w)}>
              <Skeleton className="h-5" style={{ width: fill(r, c) }} />
              {twoLine && c === 0 && <Skeleton className="h-4 w-1/2" />}
            </div>
          ))}
        </div>
      ))}
    </Loading>
  );
}

/** A list of entries (activity, history): a line of text and a smaller line under it. */
export function SkeletonLines({ rows = 4, className = "flex flex-col gap-6" }: { rows?: number; className?: string }) {
  return (
    <Loading className={className}>
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="flex flex-col gap-2">
          <Skeleton className="h-5" style={{ width: fill(r, 1) }} />
          <Skeleton className="h-4 w-40" />
        </div>
      ))}
    </Loading>
  );
}

/** A labelled value (Info on the detail pages): label line above a value line. */
function InfoBlock({ wide = false }: { wide?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className={`h-6 ${wide ? "w-3/4" : "w-32"}`} />
    </div>
  );
}

const card = "flex min-w-0 flex-col gap-8 rounded-[16px] border border-stroke2 bg-primary px-5 py-8";
const heading = <Skeleton className="h-8 w-48" />;

/** The lead / customer detail layout: main card and activity on the left, contact cards on the right. */
export function DetailSkeleton() {
  return (
    <Loading className="flex flex-col gap-[18px] xl:flex-row xl:items-start">
      <div className="flex min-w-0 flex-1 flex-col gap-[18px]">
        <section className={card}>
          <div className="flex items-center justify-between gap-3 border-b border-stroke2 pb-5">
            <Skeleton className="h-9 w-2/3 max-w-[420px]" />
            <Skeleton className="h-[25px] w-[88px] rounded-[19px]" />
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => <InfoBlock key={i} />)}
          </div>
          <InfoBlock wide />
        </section>
        <section className={card}>
          <div className="border-b border-stroke2 pb-5">{heading}</div>
          <SkeletonLines rows={3} />
        </section>
      </div>
      <div className="flex min-w-0 flex-col gap-[18px] xl:w-[382px] xl:shrink-0">
        <section className={card}>
          <div className="border-b border-stroke2 pb-5">{heading}</div>
          <div className="flex flex-col gap-6">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="size-6 shrink-0 rounded-full" />
                <InfoBlock />
              </div>
            ))}
          </div>
        </section>
      </div>
    </Loading>
  );
}

/** Pipeline: the board's stage columns (306px, as on the board) with a few card outlines each. */
export function PipelineSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <Loading className="flex w-max items-stretch gap-3">
      {Array.from({ length: columns }, (_, c) => (
        <section key={c} className="flex w-[306px] shrink-0 flex-col gap-[19px] rounded-[16px] border border-[#6e85e5] bg-primary p-4">
          <header className="flex flex-col gap-2 border-b border-stroke2 pb-3">
            <div className="flex w-[266px] items-center justify-between">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="size-5 rounded-[10px]" />
            </div>
            <Skeleton className="h-4 w-20" />
          </header>
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 - (c % 2) }, (_, i) => (
              <div key={i} className="flex flex-col gap-[18px] rounded-[16px] border border-stroke2 p-5">
                <div className="flex items-center justify-between gap-2">
                  <Skeleton className="h-5" style={{ width: fill(i, c) }} />
                  <Skeleton className="size-9 shrink-0 rounded-[12px]" />
                </div>
                <Skeleton className="h-[25px] w-[76px] rounded-[19px]" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-40" />
              </div>
            ))}
          </div>
        </section>
      ))}
    </Loading>
  );
}

/** Stacked cards (notifications, follow-up history, settings rows): `className` gives each card its own frame. */
export function SkeletonCards({ rows = 3, className, children }: { rows?: number; className: string; children: ReactNode }) {
  return (
    <Loading className="flex flex-col gap-[10px]">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className={className}>
          {children}
        </div>
      ))}
    </Loading>
  );
}
