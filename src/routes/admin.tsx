import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/AdminShell";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Administração — Albergue Almeida" }] }),
  component: AdminShell,
});
