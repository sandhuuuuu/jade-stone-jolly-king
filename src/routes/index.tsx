import { createFileRoute } from "@tanstack/react-router";
import { HabitApp } from "@/components/habits/tracker";

export const Route = createFileRoute("/")({ component: HabitApp });
