"use client";

import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Armchair,
  CalendarCheck2,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  Filter,
  Loader2,
  LogIn,
  LogOut,
  RefreshCw,
  Search,
  Shield,
  UserCheck,
  UserMinus,
  Users,
  UsersRound,
  X,
} from "lucide-react";
import {
  Label as ChartLabel,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { listSeatsAction } from "@/features/places/places.action";
import type { SeatGrid } from "@/features/places/places.schema";
import {
  bulkPointAction,
  getTodayAttendanceForUsersAction,
} from "@/features/presence/presence.action";
import type { UserPresenceItem } from "@/features/presence/presence-users.action";
import { listUsersForPresenceAction } from "@/features/presence/presence-users.action";

type AttendanceStatus = "PRESENT" | "ABSENT" | null;

type UserWithStatus = UserPresenceItem & {
  todayStatus: AttendanceStatus;
  heure_arrivee: string | null;
  heure_depart: string | null;
  seatId: number | null;
  tableNumber: number | null;
  seatNumber: number | null;
};

type RoleFilter = "ALL" | "USER" | "VOLUNTEER";
type StatusFilter = "ALL" | "PRESENT" | "ABSENT" | "NON_POINTE";

const PRESENCE_CHART_CONFIG = {
  present: { label: "Présents", color: "#10b981" },
  absent: { label: "Absents", color: "#ef4444" },
  nonPointe: { label: "Non pointés", color: "#94a3b8" },
} satisfies ChartConfig;

const STATUS_CONFIG: Record<
  "PRESENT" | "ABSENT",
  { label: string; color: string; icon: React.ReactNode }
> = {
  PRESENT: {
    label: "Présent",
    color:
      "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300",
    icon: <CheckCheck className="size-3" />,
  },
  ABSENT: {
    label: "Absent",
    color:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-300",
    icon: <UserMinus className="size-3" />,
  },
};

function StatusBadge({ status }: { status: AttendanceStatus }) {
  if (!status) {
    return (
      <Badge variant="outline" className="gap-1 text-xs text-muted-foreground">
        Non pointé
      </Badge>
    );
  }
  const config = STATUS_CONFIG[status];
  return (
    <Badge
      variant="outline"
      className={`gap-1 text-xs font-medium border ${config.color}`}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
}

function getInitials(prenom: string, nom: string) {
  return `${prenom[0] ?? ""}${nom[0] ?? ""}`.toUpperCase();
}

/** Formate l'heure courante (isNow) au format HH:mm */
function getNowTimeString() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

/** Formate l'heure par défaut de départ (ex: fin d'après-midi 17:00) */
function getDefaultDepartTime() {
  const now = new Date();
  const endHour = Math.max(now.getHours() + 4, 17);
  const normalizedHour = endHour >= 24 ? 18 : endHour;
  return `${String(normalizedHour).padStart(2, "0")}:00`;
}

function todayLabel() {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function UsersPresenceTab() {
  const [users, setUsers] = useState<UserWithStatus[]>([]);
  const [tables, setTables] = useState<SeatGrid[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [isSearchCommandOpen, setIsSearchCommandOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);

  // Drawer & pointage state
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [pointageStatus, setPointageStatus] = useState<"PRESENT" | "ABSENT">(
    "PRESENT"
  );
  const [arrivee, setArrivee] = useState("");
  const [depart, setDepart] = useState("");
  const [isPending, setIsPending] = useState(false);

  // Per-user assignments: { [userId]: { tableNumber: number | null, seatId: number | null } }
  const [assignments, setAssignments] = useState<
    Record<number, { tableNumber: number | null; seatId: number | null }>
  >({});

  const loadData = useCallback(async () => {
    const [usersResult, seatsResult] = await Promise.all([
      listUsersForPresenceAction(),
      listSeatsAction(),
    ]);

    if (!usersResult.success) {
      toast.error(usersResult.error);
      return null;
    }
    const userList = usersResult.data;
    if (userList.length === 0)
      return { users: [], tables: seatsResult.success ? seatsResult.data : [] };

    // Load today's attendance for these users
    const ids = userList.map((u) => u.id);
    const attendanceResult = await getTodayAttendanceForUsersAction(ids);
    const attendanceMap = new Map<
      number,
      {
        statut: string;
        heure_arrivee: string | null;
        heure_depart: string | null;
        seatId: number | null;
        tableNumber: number | null;
        seatNumber: number | null;
      }
    >();
    if (attendanceResult.success) {
      for (const row of attendanceResult.data) {
        attendanceMap.set(row.user_id, {
          statut: row.statut,
          heure_arrivee: row.heure_arrivee,
          heure_depart: row.heure_depart,
          seatId: row.seat_id,
          tableNumber: row.seat?.tableNumber ?? null,
          seatNumber: row.seat?.seatNumber ?? null,
        });
      }
    }

    return {
      users: userList.map((u) => {
        const att = attendanceMap.get(u.id);
        const rawStatut = att?.statut;
        const todayStatus: AttendanceStatus =
          rawStatut === "PRESENT" || rawStatut === "RETARD"
            ? "PRESENT"
            : rawStatut === "ABSENT"
              ? "ABSENT"
              : null;

        return {
          ...u,
          todayStatus,
          heure_arrivee: att?.heure_arrivee ?? null,
          heure_depart: att?.heure_depart ?? null,
          seatId: att?.seatId ?? null,
          tableNumber: att?.tableNumber ?? null,
          seatNumber: att?.seatNumber ?? null,
        };
      }),
      tables: seatsResult.success ? seatsResult.data : [],
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    void loadData()
      .then((result) => {
        if (cancelled || !result) return;
        setUsers(result.users);
        setTables(result.tables);
      })
      .finally(() => setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [loadData]);

  // Filtered list
  const filtered = useMemo(() => {
    let list = users;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (u) =>
          u.nom.toLowerCase().includes(q) ||
          u.prenom.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.matricule ?? "").toLowerCase().includes(q)
      );
    }
    if (roleFilter !== "ALL") {
      list = list.filter((u) => u.role === roleFilter);
    }
    if (statusFilter !== "ALL") {
      if (statusFilter === "NON_POINTE") {
        list = list.filter((u) => !u.todayStatus);
      } else {
        list = list.filter((u) => u.todayStatus === statusFilter);
      }
    }
    return list;
  }, [users, search, roleFilter, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePageIndex = Math.min(pageIndex, pageCount - 1);
  const paginatedUsers = filtered.slice(
    safePageIndex * pageSize,
    (safePageIndex + 1) * pageSize
  );

  // Stats
  const stats = useMemo(() => {
    const total = users.length;
    const present = users.filter((u) => u.todayStatus === "PRESENT").length;
    const absent = users.filter((u) => u.todayStatus === "ABSENT").length;
    const nonPointe = users.filter((u) => !u.todayStatus).length;
    return { total, present, absent, nonPointe };
  }, [users]);

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((u) => selectedIds.has(u.id));
  const someSelected = selectedIds.size > 0;

  function toggleAll() {
    if (allFilteredSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        for (const u of filtered) next.delete(u.id);
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        for (const u of filtered) next.add(u.id);
        return next;
      });
    }
  }

  function toggleUser(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Open Drawer with pre-filled isNow arrival time, default depart, and existing user tables/seats
  function openPointageDrawer(presetIds?: number[]) {
    const targetIds =
      presetIds && presetIds.length > 0 ? presetIds : Array.from(selectedIds);
    if (targetIds.length === 0) {
      toast.error("Veuillez sélectionner au moins un utilisateur.");
      return;
    }

    if (presetIds && presetIds.length > 0) {
      setSelectedIds(new Set(presetIds));
    }

    // Pre-fill arrival with isNow, depart with default closing time
    setArrivee(getNowTimeString());
    setDepart(getDefaultDepartTime());
    setPointageStatus("PRESENT");

    // Initialize per-user assignments with their existing seat or null
    const initialAssignments: Record<
      number,
      { tableNumber: number | null; seatId: number | null }
    > = {};
    for (const uid of targetIds) {
      const foundUser = users.find((u) => u.id === uid);
      initialAssignments[uid] = {
        tableNumber: foundUser?.tableNumber ?? null,
        seatId: foundUser?.seatId ?? null,
      };
    }
    setAssignments(initialAssignments);
    setIsDrawerOpen(true);
  }

  // Handle table change for a specific user
  function handleUserTableChange(userId: number, tableNumberStr: string) {
    const tableNum = tableNumberStr === "NONE" ? null : Number(tableNumberStr);
    setAssignments((prev) => ({
      ...prev,
      [userId]: {
        tableNumber: tableNum,
        seatId: null, // Reset seat when table changes
      },
    }));
  }

  // Handle seat change for a specific user
  function handleUserSeatChange(userId: number, seatIdStr: string) {
    const seatId = seatIdStr === "NONE" ? null : Number(seatIdStr);
    setAssignments((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        seatId,
      },
    }));
  }

  async function handleBulkPoint() {
    if (selectedIds.size === 0) {
      toast.error("Sélectionnez au moins un utilisateur.");
      return;
    }

    // Check for duplicate seat assignments among selected users
    if (pointageStatus === "PRESENT") {
      const assignedSeats: number[] = [];
      for (const id of Array.from(selectedIds)) {
        const sid = assignments[id]?.seatId;
        if (sid) {
          if (assignedSeats.includes(sid)) {
            toast.error(
              "Attention : vous avez assigné le même siège à plusieurs personnes."
            );
            return;
          }
          assignedSeats.push(sid);
        }
      }
    }

    setIsPending(true);
    try {
      const userAssignments = Array.from(selectedIds).map((userId) => ({
        userId,
        seatId:
          pointageStatus === "PRESENT"
            ? (assignments[userId]?.seatId ?? null)
            : null,
      }));

      const result = await bulkPointAction({
        assignments: userAssignments,
        date: todayIso(),
        statut: pointageStatus,
        arrivee: pointageStatus === "PRESENT" ? arrivee || null : null,
        depart: pointageStatus === "PRESENT" ? depart || null : null,
      });

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      const { count, skipped } = result.data;
      toast.success(
        `${count} présence${count > 1 ? "s" : ""} enregistrée${count > 1 ? "s" : ""}${
          skipped > 0 ? ` (${skipped} ignoré${skipped > 1 ? "s" : ""})` : ""
        }.`
      );
      setSelectedIds(new Set());
      setIsDrawerOpen(false);
      setRefreshing(true);
      const _res = await loadData();
      if (_res) {
        setUsers(_res.users);
        setTables(_res.tables);
      }
      setRefreshing(false);
    } finally {
      setIsPending(false);
    }
  }

  function clearFilters() {
    setSearch("");
    setRoleFilter("ALL");
    setStatusFilter("ALL");
    setPageIndex(0);
  }

  const selectedUsersList = useMemo(() => {
    return users.filter((u) => selectedIds.has(u.id));
  }, [users, selectedIds]);

  const hasActiveFilters =
    search || roleFilter !== "ALL" || statusFilter !== "ALL";

  return (
    <div className="grid gap-5">
      {/* Header card with date & stats */}
      <Card className="glass-sm border-primary/20 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <CalendarCheck2 aria-hidden="true" className="size-5" />
              </span>
              <div>
                <CardTitle className="text-base">
                  Pointage des présences
                </CardTitle>
                <CardDescription className="capitalize font-medium text-foreground/80">
                  {todayLabel()}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={async () => {
                  setRefreshing(true);
                  const _res = await loadData();
                  if (_res) {
                    setUsers(_res.users);
                    setTables(_res.tables);
                  }
                  setRefreshing(false);
                }}
                disabled={refreshing}
              >
                <RefreshCw
                  className={`size-4 ${refreshing ? "animate-spin" : ""}`}
                />
                Actualiser
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(220px,280px)] md:items-center">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <StatPill
                label="Total actifs"
                value={stats.total}
                icon={<UsersRound className="size-4" />}
                color="text-foreground"
              />
              <StatPill
                label="Présents"
                value={stats.present}
                icon={<CheckCheck className="size-4" />}
                color="text-emerald-600 dark:text-emerald-400"
              />
              <StatPill
                label="Non pointés"
                value={stats.nonPointe}
                icon={<Users className="size-4" />}
                color="text-muted-foreground"
              />
              <StatPill
                label="Absents"
                value={stats.absent}
                icon={<UserMinus className="size-4" />}
                color="text-destructive"
              />
            </div>
            <div className="grid justify-items-center gap-2">
              <ChartContainer
                config={PRESENCE_CHART_CONFIG}
                className="aspect-square w-full max-w-[220px]"
              >
                <RadialBarChart
                  data={[
                    { name: "Présents", value: stats.present, fill: "#10b981" },
                    { name: "Absents", value: stats.absent, fill: "#ef4444" },
                    {
                      name: "Non pointés",
                      value: stats.nonPointe,
                      fill: "#94a3b8",
                    },
                  ]}
                  dataKey="value"
                  nameKey="name"
                  startAngle={90}
                  endAngle={-270}
                  innerRadius="65%"
                  outerRadius="92%"
                  barSize={22}
                >
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <RadialBar dataKey="value" background cornerRadius={8} />
                  <PolarRadiusAxis
                    tick={false}
                    tickLine={false}
                    axisLine={false}
                  >
                    <ChartLabel
                      content={({ viewBox }) => {
                        if (
                          !viewBox ||
                          !("cx" in viewBox) ||
                          !("cy" in viewBox)
                        )
                          return null;
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy ?? 0) - 4}
                              className="fill-foreground text-2xl font-bold"
                            >
                              {stats.total}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy ?? 0) + 16}
                              className="fill-muted-foreground text-xs"
                            >
                              personnes
                            </tspan>
                          </text>
                        );
                      }}
                    />
                  </PolarRadiusAxis>
                </RadialBarChart>
              </ChartContainer>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {[
                  ["Présents", "bg-emerald-500"],
                  ["Absents", "bg-red-500"],
                  ["Non pointés", "bg-slate-400"],
                ].map(([label, color]) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5"
                  >
                    <span className={`size-2 rounded-full ${color}`} />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Floating Action Bar when users are selected */}
      {someSelected && (
        <Card className="border-primary/40 bg-primary/5 shadow-md">
          <CardContent className="py-3 px-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Badge
                  variant="default"
                  className="gap-1.5 px-2.5 py-1 text-sm font-semibold"
                >
                  <UserCheck className="size-4" />
                  {selectedIds.size} sélectionné
                  {selectedIds.size > 1 ? "s" : ""}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedIds(new Set())}
                  disabled={isPending}
                >
                  <X className="size-4 mr-1" />
                  Désélectionner
                </Button>
                <Button
                  size="sm"
                  className="gap-2 shadow-xs"
                  onClick={() => openPointageDrawer()}
                >
                  <CalendarCheck2 className="size-4" />
                  Pointer la sélection ({selectedIds.size})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter toolbar with Command Palette */}
      <div className="flex flex-wrap items-center gap-2">
        <Popover
          open={isSearchCommandOpen}
          onOpenChange={setIsSearchCommandOpen}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={isSearchCommandOpen}
              className="w-full sm:w-72 justify-between text-left font-normal"
            >
              <div className="flex items-center gap-2 truncate">
                <Search className="size-4 text-muted-foreground shrink-0" />
                <span className="truncate">
                  {search ? search : "Rechercher par nom, matricule…"}
                </span>
              </div>
              <ChevronsUpDown className="size-4 opacity-50 shrink-0 ml-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <Command>
              <CommandInput
                placeholder="Taper pour rechercher…"
                value={search}
                onValueChange={(value) => {
                  setSearch(value);
                  setPageIndex(0);
                }}
              />
              <CommandList>
                <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                  {users.slice(0, 7).map((u) => (
                    <CommandItem
                      key={u.id}
                      value={`${u.prenom} ${u.nom} ${u.matricule ?? ""} ${u.email}`}
                      onSelect={() => {
                        setSearch(`${u.prenom} ${u.nom}`);
                        setIsSearchCommandOpen(false);
                      }}
                      className="cursor-pointer gap-2"
                    >
                      <Avatar className="size-6">
                        <AvatarImage src={u.photo ?? undefined} />
                        <AvatarFallback className="text-[10px]">
                          {getInitials(u.prenom, u.nom)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate">
                        {u.prenom} {u.nom}
                      </span>
                      <Badge
                        variant="outline"
                        className="ml-auto text-[10px] px-1 py-0"
                      >
                        {u.role === "VOLUNTEER" ? "Bénévole" : "USER"}
                      </Badge>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {search && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearch("")}
            className="h-9 px-2 text-muted-foreground"
          >
            <X className="size-4" />
          </Button>
        )}

        <Select
          value={roleFilter}
          onValueChange={(v) => {
            setRoleFilter(v as RoleFilter);
            setPageIndex(0);
          }}
        >
          <SelectTrigger className="w-38 sm:w-44">
            <SelectValue placeholder="Rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les rôles</SelectItem>
            <SelectItem value="USER">Utilisateurs</SelectItem>
            <SelectItem value="VOLUNTEER">Bénévoles</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v as StatusFilter);
            setPageIndex(0);
          }}
        >
          <SelectTrigger className="w-40 sm:w-44">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les statuts</SelectItem>
            <SelectItem value="PRESENT">Présents</SelectItem>
            <SelectItem value="ABSENT">Absents</SelectItem>
            <SelectItem value="NON_POINTE">Non pointés</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-1.5 text-muted-foreground"
          >
            <Filter className="size-3.5" />
            Réinitialiser
          </Button>
        )}

        <span className="ml-auto text-sm text-muted-foreground">
          {filtered.length} / {users.length}
        </span>
      </div>

      {/* Table */}
      <Card className="glass-sm overflow-hidden border-border/60">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Checkbox
                      checked={
                        filtered.length > 0 && allFilteredSelected
                          ? true
                          : filtered.some((u) => selectedIds.has(u.id))
                            ? "indeterminate"
                            : false
                      }
                      onCheckedChange={toggleAll}
                      aria-label="Sélectionner tous les utilisateurs filtrés"
                      disabled={filtered.length === 0}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    {allFilteredSelected
                      ? "Tout désélectionner"
                      : "Tout sélectionner"}
                  </TooltipContent>
                </Tooltip>
              </TableHead>
              <TableHead>Utilisateur / Bénévole</TableHead>
              <TableHead className="hidden sm:table-cell">Rôle</TableHead>
              <TableHead>Présence</TableHead>
              <TableHead className="hidden md:table-cell">
                Table & Siège
              </TableHead>
              <TableHead className="hidden lg:table-cell">Horaires</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 6 }, (_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="size-4 rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-3.5 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24 rounded-full" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-5 w-28 rounded-full" />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-20 ml-auto rounded" />
                  </TableCell>
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center">
                  <Shield
                    aria-hidden="true"
                    className="mx-auto mb-3 size-8 text-muted-foreground"
                  />
                  <p className="font-medium text-foreground">
                    Aucun utilisateur trouvé
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => (
                <React.Fragment key={user.id}>
                  <TableRow
                    onClick={() =>
                      setExpandedUserId((current) =>
                        current === user.id ? null : user.id
                      )
                    }
                    onKeyDown={(event) => {
                      if (event.target !== event.currentTarget) return;
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setExpandedUserId((current) =>
                          current === user.id ? null : user.id
                        );
                      }
                    }}
                    tabIndex={0}
                    aria-expanded={expandedUserId === user.id}
                    aria-label={`Détails de ${user.prenom} ${user.nom}`}
                    className={
                      selectedIds.has(user.id)
                        ? "bg-primary/5 hover:bg-primary/10"
                        : "hover:bg-muted/50"
                    }
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedIds.has(user.id)}
                        onCheckedChange={() => toggleUser(user.id)}
                        aria-label={`Sélectionner ${user.prenom} ${user.nom}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8 shrink-0">
                          <AvatarImage
                            src={user.photo ?? undefined}
                            alt={`${user.prenom} ${user.nom}`}
                          />
                          <AvatarFallback className="text-xs font-medium">
                            {getInitials(user.prenom, user.nom)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {user.prenom} {user.nom}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {user.matricule ? `#${user.matricule} · ` : ""}
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          user.role === "VOLUNTEER"
                            ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300"
                            : "text-muted-foreground"
                        }`}
                      >
                        {user.role === "VOLUNTEER" ? "Bénévole" : "Utilisateur"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={user.todayStatus} />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {user.tableNumber ? (
                        <Badge
                          variant="secondary"
                          className="gap-1 text-xs font-normal"
                        >
                          <Armchair className="size-3" />
                          Table {user.tableNumber}
                          {user.seatNumber ? ` · Siège ${user.seatNumber}` : ""}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {user.heure_arrivee || user.heure_depart ? (
                        <span className="text-xs text-muted-foreground tabular-nums font-mono">
                          {user.heure_arrivee ?? "--:--"}
                          {" → "}
                          {user.heure_depart ?? "--:--"}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          aria-label={`Détails de ${user.prenom} ${user.nom}`}
                          aria-expanded={expandedUserId === user.id}
                          onClick={() =>
                            setExpandedUserId((current) =>
                              current === user.id ? null : user.id
                            )
                          }
                        >
                          <ChevronDown
                            className={`size-4 transition-transform ${expandedUserId === user.id ? "rotate-180" : ""}`}
                          />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1 text-xs"
                          onClick={(event) => {
                            event.stopPropagation();
                            openPointageDrawer([user.id]);
                          }}
                        >
                          <CalendarCheck2 className="size-3.5" />
                          Pointer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow
                    className={`hover:bg-transparent ${expandedUserId === user.id ? "" : "hidden"}`}
                  >
                    <TableCell colSpan={7} className="p-0">
                      <div>
                        <div className="grid gap-3 border-t bg-muted/20 px-5 py-4 sm:grid-cols-2 lg:grid-cols-4">
                          <DetailItem label="Email" value={user.email} />
                          <DetailItem
                            label="Matricule"
                            value={user.matricule || "Non renseigné"}
                          />
                          <DetailItem
                            label="Arrivée"
                            value={user.heure_arrivee || "Non enregistrée"}
                          />
                          <DetailItem
                            label="Départ"
                            value={user.heure_depart || "Non enregistré"}
                          />
                          <DetailItem
                            label="Table"
                            value={
                              user.tableNumber
                                ? `Table ${user.tableNumber}`
                                : "Non attribuée"
                            }
                          />
                          <DetailItem
                            label="Siège"
                            value={
                              user.seatNumber
                                ? `Siège ${user.seatNumber}`
                                : "Non attribué"
                            }
                          />
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Statut du jour
                            </p>
                            <StatusBadge status={user.todayStatus} />
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {!loading && filtered.length > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {safePageIndex * pageSize + 1}–
            {Math.min((safePageIndex + 1) * pageSize, filtered.length)} sur{" "}
            {filtered.length} personnes
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={String(pageSize)}
              onValueChange={(value) => setPageSize(Number(value))}
            >
              <SelectTrigger
                className="h-9 w-[115px]"
                aria-label="Nombre de lignes par page"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size} par page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="min-w-20 text-center text-sm text-muted-foreground">
              Page {safePageIndex + 1} / {pageCount}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="size-9"
              aria-label="Première page"
              onClick={() => setPageIndex(0)}
              disabled={safePageIndex === 0}
            >
              <ChevronsLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-9"
              aria-label="Page précédente"
              onClick={() => setPageIndex((page) => Math.max(0, page - 1))}
              disabled={safePageIndex === 0}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-9"
              aria-label="Page suivante"
              onClick={() =>
                setPageIndex((page) => Math.min(pageCount - 1, page + 1))
              }
              disabled={safePageIndex >= pageCount - 1}
            >
              <ChevronRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-9"
              aria-label="Dernière page"
              onClick={() => setPageIndex(pageCount - 1)}
              disabled={safePageIndex >= pageCount - 1}
            >
              <ChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      ) : null}

      {/* Pointage Drawer with per-user Table & Seat assignment */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-w-2xl mx-auto max-h-[85vh] flex flex-col">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2 text-lg">
              <CalendarCheck2 className="size-5 text-primary" />
              Pointage du jour
            </DrawerTitle>
            <DrawerDescription className="capitalize font-medium text-foreground/80">
              {todayLabel()}
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 py-2 space-y-5 overflow-y-auto flex-1">
            {/* Statut & Horaires pré-remplis */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field>
                <FieldLabel htmlFor="drawer-statut">Statut</FieldLabel>
                <FieldContent>
                  <Select
                    value={pointageStatus}
                    onValueChange={(v) =>
                      setPointageStatus(v as "PRESENT" | "ABSENT")
                    }
                  >
                    <SelectTrigger id="drawer-statut" className="h-9 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRESENT">
                        <div className="flex items-center gap-2 text-emerald-600 font-medium">
                          <CheckCheck className="size-4" />
                          Présent
                        </div>
                      </SelectItem>
                      <SelectItem value="ABSENT">
                        <div className="flex items-center gap-2 text-red-600 font-medium">
                          <UserMinus className="size-4" />
                          Absent
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>

              {pointageStatus === "PRESENT" && (
                <>
                  <Field>
                    <FieldLabel
                      htmlFor="drawer-arrivee"
                      className="flex items-center justify-between"
                    >
                      <span className="flex items-center gap-1">
                        <LogIn className="size-3.5 text-primary" />
                        Arrivée
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        className="h-4 px-1 text-[10px] text-primary"
                        onClick={() => setArrivee(getNowTimeString())}
                      >
                        Maintenant
                      </Button>
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id="drawer-arrivee"
                        type="time"
                        value={arrivee}
                        onChange={(e) => setArrivee(e.target.value)}
                        className="h-9 font-mono"
                      />
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel
                      htmlFor="drawer-depart"
                      className="flex items-center justify-between"
                    >
                      <span className="flex items-center gap-1">
                        <LogOut className="size-3.5 text-muted-foreground" />
                        Départ
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        className="h-4 px-1 text-[10px] text-muted-foreground"
                        onClick={() => setDepart(getNowTimeString())}
                      >
                        Maintenant
                      </Button>
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id="drawer-depart"
                        type="time"
                        value={depart}
                        onChange={(e) => setDepart(e.target.value)}
                        className="h-9 font-mono"
                      />
                    </FieldContent>
                  </Field>
                </>
              )}
            </div>

            {/* Affectation des Tables et Sièges par utilisateur sélectionné */}
            {pointageStatus === "PRESENT" && (
              <FieldGroup className="space-y-3">
                <div className="flex items-center justify-between">
                  <FieldLabel className="text-sm font-semibold">
                    Attribution des tables et sièges ({selectedUsersList.length}
                    )
                  </FieldLabel>
                  <span className="text-xs text-muted-foreground">
                    Choisissez la place de chaque personne
                  </span>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {selectedUsersList.map((u) => {
                    const currentTableNum =
                      assignments[u.id]?.tableNumber ?? null;
                    const currentSeatId = assignments[u.id]?.seatId ?? null;
                    const selectedTableObj = tables.find(
                      (t) => t.tableNumber === currentTableNum
                    );

                    return (
                      <div
                        key={u.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border bg-card shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-44">
                          <Avatar className="size-8 shrink-0">
                            <AvatarImage src={u.photo ?? undefined} />
                            <AvatarFallback className="text-xs">
                              {getInitials(u.prenom, u.nom)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="truncate">
                            <p className="text-sm font-medium truncate">
                              {u.prenom} {u.nom}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {u.role === "VOLUNTEER"
                                ? "Bénévole"
                                : "Utilisateur"}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 sm:w-72 shrink-0">
                          {/* Table select */}
                          <Select
                            value={
                              currentTableNum ? String(currentTableNum) : "NONE"
                            }
                            onValueChange={(val) =>
                              handleUserTableChange(u.id, val)
                            }
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Table" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="NONE">Sans table</SelectItem>
                              {tables.map((tbl) => (
                                <SelectItem
                                  key={tbl.tableNumber}
                                  value={String(tbl.tableNumber)}
                                >
                                  Table {tbl.tableNumber}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {/* Seat select */}
                          <Select
                            value={
                              currentSeatId ? String(currentSeatId) : "NONE"
                            }
                            onValueChange={(val) =>
                              handleUserSeatChange(u.id, val)
                            }
                            disabled={!currentTableNum}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Siège" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="NONE">Sans siège</SelectItem>
                              {selectedTableObj?.seats.map((seat) => (
                                <SelectItem
                                  key={seat.id}
                                  value={String(seat.id)}
                                >
                                  {seat.label ?? `Siège ${seat.seatNumber}`}
                                  {seat.occupiedToday && seat.id !== u.seatId
                                    ? " (occupé)"
                                    : ""}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </FieldGroup>
            )}
          </div>

          <DrawerFooter className="pt-3 border-t">
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 w-full">
              <DrawerClose asChild>
                <Button variant="outline" disabled={isPending}>
                  Annuler
                </Button>
              </DrawerClose>
              <Button
                onClick={() => void handleBulkPoint()}
                disabled={isPending || selectedIds.size === 0}
                className="gap-2 shadow-xs"
              >
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Check className="size-4" />
                )}
                {isPending
                  ? "Enregistrement…"
                  : `Valider le pointage (${selectedIds.size})`}
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

function StatPill({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border bg-card px-3.5 py-2.5 shadow-2xs">
      <span className={color}>{icon}</span>
      <div>
        <p className={`text-lg font-bold leading-none ${color}`}>{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="truncate text-sm font-medium" title={value}>
        {value}
      </p>
    </div>
  );
}
