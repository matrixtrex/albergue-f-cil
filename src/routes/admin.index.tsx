import { createFileRoute } from "@tanstack/react-router";
import { quartos, reservasMock, formatBRL } from "@/lib/hostel-data";
import { BedDouble, CalendarCheck, TrendingUp, Users } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const totalVagas = quartos.reduce((s, q) => s + q.vagas.length, 0);
  const vagasOcupadas = quartos.reduce((s, q) => s + q.vagas.filter((v) => !v.disponivel).length, 0);
  const ocupacao = Math.round((vagasOcupadas / totalVagas) * 100);
  const receita = reservasMock.reduce((s, r) => s + (r.status !== "cancelada" ? r.total : 0), 0);
  const ativas = reservasMock.filter((r) => r.status === "confirmada").length;

  return (
    <div className="p-8 max-w-6xl">
      <header className="mb-8">
        <h1 className="font-display text-3xl">Visão geral</h1>
        <p className="text-muted-foreground text-sm mt-1">Resumo do albergue nesta semana.</p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Taxa de ocupação" value={`${ocupacao}%`} sub={`${vagasOcupadas}/${totalVagas} vagas`} icon={<TrendingUp className="size-4" />} />
        <Stat label="Reservas ativas" value={String(ativas)} sub="Confirmadas" icon={<CalendarCheck className="size-4" />} />
        <Stat label="Hóspedes hoje" value={String(vagasOcupadas)} sub="Check-ins no albergue" icon={<Users className="size-4" />} />
        <Stat label="Receita período" value={formatBRL(receita)} sub="Soma das reservas" icon={<BedDouble className="size-4" />} />
      </div>

      <section className="mt-10 grid lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="font-display text-xl">Ocupação por quarto</h2>
          <ul className="mt-4 space-y-3">
            {quartos.map((q) => {
              const ocup = q.vagas.filter((v) => !v.disponivel).length;
              const pct = Math.round((ocup / q.capacidade) * 100);
              return (
                <li key={q.id}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium">{q.nome} <span className="text-muted-foreground">· {q.capacidade} vagas</span></span>
                    <span className="text-muted-foreground">{ocup}/{q.capacidade}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="font-display text-xl">Próximos check-ins</h2>
          <ul className="mt-4 divide-y divide-border">
            {reservasMock.filter((r) => r.status === "confirmada").map((r) => (
              <li key={r.id} className="py-3 flex justify-between items-center">
                <div>
                  <div className="font-medium">{r.hospede}</div>
                  <div className="text-xs text-muted-foreground">{r.id} · {fmt(r.inicio)} → {fmt(r.fim)}</div>
                </div>
                <div className="text-sm font-medium">{formatBRL(r.total)}</div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, sub, icon }: { label: string; value: string; sub: string; icon: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between text-muted-foreground text-xs uppercase tracking-wider">
        <span>{label}</span>
        <span>{icon}</span>
      </div>
      <div className="font-display text-3xl mt-2">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
    </div>
  );
}

function fmt(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
