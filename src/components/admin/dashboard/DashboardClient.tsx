"use client";

// Client root for the admin dashboard. Receives fully-serialized data from
// the server component and handles all presentation. LazyMotion keeps the
// Framer Motion bundle small; MotionConfig honors prefers-reduced-motion.

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import { ActivityFeed } from "./ActivityFeed";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSearch } from "./DashboardSearch";
import { QuickActions } from "./QuickActions";
import { RecentShortcuts } from "./RecentShortcuts";
import { StatCards } from "./StatCards";
import {
  LatestTestimonials,
  RecentEvents,
  RecentPlacements,
  RecentUploads,
  SystemStatus,
} from "./Widgets";
import { Reveal } from "./ui";
import type { DashboardData, DashboardUser } from "./types";

export function DashboardClient({
  data,
  user,
}: {
  data: DashboardData;
  user: DashboardUser;
}) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div className="jct-dash flex-1 bg-(--dash-bg)">
          <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Reveal>
              <DashboardHeader user={user} activity={data.activity} />
            </Reveal>

            <Reveal delay={0.05} className="mt-6">
              <DashboardSearch />
            </Reveal>

            <div className="mt-6">
              <StatCards stats={data.stats} weekly={data.weekly} />
            </div>

            <Reveal delay={0.1} className="mt-8">
              <QuickActions />
            </Reveal>

            <Reveal delay={0.12} className="mt-8 empty:mt-0">
              <RecentShortcuts />
            </Reveal>

            <Reveal delay={0.15} className="mt-8">
              <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
                <ActivityFeed items={data.activity} className="lg:col-span-2" />
                <div className="grid grid-cols-1 gap-6">
                  <SystemStatus
                    dbOk={data.dbOk}
                    storage={data.storage}
                    stats={data.stats}
                    lastActivity={data.activity[0]?.createdAt}
                  />
                  <RecentPlacements items={data.placementRecords} />
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2} className="mt-6">
              <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
                <RecentEvents items={data.events} />
                <RecentUploads items={data.uploads} />
                <LatestTestimonials items={data.latestTestimonials} />
              </div>
            </Reveal>
          </div>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
