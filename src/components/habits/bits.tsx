import type { ButtonHTMLAttributes, CSSProperties } from "react";
import { Check } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  dateKey,
  dayStatus,
  habitColor,
  habitVar,
  scheduleLabel,
  type Habit,
  type TrackerView,
} from "@/lib/habits/model";

const VIEWS: { id: TrackerView; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
];

export function ViewSwitch({ value, onChange }: { value: TrackerView; onChange: (view: TrackerView) => void }) {
  const index = Math.max(0, VIEWS.findIndex((view) => view.id === value));
  return (
    <div className="segment" style={{ "--index": index } as CSSProperties} role="group" aria-label="Choose a view">
      <span className="segment-thumb" aria-hidden />
      {VIEWS.map((view) => (
        <button
          key={view.id}
          type="button"
          className={cn("segment-btn", value === view.id && "is-active")}
          aria-pressed={value === view.id}
          onClick={() => onChange(view.id)}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
}

export function Meter({ done, scheduled, label }: { done: number; scheduled: number; label: string }) {
  const pct = scheduled === 0 ? 0 : Math.round((done / scheduled) * 100);
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <p className="text-sm text-muted" aria-live="polite">
          {label}
        </p>
        {scheduled > 0 && <p className="nums text-sm font-medium">{pct}%</p>}
      </div>
      <div
        className="progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={scheduled}
        aria-valuenow={done}
        aria-label={label}
      >
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function HabitIdentity({ habit }: { habit: Habit }) {
  return (
    <span className="flex min-w-0 items-start gap-2">
      <span className="habit-dot" style={{ background: habitVar(habitColor(habit.color)) }} aria-hidden />
      <span className="min-w-0">
        <span className="block truncate font-medium" title={habit.name}>
          {habit.name}
        </span>
        <span className="block text-sm text-muted">{scheduleLabel(habit.days)}</span>
      </span>
    </span>
  );
}

export function IconButton({
  label,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button type="button" className="icon-btn" aria-label={label} {...props}>
      {children}
    </button>
  );
}

export function DayToggle({
  habit,
  day,
  today,
  logs,
  onToggle,
}: {
  habit: Habit;
  day: Date;
  today: Date;
  logs: readonly string[];
  onToggle: (habitId: string, key: string) => void;
}) {
  const status = dayStatus(habit.days, logs, day, today);
  const key = dateKey(day);
  if (status === "off" || status === "future") {
    return <span className={cn("day-cell", status === "off" ? "is-off" : "is-future")} aria-hidden />;
  }
  const done = status === "done";
  const spoken = format(day, "EEEE d MMMM");
  return (
    <button
      type="button"
      className={cn("day-cell", done ? "is-done" : status === "today-open" ? "is-today" : "is-missed")}
      style={done ? ({ "--cell": habitVar(habitColor(habit.color)) } as CSSProperties) : undefined}
      aria-pressed={done}
      aria-label={done ? `Undo ${habit.name} for ${spoken}` : `Mark ${habit.name} done for ${spoken}`}
      onClick={() => onToggle(habit.id, key)}
    >
      {done ? <Check className="check-pop size-5" strokeWidth={2.5} aria-hidden /> : null}
    </button>
  );
}

export function rangePhrase(done: number, scheduled: number, scope: "week" | "month", current: boolean): string {
  const noun = scope === "week" ? "week" : "month";
  if (scheduled === 0) return `Nothing scheduled this ${noun}.`;
  if (done === scheduled) return current ? `All ${scheduled} so far this ${noun}.` : `All ${scheduled} kept.`;
  return current ? `${done} of ${scheduled} so far` : `${done} of ${scheduled} kept`;
}
