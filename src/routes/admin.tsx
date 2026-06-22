import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { AdminShell } from "@/components/AdminShell";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Administração — Albergue Almeida" }] }),
  component: AdminGate,
});

function AdminGate() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" search={{ redirect: "/admin" }} />;
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <div className="mx-auto max-w-md px-6 py-20 text-center">
          <div className="mx-auto grid place-items-center size-14 rounded-full bg-destructive/10 text-destructive">
            <ShieldAlert className="size-7" />
          </div>
          <h1 className="font-display text-3xl mt-4">Acesso restrito</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Esta área é exclusiva para administradores. Sua conta ({user.email}) não tem permissão.
          </p>
          <div className="mt-6 flex gap-2 justify-center">
            <Button asChild variant="outline"><Link to="/">Ir para o site</Link></Button>
            <Button asChild><Link to="/login">Trocar de conta</Link></Button>
          </div>
        </div>
      </div>
    );
  }

  return <AdminShell />;
}
