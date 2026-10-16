import Image from "next/image";

function Brand({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex size-[72px] shrink-0 items-center justify-center rounded-[18px] border border-stroke2 bg-primary">
        <Image src="/img/logo.png" alt="MCL" width={82} height={72} priority className="h-[56px] w-[64px] object-contain" />
      </div>
      <div className="flex flex-col">
        <p className="text-[26px] font-bold tracking-[-0.52px]">MCL</p>
        <p className="text-[14px] font-medium tracking-[-0.28px] opacity-60">CRM PLATFORM</p>
      </div>
    </div>
  );
}

// Login / Forgot Password: full-screen split (Shell skips its sidebar + header on these routes).
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      <aside className="hidden flex-1 flex-col justify-between bg-[linear-gradient(141deg,#152eaf_0%,#304dc3_45%,#6a9bef_100%)] p-12 text-white lg:flex">
        <Brand />
        <div className="flex max-w-[480px] flex-col gap-4">
          <h2 className="text-[40px] leading-[1.2] font-bold tracking-[-0.8px]">Every lead, follow-up and customer in one place.</h2>
          <p className="text-[18px] opacity-80">Track your pipeline, never miss a follow-up, and close more deals with MCL CRM.</p>
        </div>
        <p className="text-[14px] opacity-60">© MCL. All rights reserved.</p>
      </aside>
      <main className="flex flex-1 items-center justify-center p-4 sm:p-8">
        <div className="flex w-full max-w-[460px] animate-rise flex-col gap-8 rounded-[24px] border border-stroke2 bg-primary p-6 shadow-[0_12px_40px_rgb(21_46_175/0.08)] sm:p-10">
          <Brand className="text-selected lg:hidden" />
          {children}
        </div>
      </main>
    </div>
  );
}
