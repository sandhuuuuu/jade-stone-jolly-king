import type { CSSProperties } from "react";
import { Check, Pencil } from "lucide-react";
import { useHabits } from "@/lib/habits/store";
import {
  dateKey,
  habitColor,
  habitStats,
  habitVar,
  isScheduled,
  logKeys,
  statsLine,
  type Habit,
} from "@/lib/habits/model";
import { cn } from "@/lib/utils";
import { HabitIdentity } from "@/components/habits/bits";

export function TodayView({ today, onEdit }: { today: Date; onEdit: (habit: Habit) => void }) {
  const habits = useHabits((state) => state.habits);
  const logs = useHabits((state) => state.logs);
  const toggle = useHabits((state) => state.toggle);
  const key = dateKey(today);
  const active = habits.filter((habit) => isScheduled(habit.days, today));
  const rest = habits.filter((habit) => !isScheduled(habit.days, today));

  return (
    <section className="panel" aria-label="Today">
      {active.map((habit) => {
        const entries = logKeys(logs, habit.id);
        const done = entries.includes(key);
        const color = habitColor(habit.color);
        return (
          <div
            key={habit.id}
            className={cn("ledger-row", done && "is-done")}
            style={done ? ({ "--cell": habitVar(color) } as CSSProperties) : undefined}
          >
            <button
              type="button"
              className={cn("toggle-hit", done ? "is-done" : "is-open")}
              style={{ "--cell": habitVar(color) } as CSSProperties}
              aria-pressed={done}
              aria-label={`${done ? `Undo ${habit.name} for today` : `Mark ${habit.name} done for today`}. ${statsLine(habitStats(habit.days, entries, today))}`}
              onClick={() => toggle(habit.id, key)}
            >
              <span className="check-face" aria-hidden>
                {done ? <Check className="check-pop size-5" strokeWidth={2.5} /> : null}
              </span>
              <span className="min-w-0">
                <HabitIdentity habit={habit} />
                <span className="nums mt-1 block text-sm text-muted">{statsLine(habitStats(habit.days, entries, today))}</span>
              </span>
            </button>
            <button type="button" className="icon-btn" aria-label={`Edit ${habit.name}`} onClick={() => onEdit(habit)}>
              <Pencil className="size-4" aria-hidden />
            </button>
          </div>
        );
      })}
      {rest.length > 0 && active.length > 0 && <p className="ledger-note">Rest today</p>}
      {rest.map((habit) => {
        const entries = logKeys(logs, habit.id);
        return (
          <div key={habit.id} className="ledger-row">
            <div className="toggle-hit">
              <span className="rest-mark">Rest</span>
              <span className="min-w-0">
                <HabitIdentity habit={habit} />
                <span className="nums mt-1 block text-sm text-muted">{statsLine(habitStats(habit.days, entries, today))}</span>
              </span>
            </div>
            <button type="button" className="icon-btn" aria-label={`Edit ${habit.name}`} onClick={() => onEdit(habit)}>
              <Pencil className="size-4" aria-hidden />
            </button>
          </div>
        );
      })}
    </section>
  );
}
