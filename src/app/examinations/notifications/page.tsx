import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { examinationsData } from "@/data/examinations";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Exam Notifications | ${siteConfig.name}`,
  description:
    "Stay updated with the latest examination announcements, schedules, and notifications at JCT Institutions.",
  openGraph: {
    title: `Exam Notifications | ${siteConfig.name}`,
    description:
      "Stay updated with the latest examination announcements, schedules, and notifications at JCT Institutions.",
    type: "website",
  },
};

export default function NotificationsPage() {
  const { title, subtitle, notifications } = examinationsData.notifications;

  return (
    <ContentPageLayout
      title={title}
      subtitle={subtitle}
      breadcrumbs={[
        { label: "Examinations", href: "/examinations" },
        { label: "Notifications" },
      ]}
    >
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.title}
            className="border-border rounded-xl border p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-foreground font-sans text-sm font-semibold">
                  {notification.title}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {notification.description}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <span className="bg-gold/10 text-gold rounded-full px-2.5 py-0.5 text-xs font-medium">
                  {notification.type}
                </span>
                <p className="text-muted-foreground mt-1 text-xs">
                  {notification.date}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ContentPageLayout>
  );
}
