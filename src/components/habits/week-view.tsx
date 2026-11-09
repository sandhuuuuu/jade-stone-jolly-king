import { useState } from "react";
import { addDays, format, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import { useHabits } from "@/lib/habits/store";
import {
  dateKey,
  formatWeekTitle,
  habitStats,
  logKeys,
  statsLine,
  tally,
  weekStart,
  type Habit,
} from "@/lib/habits/model";
import { DayToggle, HabitIdentity, IconButton, Meter, rangePhrase } from "@/components/habits/bits";

export function WeekView({ today, onEdit }: { today: Date; onEdit: (habit: Habit) => void }) {
  const habits = useHabits((state) => state.habits);
  const logs = useHabits((state) => state.logs);
  const toggle = useHabits((state) => state.toggle);
  const [anchor, setAnchor] = useState(() => weekStart(today));
  const days = Array.from({ length: 7 }, (_, index) => addDays(anchor, index));
  const current = weekStart(today);
  const isCurrent = anchor.getTime() === current.getTime();
  const canNext = anchor.getTime() < current.getTime();
  const summary = tally(habits, logs, anchor, addDays(anchor, 6), today);

  return (
    <section className="flex flex-col gap-4" aria-label="Week">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-2xl">{formatWeekTitle(anchor)}</h2>
        <div className="flex items-center">
          <IconButton label="Previous week" onClick={() => setAnchor(addDays(anchor, -7))}>
            <ChevronLeft className="size-5" aria-hidden />
          </IconButton>
          <button type="button" className="text-btn" disabled={isCurrent} onClick={() => setAnchor(current)}>
            Today
          </button>
          <IconButton label="Next week" disabled={!canNext} onClick={() => canNext && setAnchor(addDays(anchor, 7))}>
            <ChevronRight className="size-5" aria-hidden />
          </IconButton>
        </div>
      </div>
      <Meter done={summary.done} scheduled={summary.scheduled} label={rangePhrase(summary.done, summary.scheduled, "week", isCurrent)} />
      <div className="panel hidden md:block">
        <div className="week-head">
          <span className="text-xs font-medium text-muted">Habit</span>
          {days.map((day) => (
            <span key={dateKey(day)} className={isSameDay(day, today) ? "dow is-today" : "dow"}>
              {format(day, "EEEEE")}
              <span className="nums block">{format(day, "d")}</span>
            </span>
          ))}
        </div>
        {habits.map((habit) => {
          const entries = logKeys(logs, habit.id);
          return (
            <div key={habit.id} className="week-row">
              <div className="flex min-w-0 items-center gap-1">
                <div className="min-w-0 flex-1">
                  <HabitIdentity habit={habit} />
                  <p className="nums mt-1 text-sm text-muted">{statsLine(habitStats(habit.days, entries, today))}</p>
                </div>
                <button type="button" className="icon-btn" aria-label={`Edit ${habit.name}`} onClick={() => onEdit(habit)}>
                  <Pencil className="size-4" aria-hidden />
                </button>
              </div>
              {days.map((day) => (
                <div key={dateKey(day)} className="flex justify-center">
                  <DayToggle habit={habit} day={day} today={today} logs={entries} onToggle={toggle} />
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <div className="panel md:hidden">
        {habits.map((habit) => {
          const entries = logKeys(logs, habit.id);
          return (
            <div key={habit.id} className="week-card">
              <div className="flex items-start gap-1">
                <div className="min-w-0 flex-1">
                  <HabitIdentity habit={habit} />
                  <p className="nums mt-1 text-sm text-muted">{statsLine(habitStats(habit.days, entries, today))}</p>
                </div>
                <button type="button" className="icon-btn" aria-label={`Edit ${habit.name}`} onClick={() => onEdit(habit)}>
                  <Pencil className="size-4" aria-hidden />
                </button>
              </div>
              <div className="mt-3 grid grid-cols-7 gap-1">
                {days.map((day) => (
                  <div key={dateKey(day)} className="grid justify-items-center gap-1">
                    <span className={isSameDay(day, today) ? "dow is-today" : "dow"}>
                      {format(day, "EEEEE")}
                      <span className="nums block">{format(day, "d")}</span>
                    </span>
                    <DayToggle habit={habit} day={day} today={today} logs={entries} onToggle={toggle} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
