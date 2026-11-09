import { useState, type CSSProperties } from "react";
import { format, isSameDay, isSameMonth } from "date-fns";
import { ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHabits } from "@/lib/habits/store";
import {
  dateKey,
  dayStatus,
  habitColor,
  habitStats,
  habitVar,
  isScheduled,
  logKeys,
  monthCells,
  monthStart,
  parseKey,
  shiftMonth,
  tally,
  trailingDays,
  WEEKDAYS,
  type Habit,
} from "@/lib/habits/model";
import { DayToggle, HabitIdentity, IconButton, Meter, rangePhrase } from "@/components/habits/bits";

export function MonthView({ today, onEdit }: { today: Date; onEdit: (habit: Habit) => void }) {
  const habits = useHabits((state) => state.habits);
  const logs = useHabits((state) => state.logs);
  const toggle = useHabits((state) => state.toggle);
  const [anchor, setAnchor] = useState(() => monthStart(today));
  const [selectedKey, setSelectedKey] = useState(() => dateKey(today));
  const current = monthStart(today);
  const isCurrent = anchor.getTime() === current.getTime();
  const canNext = anchor.getTime() < current.getTime();
  const cells = monthCells(anchor);
  const selected = parseKey(selectedKey);
  const summary = tally(habits, logs, monthStart(anchor), new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0), today);
  const strip = trailingDays(today, 28);
  const future = dateKey(selected) > dateKey(today);
  const scheduled = habits.filter((habit) => isScheduled(habit.days, selected));

  function go(next: Date) {
    const start = monthStart(next);
    setAnchor(start);
    setSelectedKey(isSameMonth(start, today) ? dateKey(today) : dateKey(start));
  }

  return (
    <section className="flex flex-col gap-4" aria-label="Month">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-2xl">{format(anchor, "MMMM yyyy")}</h2>
        <div className="flex items-center">
          <IconButton label="Previous month" onClick={() => go(shiftMonth(anchor, -1))}>
            <ChevronLeft className="size-5" aria-hidden />
          </IconButton>
          <button type="button" className="text-btn" disabled={isCurrent} onClick={() => go(today)}>
            Today
          </button>
          <IconButton label="Next month" disabled={!canNext} onClick={() => canNext && go(shiftMonth(anchor, 1))}>
            <ChevronRight className="size-5" aria-hidden />
          </IconButton>
        </div>
      </div>
      <Meter done={summary.done} scheduled={summary.scheduled} label={rangePhrase(summary.done, summary.scheduled, "month", isCurrent)} />
      <div className="month-layout">
        <div className="panel min-w-0">
          {habits.map((habit) => {
            const entries = logKeys(logs, habit.id);
            const stats = habitStats(habit.days, entries, today);
            const color = habitColor(habit.color);
            return (
              <article key={habit.id} className="habit-block">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <HabitIdentity habit={habit} />
                  </div>
                  <div className="flex items-start">
                    <div className="pt-1 text-right">
                      <p className="nums font-display text-3xl leading-none">{stats.streak}</p>
                      <p className="text-xs text-muted">day streak</p>
                    </div>
                    <button type="button" className="icon-btn" aria-label={`Edit ${habit.name}`} onClick={() => onEdit(habit)}>
                      <Pencil className="size-4" aria-hidden />
                    </button>
                  </div>
                </div>
                <p className="nums mt-2 text-sm text-muted">
                  Best {stats.best} · {stats.month.scheduled === 0 ? "none this month" : `${stats.month.done}/${stats.month.scheduled} this month`}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-subtle">
                  <span className="nums">{format(strip[0] ?? today, "d MMM")}</span>
                  <span>Last 28 days</span>
                  <span className="nums">{format(strip[strip.length - 1] ?? today, "d MMM")}</span>
                </div>
                <div className="strip-scroll mt-1">
                  <div className="strip" aria-hidden>
                    {strip.map((day) => {
                      const status = dayStatus(habit.days, entries, day, today);
                      const done = status === "done";
                      return (
                        <span
                          key={dateKey(day)}
                          className={cn("strip-cell", done && "is-done", status === "off" && "is-off", dateKey(day) === dateKey(today) && "is-today")}
                          style={done ? ({ background: habitVar(color) } as CSSProperties) : undefined}
                        />
                      );
                    })}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <div className="panel min-w-0 p-3">
          <div className="month-grid mb-1">
            {WEEKDAYS.map((day) => (
              <div key={day.long} className="dow">
                {day.narrow}
              </div>
            ))}
          </div>
          <div className="month-grid">
            {cells.map((day) => {
              const inMonth = isSameMonth(day, anchor);
              const key = dateKey(day);
              if (!inMonth) {
                return (
                  <span key={key} className="month-day is-out" aria-hidden>
                    <span className="month-num nums">{format(day, "d")}</span>
                  </span>
                );
              }
              const selectedDay = key === selectedKey;
              return (
                <button
                  key={key}
                  type="button"
                  className={cn("month-day", selectedDay && "is-selected", isSameDay(day, today) && "is-today")}
                  aria-pressed={selectedDay}
                  aria-current={isSameDay(day, today) ? "date" : undefined}
                  aria-label={format(day, "EEEE d MMMM")}
                  onClick={() => setSelectedKey(key)}
                >
                  <span className="month-num nums">{format(day, "d")}</span>
                  <span className="month-dots" aria-hidden>
                    {habits.map((habit) => {
                      const status = dayStatus(habit.days, logKeys(logs, habit.id), day, today);
                      if (status === "off" || status === "future") return null;
                      const done = status === "done";
                      return (
                        <span
                          key={habit.id}
                          className={cn("dot", done && "is-done")}
                          style={done ? { background: habitVar(habitColor(habit.color)) } : undefined}
                        />
                      );
                    })}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-subtle">Solid is kept. Hollow is a miss.</p>
          <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            {habits.map((habit) => (
              <li key={habit.id} className="flex max-w-full items-center gap-1.5 text-xs text-muted">
                <span className="dot is-done" style={{ background: habitVar(habitColor(habit.color)) }} aria-hidden />
                <span className="truncate">{habit.name}</span>
              </li>
            ))}
          </ul>
          <div className="day-edit">
            <h3 className="text-lg">{format(selected, "EEEE d MMMM")}</h3>
            {future ? (
              <>
                <p className="mt-2 text-sm text-muted">This day has not happened yet.</p>
                {scheduled.length > 0 && (
                  <ul className="mt-2 flex flex-col gap-1">
                    {scheduled.map((habit) => (
                      <li key={habit.id} className="truncate text-sm">
                        {habit.name}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : scheduled.length === 0 ? (
              <p className="mt-2 text-sm text-muted">Nothing scheduled this day.</p>
            ) : (
              <ul className="mt-2 flex flex-col">
                {scheduled.map((habit) => (
                  <li key={habit.id} className="flex items-center gap-3 py-1">
                    <div className="w-11 shrink-0">
                      <DayToggle
                        habit={habit}
                        day={selected}
                        today={today}
                        logs={logKeys(logs, habit.id)}
                        onToggle={toggle}
                      />
                    </div>
                    <span className="min-w-0 truncate font-medium">{habit.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
