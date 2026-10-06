"use client";

import { useMemo, useState } from "react";
import {
  BadgeCheck,
  CircleUserRound,
  UserRoundX,
  UsersRound,
} from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { UserItem } from "../types";

const trendConfig = {
  inscriptions: { label: "Inscriptions", color: "var(--chart-1)" },
} satisfies ChartConfig;

const comparisonConfig = {
  actifs: { label: "Comptes actifs", color: "var(--chart-1)" },
  certificats: { label: "Certificats approuvés", color: "var(--chart-2)" },
} satisfies ChartConfig;

const monthLabel = new Intl.DateTimeFormat("fr-FR", {
  month: "short",
  timeZone: "UTC",
});

function makeMonthlyData(users: UserItem[]) {
  const now = new Date();
  const months = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(
      Date.UTC(now.getFullYear(), now.getMonth() - 11 + index, 1)
    );
    return {
      key: `${date.getUTCFullYear()}-${date.getUTCMonth()}`,
      mois: monthLabel.format(date),
      inscriptions: 0,
      actifs: 0,
      certificats: 0,
    };
  });
  const byMonth = new Map(months.map((month) => [month.key, month]));

  users.forEach((user) => {
    const date = new Date(user.createdAt);
    if (Number.isNaN(date.getTime())) return;
    const month = byMonth.get(`${date.getFullYear()}-${date.getMonth()}`);
    if (month) {
      month.inscriptions += 1;
      if (user.statut === "ACTIF") month.actifs += 1;
      if (user.certificatStatut === "APPROUVE") month.certificats += 1;
    }
  });

  return months;
}

export function UsersAnalyticsTab({ users }: { users: UserItem[] }) {
  const [range, setRange] = useState<"6" | "12">("12");
  const total = users.length;
  const active = users.filter((user) => user.statut === "ACTIF").length;
  const inactive = users.filter((user) => user.statut === "INACTIF").length;
  const approved = users.filter(
    (user) => user.certificatStatut === "APPROUVE"
  ).length;
  const pending = users.filter(
    (user) => user.certificatStatut === "EN_ATTENTE"
  ).length;
  const percentage = (count: number) => (total ? (count / total) * 100 : 0);
  const monthlyData = useMemo(() => makeMonthlyData(users), [users]);
  const visibleData = monthlyData.slice(-Number(range));

  const metrics = [
    { label: "Comptes USER", value: total, icon: UsersRound },
    { label: "Actifs", value: active, icon: CircleUserRound },
    { label: "Certificats approuvés", value: approved, icon: BadgeCheck },
    { label: "Inactifs", value: inactive, icon: UserRoundX },
  ];

  return (
    <div className="grid min-w-0 gap-4">
      <div className="grid min-w-0 grid-cols-2 gap-3 xl:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="glass-sm min-w-0">
            <CardHeader className="flex flex-row items-start justify-between gap-2 p-4 sm:gap-3 sm:p-6">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <Icon aria-hidden="true" className="size-4 shrink-0 text-primary" />
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
              <p className="text-3xl font-semibold tracking-tight tabular-nums">
                {value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid min-w-0 gap-4 xl:grid-cols-2">
        <Card className="glass-sm min-w-0 overflow-hidden">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">
                Inscriptions dans le temps
              </CardTitle>
              <CardDescription>Nouveaux comptes USER par mois</CardDescription>
            </div>
            <Select
              value={range}
              onValueChange={(value) => setRange(value as "6" | "12")}
            >
              <SelectTrigger
                className="w-full sm:w-36"
                aria-label="Période des inscriptions"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6 derniers mois</SelectItem>
                <SelectItem value="12">12 derniers mois</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="px-2 sm:px-5">
            {total === 0 ? (
              <ChartEmpty />
            ) : (
              <ChartContainer config={trendConfig} className="h-[220px] w-full">
                <LineChart
                  data={visibleData}
                  margin={{ left: 0, right: 12, top: 8 }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="mois"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={16}
                  />
                  <YAxis
                    allowDecimals={false}
                    width={28}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <Line
                    type="monotone"
                    dataKey="inscriptions"
                    stroke="var(--color-inscriptions)"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "var(--color-inscriptions)" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="glass-sm min-w-0 overflow-hidden">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base">Inscriptions actives & certificats</CardTitle>
            <CardDescription>
              Comptes actifs et certificats approuvés parmi les inscriptions du mois
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 sm:px-5">
            {total === 0 ? (
              <ChartEmpty />
            ) : (
              <ChartContainer
                config={comparisonConfig}
                className="h-[220px] w-full"
              >
                <LineChart
                  data={visibleData}
                  margin={{ left: 0, right: 16, top: 12 }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="mois"
                    tickLine={false}
                    axisLine={false}
                    minTickGap={16}
                  />
                  <YAxis
                    allowDecimals={false}
                    domain={[0, "auto"]}
                    width={28}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line
                    type="monotone"
                    dataKey="actifs"
                    stroke="var(--color-actifs)"
                    strokeWidth={2}
                    dot={{ r: 6, fill: "var(--color-actifs)" }}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="certificats"
                    stroke="var(--color-certificats)"
                    strokeWidth={2}
                    dot={{ r: 6, fill: "var(--color-certificats)" }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>État des dossiers</CardTitle>
          <CardDescription>
            Répartition des comptes USER selon leur statut et leur certificat.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="grid gap-2">
            <ProgressMetric
              label="Comptes actifs"
              count={active}
              total={total}
              value={percentage(active)}
            />
            <ProgressMetric
              label="Certificats approuvés"
              count={approved}
              total={total}
              value={percentage(approved)}
            />
          </div>
          <div className="grid gap-2">
            <ProgressMetric
              label="À vérifier"
              count={pending}
              total={total}
              value={percentage(pending)}
            />
            <ProgressMetric
              label="Comptes inactifs"
              count={inactive}
              total={total}
              value={percentage(inactive)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProgressMetric({
  label,
  count,
  total,
  value,
}: {
  label: string;
  count: number;
  total: number;
  value: number;
}) {
  return (
    <>
      <div className="flex justify-between gap-3 text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground">
          {count} / {total}
        </span>
      </div>
      <Progress value={value} aria-label={label} />
    </>
  );
}

function ChartEmpty() {
  return (
    <div className="flex h-[220px] items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
      Aucune donnée utilisateur à afficher.
    </div>
  );
}
