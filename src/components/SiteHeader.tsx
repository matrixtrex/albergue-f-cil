import { Link, useNavigate } from "@tanstack/react-router";
import { Bed, LogIn, LogOut, ShieldCheck, User } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function SiteHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b border-border bg-card/70 backdrop-blur sticky top-0 z-30">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="grid place-items-center w-9 h-9 rounded-lg bg-primary text-primary-foreground">
            <Bed className="size-5" />
          </span>
          <div className="leading-tight">
            <div className="font-display text-lg">Albergue Almeida</div>
            <div className="text-[11px] text-muted-foreground -mt-0.5">Rio de Janeiro · desde 1998</div>
          </div>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "bg-secondary" }} className="px-3 py-2 rounded-md hover:bg-secondary">
            Buscar camas
          </Link>
          <Link to="/minhas-reservas" activeProps={{ className: "bg-secondary" }} className="px-3 py-2 rounded-md hover:bg-secondary">
            Minhas reservas
          </Link>
          {user?.role === "admin" && (
            <Link to="/admin" className="px-3 py-2 rounded-md text-primary hover:bg-secondary inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5" /> Administração
            </Link>
          )}
          <span className="w-px h-6 bg-border mx-2" />
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <User className="size-3.5" /> {user.nome}
              </span>
              <button
                onClick={() => {
                  logout();
                  navigate({ to: "/" });
                }}
                className="px-3 py-2 rounded-md hover:bg-secondary inline-flex items-center gap-1.5 text-muted-foreground"
              >
                <LogOut className="size-3.5" /> Sair
              </button>
            </div>
          ) : (
            <Link to="/login" className="px-3 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 inline-flex items-center gap-1.5">
              <LogIn className="size-3.5" /> Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
