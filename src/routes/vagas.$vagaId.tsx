import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { findVaga, featureLabel, formatBRL, camaTipoLabel } from "@/lib/hostel-data";
import { ArrowLeft, Bath, BedDouble, CreditCard, ShieldCheck, Users, Check } from "lucide-react";


const searchSchema = z.object({
  inicio: z.string().optional(),
  dias: z.coerce.number().int().min(1).max(60).optional(),
});

export const Route = createFileRoute("/vagas/$vagaId")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Detalhes da vaga — Albergue Almeida" }] }),
  component: VagaPage,
});

function todayISO(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

function VagaPage() {
  const { vagaId } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const result = findVaga(vagaId);

  const [inicio, setInicio] = useState(search.inicio ?? todayISO(1));
  const [dias, setDias] = useState(search.dias ?? 2);
  const [step, setStep] = useState<"detalhe" | "checkout" | "ok">("detalhe");
  const [hospede, setHospede] = useState("");
  const [email, setEmail] = useState("");

  const fim = useMemo(() => {
    const d = new Date(inicio);
    d.setDate(d.getDate() + dias);
    return d.toISOString().slice(0, 10);
  }, [inicio, dias]);

  if (!result) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <div className="max-w-xl mx-auto p-10 text-center">
          <p className="text-muted-foreground">Vaga não encontrada.</p>
          <Button asChild className="mt-4"><Link to="/">Voltar à busca</Link></Button>
        </div>
      </div>
    );
  }

  const { vaga, quarto } = result;
  const total = vaga.precoDiaria * dias;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-5xl px-6 py-10">
        <button onClick={() => navigate({ to: "/" })} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Voltar para busca
        </button>

        <div className="mt-6 grid lg:grid-cols-[1fr_380px] gap-8">
          <div>
            <div className="text-xs uppercase tracking-widest text-primary">{quarto.nome}</div>
            <h1 className="font-display text-4xl mt-1">Cama Nº {vaga.numero.toString().padStart(2, "0")} · {camaTipoLabel[vaga.tipo]}</h1>
            <div className="flex flex-wrap gap-2 mt-3 text-xs">
              <Badge><BedDouble className="size-3.5 mr-1" />{camaTipoLabel[vaga.tipo]}</Badge>
              <Badge variant="secondary"><Users className="size-3.5 mr-1" />{quarto.capacidade} camas no quarto</Badge>
              <Badge variant={quarto.banheiro ? "default" : "secondary"}>
                <Bath className="size-3.5 mr-1" />{quarto.banheiro ? "Banheiro privativo" : "Banheiro compartilhado"}
              </Badge>
            </div>


            <p className="mt-6 text-muted-foreground">{quarto.descricao}</p>

            <Separator className="my-8" />

            <h2 className="font-display text-2xl">Detalhes desta cama</h2>
            <ul className="mt-4 grid sm:grid-cols-2 gap-2">
              {vaga.features.map((f) => (
                <li key={f} className="flex items-center gap-2 p-3 bg-card border border-border rounded-lg">
                  <span className="grid place-items-center size-7 rounded-md bg-accent/15 text-accent">
                    <Check className="size-4" />
                  </span>
                  <span className="text-sm">{featureLabel[f]}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 p-4 rounded-xl bg-secondary/60 border border-border flex gap-3 text-sm">
              <ShieldCheck className="size-5 text-accent shrink-0 mt-0.5" />
              <div>
                <div className="font-medium">Cancelamento flexível</div>
                <div className="text-muted-foreground">Cancele até 3 dias antes do check-in sem nenhum custo. Diárias começam e terminam ao meio-dia.</div>
              </div>
            </div>
          </div>

          {/* Side booking */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              {step === "detalhe" && (
                <>
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-2xl">{formatBRL(vaga.precoDiaria)}</span>
                    <span className="text-xs text-muted-foreground">por diária</span>
                  </div>
                  <div className="mt-4 grid gap-3">
                    <div>
                      <Label htmlFor="ci" className="text-xs">Check-in</Label>
                      <Input id="ci" type="date" min={todayISO()} value={inicio} onChange={(e) => setInicio(e.target.value)} className="mt-1.5" />
                    </div>
                    <div>
                      <Label htmlFor="dd" className="text-xs">Diárias</Label>
                      <Input id="dd" type="number" min={1} max={60} value={dias} onChange={(e) => setDias(Math.max(1, +e.target.value || 1))} className="mt-1.5" />
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <Row label={`${formatBRL(vaga.precoDiaria)} × ${dias} diária(s)`} value={formatBRL(total)} />
                  <Row label="Taxa de serviço" value={formatBRL(0)} muted />
                  <Separator className="my-3" />
                  <Row label="Total" value={formatBRL(total)} bold />
                  <Button className="w-full mt-4" size="lg" onClick={() => setStep("checkout")}>
                    Reservar
                  </Button>
                  <p className="text-[11px] text-muted-foreground mt-3 text-center">
                    {fmt(inicio)} 12h → {fmt(fim)} 12h
                  </p>
                </>
              )}

              {step === "checkout" && (
                <>
                  <div className="flex items-center gap-2 text-sm font-medium"><CreditCard className="size-4" /> Pagamento no cartão</div>
                  <div className="mt-4 grid gap-3">
                    <div>
                      <Label htmlFor="nome" className="text-xs">Nome do hóspede</Label>
                      <Input id="nome" value={hospede} onChange={(e) => setHospede(e.target.value)} placeholder="Como está no documento" className="mt-1.5" />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-xs">E-mail</Label>
                      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" className="mt-1.5" />
                    </div>
                    <div>
                      <Label htmlFor="cc" className="text-xs">Número do cartão</Label>
                      <Input id="cc" placeholder="0000 0000 0000 0000" inputMode="numeric" className="mt-1.5" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="val" className="text-xs">Validade</Label>
                        <Input id="val" placeholder="MM/AA" className="mt-1.5" />
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="text-xs">CVV</Label>
                        <Input id="cvv" placeholder="123" className="mt-1.5" />
                      </div>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <Row label="Total a cobrar" value={formatBRL(total)} bold />
                  <Button className="w-full mt-4" size="lg" onClick={() => setStep("ok")} disabled={!hospede || !email}>
                    Confirmar pagamento
                  </Button>
                  <button onClick={() => setStep("detalhe")} className="block w-full text-center text-xs text-muted-foreground mt-3 hover:text-foreground">
                    Voltar
                  </button>
                </>
              )}

              {step === "ok" && (
                <div className="text-center py-4">
                  <div className="mx-auto grid place-items-center size-12 rounded-full bg-success/15 text-success">
                    <Check className="size-6" />
                  </div>
                  <h3 className="font-display text-xl mt-3">Reserva confirmada</h3>
                  <p className="text-sm text-muted-foreground mt-1">Enviamos os detalhes para {email}.</p>
                  <div className="mt-4 text-sm bg-secondary/60 rounded-lg p-3 text-left">
                    <div><span className="text-muted-foreground">Cama:</span> {quarto.nome} · Nº {vaga.numero} ({camaTipoLabel[vaga.tipo]})</div>
                    <div><span className="text-muted-foreground">Período:</span> {fmt(inicio)} → {fmt(fim)}</div>
                    <div><span className="text-muted-foreground">Total:</span> {formatBRL(total)}</div>
                  </div>
                  <Button asChild className="w-full mt-4"><Link to="/minhas-reservas">Ver minhas reservas</Link></Button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <BedDouble className="size-3.5" /> Quarto {quarto.nome} · {quarto.capacidade} camas
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold, muted }: { label: string; value: string; bold?: boolean; muted?: boolean }) {
  return (
    <div className={`flex justify-between text-sm ${bold ? "font-semibold text-base" : ""} ${muted ? "text-muted-foreground" : ""}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function fmt(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
