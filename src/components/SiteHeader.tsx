import { Link } from "@tanstack/react-router";
import { Bed } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-card/60 backdrop-blur sticky top-0 z-30">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="grid place-items-center w-9 h-9 rounded-lg bg-primary text-primary-foreground">
            <Bed className="size-5" />
          </span>
          <div className="leading-tight">
            <div className="font-display text-lg">Albergue Almeida</div>
            <div className="text-[11px] text-muted-foreground -mt-0.5">desde 1998 · centro histórico</div>
          </div>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "bg-secondary" }} className="px-3 py-2 rounded-md hover:bg-secondary">
            Buscar vagas
          </Link>
          <Link to="/minhas-reservas" activeProps={{ className: "bg-secondary" }} className="px-3 py-2 rounded-md hover:bg-secondary">
            Minhas reservas
          </Link>
          <Link to="/admin" className="px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary">
            Administração
          </Link>
        </nav>
      </div>
    </header>
  );
}
