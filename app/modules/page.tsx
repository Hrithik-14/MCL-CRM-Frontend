import { Icon } from "@/components/Icon";
import { SectionHeader } from "@/components/users/SectionHeader";
import { MODULES } from "@/lib/mock/modules";

// Figma 1:6487. Cards = component set 1:8088: ON_HOVER → Variant2 (1:8101, outline border), Smart Animate 300ms ease-out.
export default function ModulesPage() {
  return (
    <div className="flex flex-col gap-[18px] p-4 sm:p-6">
      <SectionHeader title="Welcome ERP" subtitle="Select a module to continue. You only see the modules your role grants access to Admin" />
      <section className="rounded-[22px] border border-stroke2 bg-primary px-5 py-[52px]">
        <div className="flex flex-wrap items-center justify-center gap-6">
          {MODULES.map((m) => (
            <div key={m.name} className="flex flex-col items-center gap-4 rounded-[24px] border border-stroke2 bg-[rgb(214_247_255/0.5)] p-5 transition-colors hover:border-[#6e85e5]">
              <span className="flex h-8 w-10 items-center justify-center rounded-[12px] border border-stroke2 bg-bg5">
                <Icon name={m.icon} size={18} className="text-nav" />
              </span>
              <div className="flex w-[200px] flex-col gap-3 text-center">
                <p className="text-[16px] font-semibold tracking-[-0.64px] text-black">{m.name}</p>
                <p className="text-[14px] tracking-[-0.56px] text-nav">{m.access}</p>
                {/* Open: no prototype destination in Figma → inert. Text in a span: preflight makes
                    <button> inherit the parent's 20px line-height, a span gets the 17px of 14px text. */}
                <button type="button" className="flex cursor-pointer items-center justify-center gap-2 rounded-[12px] bg-button px-4 py-[6px] text-[14px] font-medium text-primary">
                  <span>Open</span>
                  <Icon name="arrow-right" size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
