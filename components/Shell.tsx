"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon, type IconName } from "./Icon";

type NavItem = { label: string; icon: IconName; href?: string };

const MAIN_NAV: NavItem[] = [
  { label: "Dashboard", icon: "element-4", href: "/" },
  { label: "Leads", icon: "chart", href: "/leads" },
  { label: "Customers", icon: "profile-2user", href: "/customers" },
  { label: "Follow - Ups", icon: "followups-nav", href: "/follow-ups" },
  { label: "User", icon: "profile-tick", href: "/users" },
  { label: "Notifications", icon: "notification-bing", href: "/notifications" },
  { label: "DTDC Calculator", icon: "calculator", href: "/calculator" },
];

const BOTTOM_NAV: NavItem[] = [
  { label: "Modules", icon: "colorfilter", href: "/modules" },
  { label: "Settings", icon: "settings-nav", href: "/settings" },
  // Logout has no prototype destination (no auth in this frontend-only build).
  { label: "Logout", icon: "logout" },
];

// Figma "Tab select": Default / Variant2 (hover, Smart Animate 300ms ease-out) / Variant3 (active)
function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const cls = `flex w-full items-center gap-4 rounded-[18px] border px-[15px] py-[13px] text-left text-[18px] font-medium tracking-[-0.36px] whitespace-nowrap transition-[background-color,border-color,color] ${
    active
      ? "border-stroke bg-[linear-gradient(89.46deg,#243dba_0%,#6a9bef_99.91%)] text-primary"
      : "border-transparent bg-primary text-nav hover:border-stroke2 hover:bg-[rgb(71_215_251/0.3)]"
  }`;
  const body = (
    <>
      <Icon name={item.icon} />
      {item.label}
    </>
  );
  return item.href ? (
    <Link href={item.href} className={cls} aria-current={active ? "page" : undefined}>
      {body}
    </Link>
  ) : (
    <button type="button" className={`${cls} cursor-pointer`}>
      {body}
    </button>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href?: string) =>
    !!href && (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <aside
        className={`fixed top-0 left-0 z-40 flex h-dvh w-[300px] flex-col overflow-y-auto rounded-[8px] border-r border-stroke bg-primary transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex w-full shrink-0 items-center border-b border-stroke px-7 py-5">
          <Image src="/img/logo.png" alt="MCL" width={82} height={72} priority className="h-[71.881px] w-[81.741px] object-cover" />
          <div className="flex w-[131px] flex-col text-secondary">
            <p className="text-[26px] font-bold tracking-[-0.52px]">MCL</p>
            <p className="text-[14px] font-medium tracking-[-0.28px] opacity-50">CRM PLATFORM</p>
          </div>
        </div>
        <nav className="flex w-full flex-col gap-2 px-4 py-8" onClick={() => setOpen(false)}>
          {MAIN_NAV.map((item) => (
            <NavLink key={item.label} item={item} active={isActive(item.href)} />
          ))}
          <div className="h-6 shrink-0" />
          <div className="flex w-full flex-col gap-2 border-t border-stroke2">
            {BOTTOM_NAV.map((item) => (
              <NavLink key={item.label} item={item} active={isActive(item.href)} />
            ))}
          </div>
        </nav>
      </aside>

      {open && (
        <div className="fixed inset-0 z-30 bg-black/25 lg:hidden" onClick={() => setOpen(false)} aria-hidden />
      )}

      <header className="fixed top-0 right-0 left-0 z-20 flex items-center justify-end gap-[26px] border-b border-stroke bg-primary px-6 pt-[14px] pb-[13px] lg:left-[300px]">
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="mr-auto flex size-6 cursor-pointer flex-col justify-center gap-[5px] lg:hidden"
        >
          <span className="h-[1.5px] w-full rounded bg-nav" />
          <span className="h-[1.5px] w-full rounded bg-nav" />
          <span className="h-[1.5px] w-full rounded bg-nav" />
        </button>
        <Icon name="sun" className="text-nav" />
        <Link href="/notifications" aria-label="Notifications" className="text-nav">
          <Icon name="notification-bing" />
        </Link>
        <div className="flex items-center gap-[17px] sm:pr-5">
          <div className="relative size-[50px] shrink-0">
            <div className="flex size-full items-center justify-center rounded-full bg-[linear-gradient(141.61deg,#676ff6_15.93%,#cc4ec4_85.25%)] font-inter text-[19px] font-bold tracking-[-0.38px] text-white">
              N
            </div>
            <Image src="/img/online-dot.svg" alt="" width={21} height={21} className="absolute -right-[2px] -bottom-[2px] size-[21px] max-w-none" />
          </div>
          <div className="hidden flex-col sm:flex">
            <p className="text-[18px] font-semibold tracking-[-0.36px] text-nav">Nishad</p>
            <p className="text-[12px] font-medium tracking-[-0.24px] text-nav opacity-50">Founder</p>
          </div>
        </div>
      </header>

      <main className="min-h-dvh pt-[77px] lg:pl-[300px]">{children}</main>
    </>
  );
}
