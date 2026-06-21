import { Link, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, BedDouble, CalendarCheck, ArrowLeft } from "lucide-react";

export function AdminShell() {
  return (
    <div className="min-h-screen flex bg-muted/40">
      <aside className="w-64 shrink-0 border-r border-border bg-card flex flex-col">
        <div className="px-5 py-5 border-b border-border">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Painel</div>
          <div className="font-display text-xl mt-0.5">Albergue Almeida</div>
        </div>
        <nav className="p-3 flex flex-col gap-1 text-sm">
          <NavItem to="/admin" icon={<LayoutDashboard className="size-4" />} label="Visão geral" exact />
          <NavItem to="/admin/quartos" icon={<BedDouble className="size-4" />} label="Quartos & vagas" />
          <NavItem to="/admin/reservas" icon={<CalendarCheck className="size-4" />} label="Reservas" />
        </nav>
        <div className="mt-auto p-3">
          <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-secondary">
            <ArrowLeft className="size-4" /> Voltar ao site
          </Link>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}

function NavItem({ to, icon, label, exact }: { to: string; icon: React.ReactNode; label: string; exact?: boolean }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact }}
      activeProps={{ className: "bg-primary text-primary-foreground" }}
      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-secondary"
    >
      {icon}
      {label}
    </Link>
  );
}
