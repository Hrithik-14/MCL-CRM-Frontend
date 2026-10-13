import { SectionHeader } from "@/components/users/SectionHeader";
import { NOTIFICATIONS } from "@/lib/mock/notifications";

// Figma 1:6702: static list, no prototype actions. Unread = green dot, read = faded blue dot.
export default function NotificationsPage() {
  const unread = NOTIFICATIONS.filter((n) => n.unread).length;
  return (
    <div className="flex flex-col gap-[18px] p-4 sm:p-6">
      <SectionHeader title="Notifications" subtitle={`${unread} Unread Notifications`} />
      {NOTIFICATIONS.map((n) => (
        <article key={n.id} className="flex flex-col gap-[10px] rounded-[24px] border border-stroke2 bg-primary p-5">
          {/* dot pinned to the first line (= centred on Figma's single 22px line) when the title wraps */}
          <div className="flex items-start gap-2">
            <span className={`mt-[6px] size-[10px] shrink-0 rounded-full ${n.unread ? "bg-[#00d14c]" : "bg-[rgb(106_155_239/0.25)]"}`} />
            <p className="text-[18px] font-medium tracking-[-0.72px] text-black">{n.title}</p>
          </div>
          <p className="pl-5 text-[16px] tracking-[-0.64px] text-nav opacity-70">{n.detail}</p>
          <p className="pl-5 text-[14px] tracking-[-0.56px] text-nav opacity-70">{n.time}</p>
        </article>
      ))}
    </div>
  );
}
