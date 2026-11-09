import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as ChevronRight, i as Pencil, o as ChevronLeft, r as Plus, s as Check, t as X } from "../_libs/lucide-react.mjs";
import { a as startOfWeek, i as isSameDay, n as format, o as addDays, r as startOfMonth, t as isSameMonth } from "../_libs/date-fns.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-OhpnE2wt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var HABIT_COLORS = [
	{
		id: "moss",
		label: "Moss"
	},
	{
		id: "tide",
		label: "Tide"
	},
	{
		id: "clay",
		label: "Clay"
	},
	{
		id: "slate",
		label: "Slate"
	},
	{
		id: "wine",
		label: "Wine"
	},
	{
		id: "umber",
		label: "Umber"
	}
];
var WEEKDAYS = [
	{
		id: 1,
		narrow: "M",
		short: "Mon",
		long: "Monday"
	},
	{
		id: 2,
		narrow: "T",
		short: "Tue",
		long: "Tuesday"
	},
	{
		id: 3,
		narrow: "W",
		short: "Wed",
		long: "Wednesday"
	},
	{
		id: 4,
		narrow: "T",
		short: "Thu",
		long: "Thursday"
	},
	{
		id: 5,
		narrow: "F",
		short: "Fri",
		long: "Friday"
	},
	{
		id: 6,
		narrow: "S",
		short: "Sat",
		long: "Saturday"
	},
	{
		id: 0,
		narrow: "S",
		short: "Sun",
		long: "Sunday"
	}
];
var COLOR_SET = new Set(HABIT_COLORS.map((color) => color.id));
function habitColor(color) {
	return COLOR_SET.has(color ?? "") ? color : "moss";
}
function habitVar(color) {
	return `var(--habit-${color})`;
}
function activeDays(days) {
	const clean = (days ?? []).filter((day) => day === 0 || day === 1 || day === 2 || day === 3 || day === 4 || day === 5 || day === 6);
	const unique = WEEKDAYS.map((day) => day.id).filter((day) => clean.includes(day));
	return unique.length > 0 ? unique : WEEKDAYS.map((day) => day.id);
}
function scheduleLabel(days) {
	const set = new Set(activeDays(days));
	if (set.size === 7) return "Every day";
	const weekdays = [
		1,
		2,
		3,
		4,
		5
	];
	const weekend = [6, 0];
	if (set.size === 5 && weekdays.every((day) => set.has(day))) return "Weekdays";
	if (set.size === 2 && weekend.every((day) => set.has(day))) return "Weekends";
	return WEEKDAYS.filter((day) => set.has(day.id)).map((day) => day.short).join(" ");
}
function nextColor(habits) {
	const counts = new Map(HABIT_COLORS.map((color) => [color.id, 0]));
	for (const habit of habits) {
		const color = habitColor(habit.color);
		counts.set(color, (counts.get(color) ?? 0) + 1);
	}
	return [...counts.entries()].sort((a, b) => a[1] - b[1])[0]?.[0] ?? "moss";
}
function startOfDay(date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
function dateKey(date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function parseKey(key) {
	const [year, month, day] = key.split("-").map(Number);
	return new Date(year || 1970, (month || 1) - 1, day || 1);
}
function isScheduled(days, date) {
	return activeDays(days).includes(date.getDay());
}
function logKeys(logs, id) {
	const raw = logs?.[id];
	if (!Array.isArray(raw)) return [];
	return raw.filter((key) => typeof key === "string");
}
function dayStatus(days, logs, day, today) {
	if (!isScheduled(days, day)) return "off";
	const key = dateKey(day);
	const todayKey = dateKey(today);
	if (logs.includes(key)) return "done";
	if (key > todayKey) return "future";
	if (key === todayKey) return "today-open";
	return "missed";
}
function weekStart(date) {
	return startOfDay(startOfWeek(startOfDay(date), { weekStartsOn: 1 }));
}
function monthStart(date) {
	return startOfMonth(startOfDay(date));
}
function shiftMonth(date, amount) {
	const start = monthStart(date);
	return new Date(start.getFullYear(), start.getMonth() + amount, 1);
}
function monthCells(anchor) {
	const start = monthStart(anchor);
	const gridStart = weekStart(start);
	const cells = Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
	if (!cells.slice(35).some((day) => isSameMonth(day, start))) cells.splice(35, 7);
	if (cells.length > 28 && !cells.slice(28).some((day) => isSameMonth(day, start))) cells.splice(28, 7);
	return cells;
}
function trailingDays(today, count) {
	const start = addDays(startOfDay(today), -(count - 1));
	return Array.from({ length: count }, (_, index) => addDays(start, index));
}
function currentStreak(days, logs, today) {
	const done = new Set(logs);
	let cursor = startOfDay(today);
	if (!done.has(dateKey(cursor))) cursor = addDays(cursor, -1);
	let streak = 0;
	for (let i = 0; i < 4e3; i += 1) {
		if (isScheduled(days, cursor)) {
			if (!done.has(dateKey(cursor))) break;
			streak += 1;
		}
		cursor = addDays(cursor, -1);
	}
	return streak;
}
function bestStreak(days, logs, today) {
	if (logs.length === 0) return 0;
	const done = new Set(logs);
	let earliest = logs[0] ?? dateKey(today);
	for (const key of logs) if (key < earliest) earliest = key;
	let cursor = parseKey(earliest);
	const endKey = dateKey(today);
	let best = 0;
	let run = 0;
	for (let i = 0; i < 4e3; i += 1) {
		const key = dateKey(cursor);
		if (key > endKey) break;
		if (isScheduled(days, cursor)) {
			if (done.has(key)) {
				run += 1;
				if (run > best) best = run;
			} else if (key !== endKey) run = 0;
		}
		cursor = addDays(cursor, 1);
	}
	return best;
}
function periodStats(days, logs, start, end, today) {
	const doneSet = new Set(logs);
	const startKey = dateKey(startOfDay(start));
	const lastKey = dateKey(startOfDay(end)) < dateKey(startOfDay(today)) ? dateKey(startOfDay(end)) : dateKey(startOfDay(today));
	if (lastKey < startKey) return {
		done: 0,
		scheduled: 0
	};
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
	return {
		done,
		scheduled
	};
}
function habitStats(days, logs, today) {
	const month = periodStats(days, logs, monthStart(today), today, today);
	return {
		streak: currentStreak(days, logs, today),
		best: bestStreak(days, logs, today),
		month
	};
}
function statsLine(stats) {
	const streak = stats.streak === 1 ? "1-day streak" : `${stats.streak}-day streak`;
	const month = stats.month.scheduled === 0 ? "none this month" : `${stats.month.done}/${stats.month.scheduled} this month`;
	return `${streak} · best ${stats.best} · ${month}`;
}
function tally(habits, logs, start, end, today) {
	let done = 0;
	let scheduled = 0;
	for (const habit of habits) {
		const stats = periodStats(habit.days, logKeys(logs, habit.id), start, end, today);
		done += stats.done;
		scheduled += stats.scheduled;
	}
	const pct = scheduled === 0 ? 0 : Math.round(done / scheduled * 100);
	return {
		done,
		scheduled,
		pct
	};
}
function formatWeekTitle(start) {
	const end = addDays(start, 6);
	if (start.getMonth() === end.getMonth()) return `${format(start, "d")}–${format(end, "d MMM")}`;
	return `${format(start, "d MMM")} – ${format(end, "d MMM")}`;
}
function orderDays(days) {
	return activeDays(days);
}
function collect(days, today, back, keep) {
	const keys = [];
	for (let ago = back; ago >= 0; ago -= 1) {
		const day = addDays(today, -ago);
		if (!isScheduled(days, day)) continue;
		if (keep(ago)) keys.push(dateKey(day));
	}
	return keys;
}
function buildSeed(today) {
	const origin = (/* @__PURE__ */ new Date(today.getTime() - 432e7)).toISOString();
	const every = [
		0,
		1,
		2,
		3,
		4,
		5,
		6
	];
	const habits = [
		{
			id: crypto.randomUUID(),
			name: "Morning walk",
			color: "moss",
			days: every,
			createdAt: origin
		},
		{
			id: crypto.randomUUID(),
			name: "Read 20 pages",
			color: "tide",
			days: every,
			createdAt: origin
		},
		{
			id: crypto.randomUUID(),
			name: "Strength",
			color: "clay",
			days: [
				1,
				3,
				5
			],
			createdAt: origin
		},
		{
			id: crypto.randomUUID(),
			name: "Lights out by 11",
			color: "slate",
			days: every,
			createdAt: origin
		}
	];
	const [walk, read, strength, lights] = habits;
	return {
		habits,
		logs: {
			[walk.id]: collect(walk.days, today, 40, (ago) => ago <= 20),
			[read.id]: collect(read.days, today, 40, (ago) => ago !== 0 && ago <= 27 && ago % 4 !== 0),
			[strength.id]: collect(strength.days, today, 42, (ago) => ago !== 0),
			[lights.id]: collect(lights.days, today, 40, (ago) => ago !== 0 && ago <= 18 && ago % 5 !== 0)
		}
	};
}
function cleanInput(input) {
	const name = input.name.trim().slice(0, 40);
	const days = orderDays(input.days);
	if (!name || days.length === 0) return null;
	return {
		name,
		color: habitColor(input.color),
		days
	};
}
var useHabits = create()(persist((set, get) => ({
	habits: [],
	logs: {},
	seeded: false,
	view: "today",
	setView: (view) => set({ view }),
	addHabit: (input) => {
		const next = cleanInput(input);
		if (!next) return;
		const habit = {
			id: crypto.randomUUID(),
			name: next.name,
			color: next.color,
			days: next.days,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		set((state) => ({ habits: [...state.habits, habit] }));
	},
	updateHabit: (id, input) => {
		const next = cleanInput(input);
		if (!next) return;
		set((state) => ({ habits: state.habits.map((habit) => habit.id === id ? {
			...habit,
			...next
		} : habit) }));
	},
	deleteHabit: (id) => set((state) => {
		const logs = { ...state.logs };
		delete logs[id];
		return {
			habits: state.habits.filter((habit) => habit.id !== id),
			logs
		};
	}),
	toggle: (habitId, key) => {
		if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return;
		if (key > dateKey(/* @__PURE__ */ new Date())) return;
		set((state) => {
			if (!state.habits.some((habit) => habit.id === habitId)) return state;
			const current = state.logs[habitId] ?? [];
			const next = current.includes(key) ? current.filter((item) => item !== key) : [...current, key].sort();
			return { logs: {
				...state.logs,
				[habitId]: next
			} };
		});
	},
	ensureSeed: () => {
		if (get().seeded) return;
		const seed = buildSeed(startOfDay(/* @__PURE__ */ new Date()));
		set({
			habits: seed.habits,
			logs: seed.logs,
			seeded: true
		});
	}
}), {
	name: "cadence.habits.v1",
	partialize: (state) => ({
		habits: state.habits,
		logs: state.logs,
		seeded: state.seeded,
		view: state.view
	})
}));
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var VIEWS = [
	{
		id: "today",
		label: "Today"
	},
	{
		id: "week",
		label: "Week"
	},
	{
		id: "month",
		label: "Month"
	}
];
function ViewSwitch({ value, onChange }) {
	const index = Math.max(0, VIEWS.findIndex((view) => view.id === value));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "segment",
		style: { "--index": index },
		role: "group",
		"aria-label": "Choose a view",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "segment-thumb",
			"aria-hidden": true
		}), VIEWS.map((view) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: cn("segment-btn", value === view.id && "is-active"),
			"aria-pressed": value === view.id,
			onClick: () => onChange(view.id),
			children: view.label
		}, view.id))]
	});
}
function Meter({ done, scheduled, label }) {
	const pct = scheduled === 0 ? 0 : Math.round(done / scheduled * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-2 flex items-baseline justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			"aria-live": "polite",
			children: label
		}), scheduled > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "nums text-sm font-medium",
			children: [pct, "%"]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "progress",
		role: "progressbar",
		"aria-valuemin": 0,
		"aria-valuemax": scheduled,
		"aria-valuenow": done,
		"aria-label": label,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "progress-fill",
			style: { width: `${pct}%` }
		})
	})] });
}
function HabitIdentity({ habit }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "flex min-w-0 items-start gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "habit-dot",
			style: { background: habitVar(habitColor(habit.color)) },
			"aria-hidden": true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block truncate font-medium",
				title: habit.name,
				children: habit.name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-sm text-muted",
				children: scheduleLabel(habit.days)
			})]
		})]
	});
}
function IconButton({ label, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: "icon-btn",
		"aria-label": label,
		...props,
		children
	});
}
function DayToggle({ habit, day, today, logs, onToggle }) {
	const status = dayStatus(habit.days, logs, day, today);
	const key = dateKey(day);
	if (status === "off" || status === "future") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("day-cell", status === "off" ? "is-off" : "is-future"),
		"aria-hidden": true
	});
	const done = status === "done";
	const spoken = format(day, "EEEE d MMMM");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: cn("day-cell", done ? "is-done" : status === "today-open" ? "is-today" : "is-missed"),
		style: done ? { "--cell": habitVar(habitColor(habit.color)) } : void 0,
		"aria-pressed": done,
		"aria-label": done ? `Undo ${habit.name} for ${spoken}` : `Mark ${habit.name} done for ${spoken}`,
		onClick: () => onToggle(habit.id, key),
		children: done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
			className: "check-pop size-5",
			strokeWidth: 2.5,
			"aria-hidden": true
		}) : null
	});
}
function rangePhrase(done, scheduled, scope, current) {
	const noun = scope === "week" ? "week" : "month";
	if (scheduled === 0) return `Nothing scheduled this ${noun}.`;
	if (done === scheduled) return current ? `All ${scheduled} so far this ${noun}.` : `All ${scheduled} kept.`;
	return current ? `${done} of ${scheduled} so far` : `${done} of ${scheduled} kept`;
}
function HabitDialog({ draft, onClose }) {
	const habits = useHabits((state) => state.habits);
	const addHabit = useHabits((state) => state.addHabit);
	const updateHabit = useHabits((state) => state.updateHabit);
	const deleteHabit = useHabits((state) => state.deleteHabit);
	const editing = draft.mode === "edit" ? draft.habit : null;
	const [name, setName] = (0, import_react.useState)(editing?.name ?? "");
	const [color, setColor] = (0, import_react.useState)(editing ? habitColor(editing.color) : nextColor(habits));
	const [days, setDays] = (0, import_react.useState)(editing ? activeDays(editing.days) : activeDays(void 0));
	const [confirming, setConfirming] = (0, import_react.useState)(false);
	function toggleDay(day) {
		setDays((current) => {
			if (current.includes(day)) {
				if (current.length === 1) return current;
				return current.filter((item) => item !== day);
			}
			return [...current, day];
		});
	}
	function save() {
		const next = {
			name,
			color,
			days
		};
		if (editing) updateHabit(editing.id, next);
		else addHabit(next);
		onClose();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: true,
		onOpenChange: (open) => {
			if (!open) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "dialog-overlay" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			className: "dialog-panel",
			children: confirming && editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 p-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-2xl",
							children: "Delete this habit?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
							className: "icon-btn",
							"aria-label": "Close",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
								className: "size-5",
								"aria-hidden": true
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
						className: "text-pretty text-sm text-muted",
						children: [
							"Check-ins for ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-fg",
								children: editing.name
							}),
							" will be removed from this device."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-danger btn-block",
						onClick: () => {
							deleteHabit(editing.id);
							onClose();
						},
						children: "Delete habit"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-secondary btn-block",
						onClick: () => setConfirming(false),
						children: "Keep it"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex flex-col gap-4 p-2",
				onSubmit: (event) => {
					event.preventDefault();
					if (name.trim()) save();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-2xl",
							children: editing ? "Edit habit" : "New habit"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "mt-1 text-pretty text-sm text-muted",
							children: "A name, a color, and the days you mean to keep it."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
							className: "icon-btn",
							"aria-label": "Close",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
								className: "size-5",
								"aria-hidden": true
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "form-label",
							children: "Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field",
							value: name,
							maxLength: 40,
							autoFocus: true,
							autoComplete: "off",
							placeholder: "Morning walk",
							onChange: (event) => setName(event.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
						className: "form-label",
						children: "Color"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-2",
						children: HABIT_COLORS.map((swatch) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: cn("swatch", color === swatch.id && "is-selected"),
							style: { background: habitVar(swatch.id) },
							"aria-pressed": color === swatch.id,
							"aria-label": swatch.label,
							onClick: () => setColor(swatch.id)
						}, swatch.id))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
							className: "form-label",
							children: "Days"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "day-picks mt-2",
							role: "group",
							"aria-label": "Active days",
							children: WEEKDAYS.map((day) => {
								const on = days.includes(day.id);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: cn("day-pick", on && "is-on"),
									"aria-pressed": on,
									onClick: () => toggleDay(day.id),
									children: [day.narrow, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "sr-only",
										children: day.long
									})]
								}, day.id);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-subtle",
							children: "At least one day. Missed days outside this rhythm do not break the streak."
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "btn btn-primary btn-block",
						disabled: !name.trim(),
						children: editing ? "Save changes" : "Add habit"
					}),
					editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-quiet-danger btn-block",
						onClick: () => setConfirming(true),
						children: "Delete habit"
					})
				]
			})
		})] })
	});
}
function TodayView({ today, onEdit }) {
	const habits = useHabits((state) => state.habits);
	const logs = useHabits((state) => state.logs);
	const toggle = useHabits((state) => state.toggle);
	const key = dateKey(today);
	const active = habits.filter((habit) => isScheduled(habit.days, today));
	const rest = habits.filter((habit) => !isScheduled(habit.days, today));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "panel",
		"aria-label": "Today",
		children: [
			active.map((habit) => {
				const entries = logKeys(logs, habit.id);
				const done = entries.includes(key);
				const color = habitColor(habit.color);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("ledger-row", done && "is-done"),
					style: done ? { "--cell": habitVar(color) } : void 0,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: cn("toggle-hit", done ? "is-done" : "is-open"),
						style: { "--cell": habitVar(color) },
						"aria-pressed": done,
						"aria-label": `${done ? `Undo ${habit.name} for today` : `Mark ${habit.name} done for today`}. ${statsLine(habitStats(habit.days, entries, today))}`,
						onClick: () => toggle(habit.id, key),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "check-face",
							"aria-hidden": true,
							children: done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
								className: "check-pop size-5",
								strokeWidth: 2.5
							}) : null
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HabitIdentity, { habit }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "nums mt-1 block text-sm text-muted",
								children: statsLine(habitStats(habit.days, entries, today))
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "icon-btn",
						"aria-label": `Edit ${habit.name}`,
						onClick: () => onEdit(habit),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {
							className: "size-4",
							"aria-hidden": true
						})
					})]
				}, habit.id);
			}),
			rest.length > 0 && active.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "ledger-note",
				children: "Rest today"
			}),
			rest.map((habit) => {
				const entries = logKeys(logs, habit.id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ledger-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "toggle-hit",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rest-mark",
							children: "Rest"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HabitIdentity, { habit }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "nums mt-1 block text-sm text-muted",
								children: statsLine(habitStats(habit.days, entries, today))
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "icon-btn",
						"aria-label": `Edit ${habit.name}`,
						onClick: () => onEdit(habit),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {
							className: "size-4",
							"aria-hidden": true
						})
					})]
				}, habit.id);
			})
		]
	});
}
function WeekView({ today, onEdit }) {
	const habits = useHabits((state) => state.habits);
	const logs = useHabits((state) => state.logs);
	const toggle = useHabits((state) => state.toggle);
	const [anchor, setAnchor] = (0, import_react.useState)(() => weekStart(today));
	const days = Array.from({ length: 7 }, (_, index) => addDays(anchor, index));
	const current = weekStart(today);
	const isCurrent = anchor.getTime() === current.getTime();
	const canNext = anchor.getTime() < current.getTime();
	const summary = tally(habits, logs, anchor, addDays(anchor, 6), today);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-col gap-4",
		"aria-label": "Week",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl",
					children: formatWeekTitle(anchor)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
							label: "Previous week",
							onClick: () => setAnchor(addDays(anchor, -7)),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
								className: "size-5",
								"aria-hidden": true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-btn",
							disabled: isCurrent,
							onClick: () => setAnchor(current),
							children: "Today"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
							label: "Next week",
							disabled: !canNext,
							onClick: () => canNext && setAnchor(addDays(anchor, 7)),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
								className: "size-5",
								"aria-hidden": true
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
				done: summary.done,
				scheduled: summary.scheduled,
				label: rangePhrase(summary.done, summary.scheduled, "week", isCurrent)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel hidden md:block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "week-head",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium text-muted",
						children: "Habit"
					}), days.map((day) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: isSameDay(day, today) ? "dow is-today" : "dow",
						children: [format(day, "EEEEE"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "nums block",
							children: format(day, "d")
						})]
					}, dateKey(day)))]
				}), habits.map((habit) => {
					const entries = logKeys(logs, habit.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "week-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HabitIdentity, { habit }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "nums mt-1 text-sm text-muted",
									children: statsLine(habitStats(habit.days, entries, today))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "icon-btn",
								"aria-label": `Edit ${habit.name}`,
								onClick: () => onEdit(habit),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {
									className: "size-4",
									"aria-hidden": true
								})
							})]
						}), days.map((day) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayToggle, {
								habit,
								day,
								today,
								logs: entries,
								onToggle: toggle
							})
						}, dateKey(day)))]
					}, habit.id);
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "panel md:hidden",
				children: habits.map((habit) => {
					const entries = logKeys(logs, habit.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "week-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HabitIdentity, { habit }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "nums mt-1 text-sm text-muted",
									children: statsLine(habitStats(habit.days, entries, today))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "icon-btn",
								"aria-label": `Edit ${habit.name}`,
								onClick: () => onEdit(habit),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {
									className: "size-4",
									"aria-hidden": true
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 grid grid-cols-7 gap-1",
							children: days.map((day) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid justify-items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: isSameDay(day, today) ? "dow is-today" : "dow",
									children: [format(day, "EEEEE"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "nums block",
										children: format(day, "d")
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayToggle, {
									habit,
									day,
									today,
									logs: entries,
									onToggle: toggle
								})]
							}, dateKey(day)))
						})]
					}, habit.id);
				})
			})
		]
	});
}
function MonthView({ today, onEdit }) {
	const habits = useHabits((state) => state.habits);
	const logs = useHabits((state) => state.logs);
	const toggle = useHabits((state) => state.toggle);
	const [anchor, setAnchor] = (0, import_react.useState)(() => monthStart(today));
	const [selectedKey, setSelectedKey] = (0, import_react.useState)(() => dateKey(today));
	const current = monthStart(today);
	const isCurrent = anchor.getTime() === current.getTime();
	const canNext = anchor.getTime() < current.getTime();
	const cells = monthCells(anchor);
	const selected = parseKey(selectedKey);
	const summary = tally(habits, logs, monthStart(anchor), new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0), today);
	const strip = trailingDays(today, 28);
	const future = dateKey(selected) > dateKey(today);
	const scheduled = habits.filter((habit) => isScheduled(habit.days, selected));
	function go(next) {
		const start = monthStart(next);
		setAnchor(start);
		setSelectedKey(isSameMonth(start, today) ? dateKey(today) : dateKey(start));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-col gap-4",
		"aria-label": "Month",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl",
					children: format(anchor, "MMMM yyyy")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
							label: "Previous month",
							onClick: () => go(shiftMonth(anchor, -1)),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
								className: "size-5",
								"aria-hidden": true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-btn",
							disabled: isCurrent,
							onClick: () => go(today),
							children: "Today"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
							label: "Next month",
							disabled: !canNext,
							onClick: () => canNext && go(shiftMonth(anchor, 1)),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
								className: "size-5",
								"aria-hidden": true
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
				done: summary.done,
				scheduled: summary.scheduled,
				label: rangePhrase(summary.done, summary.scheduled, "month", isCurrent)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "month-layout",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "panel min-w-0",
					children: habits.map((habit) => {
						const entries = logKeys(logs, habit.id);
						const stats = habitStats(habit.days, entries, today);
						const color = habitColor(habit.color);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "habit-block",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "min-w-0 flex-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HabitIdentity, { habit })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "pt-1 text-right",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "nums font-display text-3xl leading-none",
												children: stats.streak
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted",
												children: "day streak"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "icon-btn",
											"aria-label": `Edit ${habit.name}`,
											onClick: () => onEdit(habit),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {
												className: "size-4",
												"aria-hidden": true
											})
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "nums mt-2 text-sm text-muted",
									children: [
										"Best ",
										stats.best,
										" · ",
										stats.month.scheduled === 0 ? "none this month" : `${stats.month.done}/${stats.month.scheduled} this month`
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex items-center justify-between text-xs text-subtle",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "nums",
											children: format(strip[0] ?? today, "d MMM")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Last 28 days" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "nums",
											children: format(strip[strip.length - 1] ?? today, "d MMM")
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "strip-scroll mt-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "strip",
										"aria-hidden": true,
										children: strip.map((day) => {
											const status = dayStatus(habit.days, entries, day, today);
											const done = status === "done";
											return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: cn("strip-cell", done && "is-done", status === "off" && "is-off", dateKey(day) === dateKey(today) && "is-today"),
												style: done ? { background: habitVar(color) } : void 0
											}, dateKey(day));
										})
									})
								})
							]
						}, habit.id);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel min-w-0 p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "month-grid mb-1",
							children: WEEKDAYS.map((day) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "dow",
								children: day.narrow
							}, day.long))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "month-grid",
							children: cells.map((day) => {
								const inMonth = isSameMonth(day, anchor);
								const key = dateKey(day);
								if (!inMonth) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "month-day is-out",
									"aria-hidden": true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "month-num nums",
										children: format(day, "d")
									})
								}, key);
								const selectedDay = key === selectedKey;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: cn("month-day", selectedDay && "is-selected", isSameDay(day, today) && "is-today"),
									"aria-pressed": selectedDay,
									"aria-current": isSameDay(day, today) ? "date" : void 0,
									"aria-label": format(day, "EEEE d MMMM"),
									onClick: () => setSelectedKey(key),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "month-num nums",
										children: format(day, "d")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "month-dots",
										"aria-hidden": true,
										children: habits.map((habit) => {
											const status = dayStatus(habit.days, logKeys(logs, habit.id), day, today);
											if (status === "off" || status === "future") return null;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "dot",
												style: status === "done" ? { background: habitVar(habitColor(habit.color)) } : void 0
											}, habit.id);
										})
									})]
								}, key);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-subtle",
							children: "Solid is kept. Hollow is a miss."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 flex flex-wrap gap-x-3 gap-y-1",
							children: habits.map((habit) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex max-w-full items-center gap-1.5 text-xs text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "dot",
									style: { background: habitVar(habitColor(habit.color)) },
									"aria-hidden": true
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: habit.name
								})]
							}, habit.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "day-edit",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg",
								children: format(selected, "EEEE d MMMM")
							}), future ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted",
								children: "This day has not happened yet."
							}), scheduled.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-2 flex flex-col gap-1",
								children: scheduled.map((habit) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "truncate text-sm",
									children: habit.name
								}, habit.id))
							})] }) : scheduled.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted",
								children: "Nothing scheduled this day."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-2 flex flex-col",
								children: scheduled.map((habit) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-3 py-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-11 shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayToggle, {
											habit,
											day: selected,
											today,
											logs: logKeys(logs, habit.id),
											onToggle: toggle
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "min-w-0 truncate font-medium",
										children: habit.name
									})]
								}, habit.id))
							})]
						})
					]
				})]
			})
		]
	});
}
function TrackerSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "page",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-4xl flex-col gap-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "kicker",
						children: "Cadence"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton mt-3 h-10 w-48" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton mt-3 h-4 w-32" })
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-12 w-full max-w-xs" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton m-3 h-16" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton m-3 h-16" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton m-3 h-16" })
					]
				})
			]
		})
	});
}
function Tracker() {
	const habits = useHabits((state) => state.habits);
	const logs = useHabits((state) => state.logs);
	const view = useHabits((state) => state.view);
	const setView = useHabits((state) => state.setView);
	const [today, setToday] = (0, import_react.useState)(() => startOfDay(/* @__PURE__ */ new Date()));
	const [draft, setDraft] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const id = window.setInterval(() => setToday(startOfDay(/* @__PURE__ */ new Date())), 6e4);
		return () => window.clearInterval(id);
	}, []);
	const key = dateKey(today);
	const scheduled = habits.filter((habit) => isScheduled(habit.days, today));
	const done = scheduled.filter((habit) => logKeys(logs, habit.id).includes(key)).length;
	const left = scheduled.length - done;
	const summary = habits.length === 0 ? "Add a habit to begin." : scheduled.length === 0 ? "Nothing scheduled today." : left === 0 ? "Today is complete." : left === 1 ? "1 left today." : `${left} left today.`;
	function edit(habit) {
		setDraft({
			mode: "edit",
			habit
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "page",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-4xl flex-col gap-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-end justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "kicker",
								children: "Cadence"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-display text-balance",
								children: format(today, "EEEE")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-muted",
								children: format(today, "d MMMM")
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "shrink-0 text-right",
						children: [scheduled.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-3xl leading-none",
							children: "Rest"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "nums font-display text-3xl leading-none",
							children: [done, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted",
								children: ["/", scheduled.length]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "today"
						})]
					})]
				}),
				scheduled.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
					done,
					scheduled: scheduled.length,
					label: summary
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					"aria-live": "polite",
					children: summary
				}),
				habits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "empty-state panel",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl",
							children: "No habits yet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "max-w-sm text-pretty text-muted",
							children: "Add one you can keep today. A short list beats a perfect one."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "btn btn-primary",
							onClick: () => setDraft({ mode: "create" }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
								className: "size-4",
								"aria-hidden": true
							}), "Add habit"]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full sm:w-80",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ViewSwitch, {
								value: view,
								onChange: setView
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "btn btn-primary w-full sm:w-auto",
							onClick: () => setDraft({ mode: "create" }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
								className: "size-4",
								"aria-hidden": true
							}), "Add habit"]
						})]
					}),
					view === "today" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TodayView, {
						today,
						onEdit: edit
					}),
					view === "week" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeekView, {
						today,
						onEdit: edit
					}),
					view === "month" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthView, {
						today,
						onEdit: edit
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-xs text-subtle",
					children: "Saved on this device."
				})
			]
		}), draft && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HabitDialog, {
			draft,
			onClose: () => setDraft(null)
		}, draft.mode === "edit" ? draft.habit.id : "new")]
	});
}
function HabitApp() {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
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
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackerSkeleton, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tracker, {});
}
var SplitComponent = HabitApp;
//#endregion
export { SplitComponent as component };
