import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { reservasMock, findVaga, formatBRL } from "@/lib/hostel-data";
import { CalendarDays, MapPin, X } from "lucide-react";

export const Route = createFileRoute("/minhas-reservas")({
  head: () => ({ meta: [{ title: "Minhas reservas — Albergue Almeida" }] }),
  component: MinhasReservas,
});

function diffDias(inicio: string) {
  const d = new Date(inicio).getTime() - Date.now();
  return Math.ceil(d / (1000 * 60 * 60 * 24));
}

function MinhasReservas() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="font-display text-4xl">Minhas reservas</h1>
        <p className="text-muted-foreground mt-1">Acompanhe seus check-ins e cancele até 3 dias antes do início.</p>

        <div className="mt-8 grid gap-4">
          {reservasMock.map((r) => {
            const info = findVaga(r.vagaId);
            const podeCancelar = r.status === "confirmada" && diffDias(r.inicio) >= 3;
            return (
              <article key={r.id} className="bg-card border border-border rounded-2xl p-5 flex flex-wrap gap-5 items-center justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">#{r.id}</span>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="font-display text-xl">{info?.quarto.nome} · Vaga {info?.vaga.numero}</div>
                  <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-4" /> {fmt(r.inicio)} → {fmt(r.fim)} · {r.diarias} diária(s)</span>
                    <span className="inline-flex items-center gap-1.5"><MapPin className="size-4" /> Hóspede: {r.hospede}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-lg">{formatBRL(r.total)}</div>
                  <div className="mt-2 flex gap-2 justify-end">
                    <Button variant="outline" size="sm" disabled={!podeCancelar} title={podeCancelar ? "" : "Cancelamento permitido apenas até 3 dias antes"}>
                      <X className="size-4" /> Cancelar
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Button asChild variant="outline"><Link to="/">Fazer nova reserva</Link></Button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: "confirmada" | "cancelada" | "concluida" }) {
  const map = {
    confirmada: { label: "Confirmada", cls: "bg-success/15 text-success" },
    cancelada: { label: "Cancelada", cls: "bg-destructive/15 text-destructive" },
    concluida: { label: "Concluída", cls: "bg-muted text-muted-foreground" },
  } as const;
  const s = map[status];
  return <Badge className={`${s.cls} border-transparent hover:${s.cls}`}>{s.label}</Badge>;
}

function fmt(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
