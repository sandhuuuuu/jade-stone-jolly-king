import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  buildSeed,
  dateKey,
  habitColor,
  orderDays,
  startOfDay,
  type Habit,
  type HabitColor,
  type TrackerView,
  type Weekday,
} from "@/lib/habits/model";

type HabitInput = { name: string; color: HabitColor; days: Weekday[] };

type HabitsStore = {
  habits: Habit[];
  logs: Record<string, string[]>;
  seeded: boolean;
  view: TrackerView;
  setView: (view: TrackerView) => void;
  addHabit: (input: HabitInput) => void;
  updateHabit: (id: string, input: HabitInput) => void;
  deleteHabit: (id: string) => void;
  toggle: (habitId: string, key: string) => void;
  ensureSeed: () => void;
};

function cleanInput(input: HabitInput): HabitInput | null {
  const name = input.name.trim().slice(0, 40);
  const days = orderDays(input.days);
  if (!name || days.length === 0) return null;
  return { name, color: habitColor(input.color), days };
}

export const useHabits = create<HabitsStore>()(
  persist(
    (set, get) => ({
      habits: [],
      logs: {},
      seeded: false,
      view: "today",
      setView: (view) => set({ view }),
      addHabit: (input) => {
        const next = cleanInput(input);
        if (!next) return;
        const habit: Habit = {
          id: crypto.randomUUID(),
          name: next.name,
          color: next.color,
          days: next.days,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ habits: [...state.habits, habit] }));
      },
      updateHabit: (id, input) => {
        const next = cleanInput(input);
        if (!next) return;
        set((state) => ({
          habits: state.habits.map((habit) => (habit.id === id ? { ...habit, ...next } : habit)),
        }));
      },
      deleteHabit: (id) =>
        set((state) => {
          const logs = { ...state.logs };
          delete logs[id];
          return { habits: state.habits.filter((habit) => habit.id !== id), logs };
        }),
      toggle: (habitId, key) => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return;
        if (key > dateKey(new Date())) return;
        set((state) => {
          if (!state.habits.some((habit) => habit.id === habitId)) return state;
          const current = state.logs[habitId] ?? [];
          const next = current.includes(key)
            ? current.filter((item) => item !== key)
            : [...current, key].sort();
          return { logs: { ...state.logs, [habitId]: next } };
        });
      },
      ensureSeed: () => {
        if (get().seeded) return;
        const seed = buildSeed(startOfDay(new Date()));
        set({ habits: seed.habits, logs: seed.logs, seeded: true });
      },
    }),
    {
      name: "cadence.habits.v1",
      partialize: (state) => ({
        habits: state.habits,
        logs: state.logs,
        seeded: state.seeded,
        view: state.view,
      }),
    },
  ),
);
