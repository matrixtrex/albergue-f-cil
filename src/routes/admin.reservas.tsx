import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { reservasMock, findVaga, formatBRL } from "@/lib/hostel-data";
import { Search } from "lucide-react";

export const Route = createFileRoute("/admin/reservas")({
  component: AdminReservas,
});

function AdminReservas() {
  const [filtro, setFiltro] = useState<"todas" | "confirmada" | "cancelada" | "concluida">("todas");
  const [q, setQ] = useState("");

  const lista = useMemo(() => {
    return reservasMock.filter((r) => {
      if (filtro !== "todas" && r.status !== filtro) return false;
      if (q && !`${r.hospede} ${r.email} ${r.id}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [filtro, q]);

  return (
    <div className="p-8 max-w-6xl">
      <header className="mb-8">
        <h1 className="font-display text-3xl">Reservas</h1>
        <p className="text-muted-foreground text-sm mt-1">Gestão de pedidos, check-ins e cancelamentos.</p>
      </header>

      <div className="bg-card border border-border rounded-2xl">
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-border">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por hóspede, e-mail ou ID" className="pl-9" />
          </div>
          <div className="inline-flex rounded-md border border-input bg-background p-1 text-sm">
            {(["todas", "confirmada", "concluida", "cancelada"] as const).map((s) => (
              <button key={s} onClick={() => setFiltro(s)} className={`px-3 py-1.5 rounded ${filtro === s ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>
                {labelStatus(s)}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left py-2.5 px-5">Reserva</th>
                <th className="text-left py-2.5 px-5">Hóspede</th>
                <th className="text-left py-2.5 px-5">Vaga</th>
                <th className="text-left py-2.5 px-5">Período</th>
                <th className="text-left py-2.5 px-5">Total</th>
                <th className="text-left py-2.5 px-5">Status</th>
                <th className="text-right py-2.5 px-5">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {lista.map((r) => {
                const info = findVaga(r.vagaId);
                return (
                  <tr key={r.id} className="hover:bg-secondary/40">
                    <td className="py-3 px-5 font-medium">{r.id}</td>
                    <td className="py-3 px-5">
                      <div>{r.hospede}</div>
                      <div className="text-xs text-muted-foreground">{r.email}</div>
                    </td>
                    <td className="py-3 px-5">{info?.quarto.nome} · Nº {info?.vaga.numero}</td>
                    <td className="py-3 px-5">{fmt(r.inicio)} → {fmt(r.fim)}<div className="text-xs text-muted-foreground">{r.diarias} diária(s)</div></td>
                    <td className="py-3 px-5">{formatBRL(r.total)}</td>
                    <td className="py-3 px-5"><StatusBadge status={r.status} /></td>
                    <td className="py-3 px-5 text-right">
                      <Button variant="ghost" size="sm">Ver</Button>
                    </td>
                  </tr>
                );
              })}
              {lista.length === 0 && (
                <tr><td colSpan={7} className="py-12 text-center text-muted-foreground">Nenhuma reserva encontrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function labelStatus(s: string) {
  return s === "todas" ? "Todas" : s === "confirmada" ? "Confirmadas" : s === "cancelada" ? "Canceladas" : "Concluídas";
}

function StatusBadge({ status }: { status: "confirmada" | "cancelada" | "concluida" }) {
  const map = {
    confirmada: "bg-success/15 text-success",
    cancelada: "bg-destructive/15 text-destructive",
    concluida: "bg-muted text-muted-foreground",
  } as const;
  return <Badge className={`${map[status]} border-transparent`}>{labelStatus(status)}</Badge>;
}

function fmt(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
