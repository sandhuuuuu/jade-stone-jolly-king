import { addDays, format, isSameMonth, startOfMonth, startOfWeek } from "date-fns";

export const HABIT_COLORS = [
  { id: "moss", label: "Moss" },
  { id: "tide", label: "Tide" },
  { id: "clay", label: "Clay" },
  { id: "slate", label: "Slate" },
  { id: "wine", label: "Wine" },
  { id: "umber", label: "Umber" },
] as const;

export type HabitColor = (typeof HABIT_COLORS)[number]["id"];
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type TrackerView = "today" | "week" | "month";

export type Habit = {
  id: string;
  name: string;
  color: HabitColor;
  days: Weekday[];
  createdAt: string;
};

export const WEEKDAYS: { id: Weekday; narrow: string; short: string; long: string }[] = [
  { id: 1, narrow: "M", short: "Mon", long: "Monday" },
  { id: 2, narrow: "T", short: "Tue", long: "Tuesday" },
  { id: 3, narrow: "W", short: "Wed", long: "Wednesday" },
  { id: 4, narrow: "T", short: "Thu", long: "Thursday" },
  { id: 5, narrow: "F", short: "Fri", long: "Friday" },
  { id: 6, narrow: "S", short: "Sat", long: "Saturday" },
  { id: 0, narrow: "S", short: "Sun", long: "Sunday" },
];

const COLOR_SET = new Set<string>(HABIT_COLORS.map((color) => color.id));

export function habitColor(color: string | undefined): HabitColor {
  return COLOR_SET.has(color ?? "") ? (color as HabitColor) : "moss";
}

export function habitVar(color: HabitColor): string {
  return `var(--habit-${color})`;
}

export function activeDays(days: Weekday[] | undefined): Weekday[] {
  const clean = (days ?? []).filter(
    (day): day is Weekday => day === 0 || day === 1 || day === 2 || day === 3 || day === 4 || day === 5 || day === 6,
  );
  const unique = WEEKDAYS.map((day) => day.id).filter((day) => clean.includes(day));
  return unique.length > 0 ? unique : WEEKDAYS.map((day) => day.id);
}

export function scheduleLabel(days: Weekday[] | undefined): string {
  const set = new Set(activeDays(days));
  if (set.size === 7) return "Every day";
  const weekdays: Weekday[] = [1, 2, 3, 4, 5];
  const weekend: Weekday[] = [6, 0];
  if (set.size === 5 && weekdays.every((day) => set.has(day))) return "Weekdays";
  if (set.size === 2 && weekend.every((day) => set.has(day))) return "Weekends";
  return WEEKDAYS.filter((day) => set.has(day.id))
    .map((day) => day.short)
    .join(" ");
}

export function nextColor(habits: Habit[]): HabitColor {
  const counts = new Map<HabitColor, number>(HABIT_COLORS.map((color) => [color.id, 0]));
  for (const habit of habits) {
    const color = habitColor(habit.color);
    counts.set(color, (counts.get(color) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => a[1] - b[1])[0]?.[0] ?? "moss";
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function dateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year || 1970, (month || 1) - 1, day || 1);
}

export function isScheduled(days: Weekday[] | undefined, date: Date): boolean {
  return activeDays(days).includes(date.getDay() as Weekday);
}

export function logKeys(logs: Record<string, string[]> | undefined, id: string): string[] {
  const raw = logs?.[id];
  if (!Array.isArray(raw)) return [];
  return raw.filter((key) => typeof key === "string");
}

export type DayStatus = "done" | "missed" | "future" | "off" | "today-open";

export function dayStatus(
  days: Weekday[] | undefined,
  logs: readonly string[],
  day: Date,
  today: Date,
): DayStatus {
  if (!isScheduled(days, day)) return "off";
  const key = dateKey(day);
  const todayKey = dateKey(today);
  if (logs.includes(key)) return "done";
  if (key > todayKey) return "future";
  if (key === todayKey) return "today-open";
  return "missed";
}

export function weekStart(date: Date): Date {
  return startOfDay(startOfWeek(startOfDay(date), { weekStartsOn: 1 }));
}

export function monthStart(date: Date): Date {
  return startOfMonth(startOfDay(date));
}

export function shiftMonth(date: Date, amount: number): Date {
  const start = monthStart(date);
  return new Date(start.getFullYear(), start.getMonth() + amount, 1);
}

export function monthCells(anchor: Date): Date[] {
  const start = monthStart(anchor);
  const gridStart = weekStart(start);
  const cells = Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
  if (!cells.slice(35).some((day) => isSameMonth(day, start))) cells.splice(35, 7);
  if (cells.length > 28 && !cells.slice(28).some((day) => isSameMonth(day, start))) cells.splice(28, 7);
  return cells;
}

export function trailingDays(today: Date, count: number): Date[] {
  const start = addDays(startOfDay(today), -(count - 1));
  return Array.from({ length: count }, (_, index) => addDays(start, index));
}

export function currentStreak(days: Weekday[] | undefined, logs: readonly string[], today: Date): number {
  const done = new Set(logs);
  let cursor = startOfDay(today);
  if (!done.has(dateKey(cursor))) cursor = addDays(cursor, -1);
  let streak = 0;
  for (let i = 0; i < 4000; i += 1) {
    if (isScheduled(days, cursor)) {
      if (!done.has(dateKey(cursor))) break;
      streak += 1;
    }
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function bestStreak(days: Weekday[] | undefined, logs: readonly string[], today: Date): number {
  if (logs.length === 0) return 0;
  const done = new Set(logs);
  let earliest = logs[0] ?? dateKey(today);
  for (const key of logs) if (key < earliest) earliest = key;
  let cursor = parseKey(earliest);
  const endKey = dateKey(today);
  let best = 0;
  let run = 0;
  for (let i = 0; i < 4000; i += 1) {
    const key = dateKey(cursor);
    if (key > endKey) break;
    if (isScheduled(days, cursor)) {
      if (done.has(key)) {
        run += 1;
        if (run > best) best = run;
      } else if (key !== endKey) {
        run = 0;
      }
    }
    cursor = addDays(cursor, 1);
  }
  return best;
}

export function periodStats(
  days: Weekday[] | undefined,
  logs: readonly string[],
  start: Date,
  end: Date,
  today: Date,
): { done: number; scheduled: number } {
  const doneSet = new Set(logs);
  const startKey = dateKey(startOfDay(start));
  const lastKey = dateKey(startOfDay(end)) < dateKey(startOfDay(today)) ? dateKey(startOfDay(end)) : dateKey(startOfDay(today));
  if (lastKey < startKey) return { done: 0, scheduled: 0 };
  let cursor = parseKey(startKey);
  let done = 0;
  let scheduled = 0;
  for (let i = 0; i < 400; i += 1) {
    const key = dateKey(cursor);
    if (key > lastKey) break;
    if (isScheduled(days, cursor)) {
      scheduled += 1;
      if (doneSet.has(key)) done += 1;
    }
    cursor = addDays(cursor, 1);
  }
  return { done, scheduled };
}

export function habitStats(days: Weekday[] | undefined, logs: readonly string[], today: Date) {
  const month = periodStats(days, logs, monthStart(today), today, today);
  return {
    streak: currentStreak(days, logs, today),
    best: bestStreak(days, logs, today),
    month,
  };
}

export function statsLine(stats: ReturnType<typeof habitStats>): string {
  const streak = stats.streak === 1 ? "1-day streak" : `${stats.streak}-day streak`;
  const month =
    stats.month.scheduled === 0 ? "none this month" : `${stats.month.done}/${stats.month.scheduled} this month`;
  return `${streak} · best ${stats.best} · ${month}`;
}

export function tally(
  habits: Habit[],
  logs: Record<string, string[]>,
  start: Date,
  end: Date,
  today: Date,
) {
  let done = 0;
  let scheduled = 0;
  for (const habit of habits) {
    const stats = periodStats(habit.days, logKeys(logs, habit.id), start, end, today);
    done += stats.done;
    scheduled += stats.scheduled;
  }
  const pct = scheduled === 0 ? 0 : Math.round((done / scheduled) * 100);
  return { done, scheduled, pct };
}

export function formatWeekTitle(start: Date): string {
  const end = addDays(start, 6);
  if (start.getMonth() === end.getMonth()) return `${format(start, "d")}–${format(end, "d MMM")}`;
  return `${format(start, "d MMM")} – ${format(end, "d MMM")}`;
}

export function orderDays(days: Weekday[]): Weekday[] {
  return activeDays(days);
}

function collect(
  days: Weekday[],
  today: Date,
  back: number,
  keep: (ago: number) => boolean,
): string[] {
  const keys: string[] = [];
  for (let ago = back; ago >= 0; ago -= 1) {
    const day = addDays(today, -ago);
    if (!isScheduled(days, day)) continue;
    if (keep(ago)) keys.push(dateKey(day));
  }
  return keys;
}

export function buildSeed(today: Date): { habits: Habit[]; logs: Record<string, string[]> } {
  const origin = new Date(today.getTime() - 1000 * 60 * 60 * 24 * 50).toISOString();
  const every: Weekday[] = [0, 1, 2, 3, 4, 5, 6];
  const habits: Habit[] = [
    { id: crypto.randomUUID(), name: "Morning walk", color: "moss", days: every, createdAt: origin },
    { id: crypto.randomUUID(), name: "Read 20 pages", color: "tide", days: every, createdAt: origin },
    { id: crypto.randomUUID(), name: "Strength", color: "clay", days: [1, 3, 5], createdAt: origin },
    { id: crypto.randomUUID(), name: "Lights out by 11", color: "slate", days: every, createdAt: origin },
  ];
  const [walk, read, strength, lights] = habits;
  const logs: Record<string, string[]> = {
    [walk.id]: collect(walk.days, today, 40, (ago) => ago <= 20),
    [read.id]: collect(read.days, today, 40, (ago) => ago !== 0 && ago <= 27 && ago % 4 !== 0),
    [strength.id]: collect(strength.days, today, 42, (ago) => ago !== 0),
    [lights.id]: collect(lights.days, today, 40, (ago) => ago !== 0 && ago <= 18 && ago % 5 !== 0),
  };
  return { habits, logs };
}
