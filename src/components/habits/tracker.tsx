import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { useHabits } from "@/lib/habits/store";
import { dateKey, isScheduled, logKeys, startOfDay, type Habit } from "@/lib/habits/model";
import { Meter, ViewSwitch } from "@/components/habits/bits";
import { HabitDialog, type Draft } from "@/components/habits/habit-dialog";
import { TodayView } from "@/components/habits/today-view";
import { WeekView } from "@/components/habits/week-view";
import { MonthView } from "@/components/habits/month-view";

function TrackerSkeleton() {
  return (
    <main className="page">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div>
          <p className="kicker">Cadence</p>
          <div className="skeleton mt-3 h-10 w-48" />
          <div className="skeleton mt-3 h-4 w-32" />
        </div>
        <div className="skeleton h-12 w-full max-w-xs" />
        <div className="panel">
          <div className="skeleton m-3 h-16" />
          <div className="skeleton m-3 h-16" />
          <div className="skeleton m-3 h-16" />
        </div>
      </div>
    </main>
  );
}

function Tracker() {
  const habits = useHabits((state) => state.habits);
  const logs = useHabits((state) => state.logs);
  const view = useHabits((state) => state.view);
  const setView = useHabits((state) => state.setView);
  const [today, setToday] = useState(() => startOfDay(new Date()));
  const [draft, setDraft] = useState<Draft | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => setToday(startOfDay(new Date())), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const key = dateKey(today);
  const scheduled = habits.filter((habit) => isScheduled(habit.days, today));
  const done = scheduled.filter((habit) => logKeys(logs, habit.id).includes(key)).length;
  const left = scheduled.length - done;
  const summary =
    habits.length === 0
      ? "Add a habit to begin."
      : scheduled.length === 0
        ? "Nothing scheduled today."
        : left === 0
          ? "Today is complete."
          : left === 1
            ? "1 left today."
            : `${left} left today.`;

  function edit(habit: Habit) {
    setDraft({ mode: "edit", habit });
  }

  return (
    <main className="page">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="kicker">Cadence</p>
            <h1 className="text-display text-balance">{format(today, "EEEE")}</h1>
            <p className="mt-2 text-muted">{format(today, "d MMMM")}</p>
          </div>
          <div className="shrink-0 text-right">
            {scheduled.length === 0 ? (
              <p className="font-display text-3xl leading-none">Rest</p>
            ) : (
              <p className="nums font-display text-3xl leading-none">
                {done}
                <span className="text-muted">/{scheduled.length}</span>
              </p>
            )}
            <p className="mt-1 text-sm text-muted">today</p>
          </div>
        </header>
        {scheduled.length > 0 ? (
          <Meter done={done} scheduled={scheduled.length} label={summary} />
        ) : (
          <p className="text-sm text-muted" aria-live="polite">
            {summary}
          </p>
        )}
        {habits.length === 0 ? (
          <div className="empty-state panel">
            <h2 className="text-2xl">No habits yet</h2>
            <p className="max-w-sm text-pretty text-muted">Add one you can keep today. A short list beats a perfect one.</p>
            <button type="button" className="btn btn-primary" onClick={() => setDraft({ mode: "create" })}>
              <Plus className="size-4" aria-hidden />
              Add habit
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="w-full sm:w-80">
                <ViewSwitch value={view} onChange={setView} />
              </div>
              <button type="button" className="btn btn-primary w-full sm:w-auto" onClick={() => setDraft({ mode: "create" })}>
                <Plus className="size-4" aria-hidden />
                Add habit
              </button>
            </div>
            {view === "today" && <TodayView today={today} onEdit={edit} />}
            {view === "week" && <WeekView today={today} onEdit={edit} />}
            {view === "month" && <MonthView today={today} onEdit={edit} />}
          </>
        )}
        <p className="text-center text-xs text-subtle">Saved on this device.</p>
      </div>
      {draft && (
        <HabitDialog
          key={draft.mode === "edit" ? draft.habit.id : "new"}
          draft={draft}
          onClose={() => setDraft(null)}
        />
      )}
    </main>
  );
}

export function HabitApp() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    const finish = () => {
      if (!alive) return;
      useHabits.getState().ensureSeed();
      setReady(true);
    };
    const unsub = useHabits.persist.onFinishHydration(finish);
    if (useHabits.persist.hasHydrated()) finish();
    return () => {
      alive = false;
      unsub();
    };
  }, []);
  if (!ready) return <TrackerSkeleton />;
  return <Tracker />;
}
