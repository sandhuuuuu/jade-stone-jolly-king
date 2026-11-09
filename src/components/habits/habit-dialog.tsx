import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHabits } from "@/lib/habits/store";
import {
  activeDays,
  HABIT_COLORS,
  habitColor,
  habitVar,
  nextColor,
  WEEKDAYS,
  type Habit,
  type HabitColor,
  type Weekday,
} from "@/lib/habits/model";

export type Draft = { mode: "create" } | { mode: "edit"; habit: Habit };

export function HabitDialog({ draft, onClose }: { draft: Draft; onClose: () => void }) {
  const habits = useHabits((state) => state.habits);
  const addHabit = useHabits((state) => state.addHabit);
  const updateHabit = useHabits((state) => state.updateHabit);
  const deleteHabit = useHabits((state) => state.deleteHabit);
  const editing = draft.mode === "edit" ? draft.habit : null;
  const [name, setName] = useState(editing?.name ?? "");
  const [color, setColor] = useState<HabitColor>(editing ? habitColor(editing.color) : nextColor(habits));
  const [days, setDays] = useState<Weekday[]>(editing ? activeDays(editing.days) : activeDays(undefined));
  const [confirming, setConfirming] = useState(false);

  function toggleDay(day: Weekday) {
    setDays((current) => {
      if (current.includes(day)) {
        if (current.length === 1) return current;
        return current.filter((item) => item !== day);
      }
      return [...current, day];
    });
  }

  function save() {
    const next = { name, color, days };
    if (editing) updateHabit(editing.id, next);
    else addHabit(next);
    onClose();
  }

  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-panel">
          {confirming && editing ? (
            <div className="flex flex-col gap-4 p-2">
              <div className="flex items-start justify-between gap-3">
                <Dialog.Title className="text-2xl">Delete this habit?</Dialog.Title>
                <Dialog.Close className="icon-btn" aria-label="Close">
                  <X className="size-5" aria-hidden />
                </Dialog.Close>
              </div>
              <Dialog.Description className="text-pretty text-sm text-muted">
                Check-ins for <span className="font-medium text-fg">{editing.name}</span> will be removed from this device.
              </Dialog.Description>
              <button
                type="button"
                className="btn btn-danger btn-block"
                onClick={() => {
                  deleteHabit(editing.id);
                  onClose();
                }}
              >
                Delete habit
              </button>
              <button type="button" className="btn btn-secondary btn-block" onClick={() => setConfirming(false)}>
                Keep it
              </button>
            </div>
          ) : (
            <form
              className="flex flex-col gap-4 p-2"
              onSubmit={(event) => {
                event.preventDefault();
                if (name.trim()) save();
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Dialog.Title className="text-2xl">{editing ? "Edit habit" : "New habit"}</Dialog.Title>
                  <Dialog.Description className="mt-1 text-pretty text-sm text-muted">
                    A name, a color, and the days you mean to keep it.
                  </Dialog.Description>
                </div>
                <Dialog.Close className="icon-btn" aria-label="Close">
                  <X className="size-5" aria-hidden />
                </Dialog.Close>
              </div>
              <label className="flex flex-col gap-2">
                <span className="form-label">Name</span>
                <input
                  className="field"
                  value={name}
                  maxLength={40}
                  autoFocus
                  autoComplete="off"
                  placeholder="Morning walk"
                  onChange={(event) => setName(event.target.value)}
                />
              </label>
              <fieldset>
                <legend className="form-label">Color</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {HABIT_COLORS.map((swatch) => (
                    <button
                      key={swatch.id}
                      type="button"
                      className={cn("swatch", color === swatch.id && "is-selected")}
                      style={{ background: habitVar(swatch.id) }}
                      aria-pressed={color === swatch.id}
                      aria-label={swatch.label}
                      onClick={() => setColor(swatch.id)}
                    />
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="form-label">Days</legend>
                <div className="day-picks mt-2" role="group" aria-label="Active days">
                  {WEEKDAYS.map((day) => {
                    const on = days.includes(day.id);
                    return (
                      <button
                        key={day.id}
                        type="button"
                        className={cn("day-pick", on && "is-on")}
                        aria-pressed={on}
                        onClick={() => toggleDay(day.id)}
                      >
                        {day.narrow}
                        <span className="sr-only">{day.long}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-xs text-subtle">At least one day. Missed days outside this rhythm do not break the streak.</p>
              </fieldset>
              <button type="submit" className="btn btn-primary btn-block" disabled={!name.trim()}>
                {editing ? "Save changes" : "Add habit"}
              </button>
              {editing && (
                <button type="button" className="btn btn-quiet-danger btn-block" onClick={() => setConfirming(true)}>
                  Delete habit
                </button>
              )}
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
