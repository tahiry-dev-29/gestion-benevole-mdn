"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ChartPoint = {
  date: string;
  presences: number;
  inscriptions: number;
};

const chartConfig = {
  presences: {
    label: "Présences",
    color: "hsl(var(--chart-1))",
  },
  inscriptions: {
    label: "Inscriptions",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

function formatDate(dateStr: string, format: "short" | "long" = "short") {
  const date = new Date(dateStr + "T00:00:00Z");
  if (format === "long") {
    return date.toLocaleDateString("fr-FR", {
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  }
  return date.toLocaleDateString("fr-FR", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

interface DashboardAreaChartProps {
  data: ChartPoint[];
}

export function DashboardAreaChart({ data }: DashboardAreaChartProps) {
  const [timeRange, setTimeRange] = React.useState<"7" | "14" | "30">("30");

  const days = parseInt(timeRange, 10);
  const filteredData = data.slice(-days);

  const totalPresences = filteredData.reduce((s, d) => s + d.presences, 0);
  const totalInscriptions = filteredData.reduce(
    (s, d) => s + d.inscriptions,
    0
  );

  return (
    <Card className="glass-sm">
      <CardHeader className="flex flex-col gap-2 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Activité — Présences & Inscriptions</CardTitle>
          <CardDescription>
            {totalPresences} présences · {totalInscriptions} inscriptions sur{" "}
            {days} jours
          </CardDescription>
        </div>
        <Select
          value={timeRange}
          onValueChange={(v) => setTimeRange(v as "7" | "14" | "30")}
        >
          <SelectTrigger className="w-40 rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="30">30 derniers jours</SelectItem>
            <SelectItem value="14">14 derniers jours</SelectItem>
            <SelectItem value="7">7 derniers jours</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[260px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillPresences" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-presences)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-presences)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient
                id="fillInscriptions"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-inscriptions)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-inscriptions)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={days > 14 ? 6 : 2}
              tickFormatter={(v) => formatDate(v, "short")}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              allowDecimals={false}
              width={30}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => formatDate(value, "long")}
                  indicator="dot"
                />
              }
            />

            <Area
              dataKey="presences"
              type="natural"
              fill="url(#fillPresences)"
              stroke="var(--color-presences)"
              stackId="a"
            />
            <Area
              dataKey="inscriptions"
              type="natural"
              fill="url(#fillInscriptions)"
              stroke="var(--color-inscriptions)"
              stackId="b"
            />

            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
