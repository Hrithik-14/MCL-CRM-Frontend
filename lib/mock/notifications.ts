// Mock data for Notifications (Figma 1:6702). Frontend only.
export type Notification = { id: number; title: string; detail: string; time: string; unread: boolean };

export const NOTIFICATIONS: Notification[] = [true, true, false, false, false].map((unread, i) => ({
  id: i + 1,
  title: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
  detail: "Meeting With Deepak Nair ( Global Trade Inc ) At 2:30",
  time: "09/02/2026, 4:43 PM",
  unread,
}));
