"use client";

import { Skeleton, SkeletonCards, SubtitleSkeleton } from "@/components/skeletons";
import { LoadFailed } from "@/components/ui";
import { SectionHeader } from "@/components/users/SectionHeader";
import { dateTime, useApi, type List } from "@/lib/api";

type Notification = { id: string; title: string; detail: string | null; read: boolean; createdAt: string };

// Figma 1:6702. Unread = green dot, read = faded blue dot. Which events create notifications,
// and marking them read, are still to be decided (report C9 / Q19) — so this feed is usually empty for now.
export default function NotificationsPage() {
  const notifications = useApi<List<Notification> & { unreadCount: number }>("/notifications", { pageSize: 50 });
  const feed = notifications.data;
  return (
    <div className="flex flex-col gap-[18px] p-4 sm:p-6">
      <SectionHeader title="Notifications" subtitle={feed ? `${feed.unreadCount} Unread Notifications` : !notifications.error && <SubtitleSkeleton />} />
      {!feed && !notifications.error && (
        <SkeletonCards className="flex flex-col gap-[10px] rounded-[24px] border border-stroke2 bg-primary p-5">
          <div className="flex items-center gap-2">
            <Skeleton className="size-[10px] shrink-0 rounded-full" />
            <Skeleton className="h-5 w-1/2" />
          </div>
          <Skeleton className="ml-5 h-4 w-36" />
        </SkeletonCards>
      )}
      {!feed && notifications.error && <LoadFailed what="notifications" onRetry={notifications.reload} />}
      {feed?.items.length === 0 && <p className="text-[16px] text-nav opacity-70">No notifications yet.</p>}
      {feed?.items.map((n) => (
        <article key={n.id} className="flex flex-col gap-[10px] rounded-[24px] border border-stroke2 bg-primary p-5">
          {/* dot pinned to the first line (= centred on Figma's single 22px line) when the title wraps */}
          <div className="flex items-start gap-2">
            <span className={`mt-[6px] size-[10px] shrink-0 rounded-full ${n.read ? "bg-[rgb(106_155_239/0.25)]" : "bg-[#00d14c]"}`} />
            <p className="text-[18px] font-medium tracking-[-0.72px] text-black">{n.title}</p>
          </div>
          {n.detail && <p className="pl-5 text-[16px] tracking-[-0.64px] text-nav opacity-70">{n.detail}</p>}
          <p className="pl-5 text-[14px] tracking-[-0.56px] text-nav opacity-70">{dateTime(n.createdAt)}</p>
        </article>
      ))}
    </div>
  );
}
