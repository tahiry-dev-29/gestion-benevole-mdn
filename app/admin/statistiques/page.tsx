import { CalendarCheck, CalendarDays, Coins, Users } from "lucide-react";

import { AdminBreadcrumb } from "@/components/shared/admin-breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAdminStatistics } from "@/features/admin/metrics";
import { PageHeader } from "@/features/admin/page-header";
import { StatsActivityPanel } from "@/features/admin/tabs/stats-activity-panel";
import { StatsCreditsPanel } from "@/features/admin/tabs/stats-credits-panel";
import { StatsPresencePanel } from "@/features/admin/tabs/stats-presence-panel";
import { StatsVolunteerPanel } from "@/features/admin/tabs/stats-volunteer-panel";

export default async function StatistiquesPage() {
  const metrics = await getAdminStatistics();

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-5">
      <AdminBreadcrumb
        items={[
          { label: "Administration", href: "/admin/dashboard" },
          { label: "Statistiques" },
        ]}
      />
      <PageHeader
        title="Statistiques"
        description="Une lecture claire de l’activité associative."
      />
      <Tabs defaultValue="benevoles" className="grid gap-5">
        <TabsList className="glass-sm grid h-auto w-full max-w-full grid-cols-2 justify-start gap-1 p-1 sm:flex sm:w-fit">
          <TabsTrigger
            value="benevoles"
            className="min-h-10 flex-none gap-2 px-3"
          >
            <Users aria-hidden="true" /> Bénévoles
          </TabsTrigger>
          <TabsTrigger
            value="presences"
            className="min-h-10 flex-none gap-2 px-3"
          >
            <CalendarCheck aria-hidden="true" /> Présences
          </TabsTrigger>
          <TabsTrigger
            value="credits"
            className="min-h-10 flex-none gap-2 px-3"
          >
            <Coins aria-hidden="true" /> Crédits
          </TabsTrigger>
          <TabsTrigger
            value="activites"
            className="min-h-10 flex-none gap-2 px-3"
          >
            <CalendarDays aria-hidden="true" /> Activités
          </TabsTrigger>
        </TabsList>
        <TabsContent value="benevoles">
          <StatsVolunteerPanel
            statuses={metrics.volunteerStatuses}
            categories={metrics.volunteerCategories}
            newThisMonth={metrics.volunteersThisMonth}
            trend={metrics.trends.volunteers}
          />
        </TabsContent>
        <TabsContent value="presences">
          <StatsPresencePanel
            today={metrics.presentToday}
            days={metrics.attendanceDays}
            trend={metrics.trends.presences}
          />
        </TabsContent>
        <TabsContent value="credits">
          <StatsCreditsPanel
            total={metrics.totalCredits}
            users={metrics.creditUsers}
          />
        </TabsContent>
        <TabsContent value="activites">
          <StatsActivityPanel
            statuses={metrics.activityStatuses}
            published={metrics.publishedActivities}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
