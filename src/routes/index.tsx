import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { quartos, featureLabel, formatBRL, type VagaFeature } from "@/lib/hostel-data";
import { BedDouble, Bath, Users, Sun, Search, MapPin, ShieldCheck, Clock } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Reservar vaga — Albergue Almeida" },
      { name: "description", content: "Busque vagas disponíveis em quartos com ou sem banheiro. Reserve em minutos." },
    ],
  }),
  component: HomePage,
});

type Banheiro = "todos" | "com" | "sem";

function todayISO(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

function HomePage() {
  const [inicio, setInicio] = useState(todayISO(1));
  const [dias, setDias] = useState(2);
  const [banheiro, setBanheiro] = useState<Banheiro>("todos");
  const [features, setFeatures] = useState<Set<VagaFeature>>(new Set());
  const [searched, setSearched] = useState(false);

  const fim = useMemo(() => {
    const d = new Date(inicio);
    d.setDate(d.getDate() + dias);
    return d.toISOString().slice(0, 10);
  }, [inicio, dias]);

  const resultados = useMemo(() => {
    return quartos
      .filter((q) => (banheiro === "todos" ? true : banheiro === "com" ? q.banheiro : !q.banheiro))
      .map((q) => ({
        ...q,
        vagas: q.vagas.filter(
          (v) =>
            v.disponivel &&
            [...features].every((f) => v.features.includes(f)),
        ),
      }))
      .filter((q) => q.vagas.length > 0);
  }, [banheiro, features]);

  const totalVagas = resultados.reduce((s, q) => s + q.vagas.length, 0);

  function toggleFeature(f: VagaFeature) {
    setFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f);
      else next.add(f);
      return next;
    });
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-secondary/60 to-background">
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-primary">
              <MapPin className="size-3.5" /> Rua das Acácias, 142
            </span>
            <h1 className="font-display text-5xl md:text-6xl mt-3 leading-[1.05]">
              Uma cama boa, no quarto certo, pelo tempo que precisar.
            </h1>
            <p className="text-muted-foreground mt-4 text-lg">
              Escolha sua vaga sabendo se é beliche de cima, perto da janela ou no quarto com banheiro.
              Diárias do meio-dia ao meio-dia.
            </p>
          </div>
        </div>

        {/* Search card */}
        <div className="mx-auto max-w-6xl px-6 pb-12">
          <div className="bg-card border border-border rounded-2xl shadow-sm p-5 md:p-6">
            <div className="grid md:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-end">
              <div>
                <Label htmlFor="inicio" className="text-xs">Check-in (meio-dia)</Label>
                <Input id="inicio" type="date" value={inicio} min={todayISO()} onChange={(e) => setInicio(e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="dias" className="text-xs">Diárias</Label>
                <Input id="dias" type="number" min={1} max={60} value={dias} onChange={(e) => setDias(Math.max(1, +e.target.value || 1))} className="mt-1.5" />
              </div>
              <div>
                <Label className="text-xs">Banheiro</Label>
                <div className="mt-1.5 inline-flex rounded-md border border-input bg-background p-1 w-full">
                  {(["todos", "com", "sem"] as Banheiro[]).map((b) => (
                    <button
                      key={b}
                      onClick={() => setBanheiro(b)}
                      className={`flex-1 text-sm py-1.5 rounded ${banheiro === b ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
                    >
                      {b === "todos" ? "Todos" : b === "com" ? "Com" : "Sem"}
                    </button>
                  ))}
                </div>
              </div>
              <Button size="lg" onClick={() => setSearched(true)} className="md:w-auto w-full">
                <Search className="size-4" /> Buscar vagas
              </Button>
            </div>

            <div className="mt-5 pt-5 border-t border-border">
              <div className="text-xs text-muted-foreground mb-2">Preferências da vaga</div>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(featureLabel) as VagaFeature[]).map((f) => {
                  const active = features.has(f);
                  return (
                    <button
                      key={f}
                      onClick={() => toggleFeature(f)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        active
                          ? "bg-accent text-accent-foreground border-accent"
                          : "border-border hover:border-accent/60"
                      }`}
                    >
                      {featureLabel[f]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Clock className="size-3.5" /> Período: {fmt(inicio)} → {fmt(fim)}</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="size-3.5" /> Cancelamento grátis até 3 dias antes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Resultados */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-display text-3xl">Vagas disponíveis</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {searched ? `${totalVagas} vaga(s) em ${resultados.length} quarto(s)` : `Veja a disponibilidade do nosso albergue`}
            </p>
          </div>
        </div>

        <div className="grid gap-5">
          {resultados.map((q) => (
            <article key={q.id} className="bg-card border border-border rounded-2xl overflow-hidden">
              <header className="flex flex-wrap items-start justify-between gap-4 p-5 border-b border-border">
                <div>
                  <h3 className="font-display text-2xl flex items-center gap-3">
                    {q.nome}
                    <Badge variant="secondary" className="font-sans font-medium">{q.capacidade} vagas</Badge>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xl">{q.descricao}</p>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted">
                    <Users className="size-3.5" /> {q.capacidade} camas
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${q.banheiro ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"}`}>
                    <Bath className="size-3.5" /> {q.banheiro ? "Com banheiro" : "Sem banheiro"}
                  </span>
                </div>
              </header>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 p-5">
                {q.vagas.map((v) => (
                  <Link
                    key={v.id}
                    to="/vagas/$vagaId"
                    params={{ vagaId: v.id }}
                    search={{ inicio, dias }}
                    className="group block rounded-xl border border-border hover:border-primary/60 hover:shadow-sm transition-all bg-background p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs uppercase tracking-wider text-muted-foreground">Vaga</div>
                        <div className="font-display text-xl">Nº {v.numero.toString().padStart(2, "0")}</div>
                      </div>
                      <BedDouble className="size-5 text-primary" />
                    </div>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {v.features.slice(0, 3).map((f) => (
                        <li key={f} className="text-[11px] px-2 py-0.5 rounded-full bg-secondary">{featureLabel[f]}</li>
                      ))}
                      {v.features.length > 3 && (
                        <li className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">+{v.features.length - 3}</li>
                      )}
                    </ul>
                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <div className="font-semibold">{formatBRL(v.precoDiaria)}</div>
                        <div className="text-[11px] text-muted-foreground">por diária</div>
                      </div>
                      <span className="text-xs text-primary font-medium group-hover:underline">Reservar →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </article>
          ))}
          {resultados.length === 0 && (
            <div className="text-center py-16 bg-card border border-dashed border-border rounded-2xl">
              <Sun className="size-8 mx-auto text-muted-foreground" />
              <p className="mt-3 text-muted-foreground">Nenhuma vaga corresponde a esses filtros. Tente ajustar suas preferências.</p>
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-border bg-card mt-12">
        <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-muted-foreground flex flex-wrap justify-between gap-4">
          <span>© Albergue Almeida · Rua das Acácias, 142</span>
          <span>Diárias do meio-dia ao meio-dia · Pagamento em cartão de crédito</span>
        </div>
      </footer>
    </div>
  );
}

function fmt(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

// keep Checkbox import used (avoid TS unused warning)
void Checkbox;
