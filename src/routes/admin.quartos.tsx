import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  quartos as quartosSeed,
  featureLabel,
  formatBRL,
  camaTipoLabel,
  type Quarto,
  type Vaga,
  type CamaTipo,
  type VagaFeature,
} from "@/lib/hostel-data";
import { Bath, Plus, Settings2, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/quartos")({
  component: AdminQuartos,
});

const CAPACIDADES: Array<4 | 8 | 12> = [4, 8, 12];
const TIPOS: CamaTipo[] = ["solteiro", "casal", "beliche-inferior", "beliche-superior"];
const FEATURES: VagaFeature[] = [
  "perto-janela",
  "perto-porta",
  "sol-manha",
  "sem-sol",
  "tomada-individual",
  "luz-leitura",
];

type QuartoDraft = {
  id?: string;
  nome: string;
  capacidade: 4 | 8 | 12;
  banheiro: boolean;
  descricao: string;
};

type VagaDraft = {
  id?: string;
  numero: number;
  tipo: CamaTipo;
  precoDiaria: number;
  disponivel: boolean;
  features: VagaFeature[];
};

function AdminQuartos() {
  const [quartos, setQuartos] = useState<Quarto[]>(() =>
    quartosSeed.map((q) => ({ ...q, vagas: q.vagas.map((v) => ({ ...v, features: [...v.features] })) })),
  );

  const [quartoModal, setQuartoModal] = useState<{ open: boolean; quarto?: Quarto }>({ open: false });
  const [vagaModal, setVagaModal] = useState<{ open: boolean; quartoId?: string; vaga?: Vaga }>({ open: false });

  const onSaveQuarto = (draft: QuartoDraft) => {
    setQuartos((prev) => {
      if (draft.id) {
        return prev.map((q) =>
          q.id === draft.id
            ? { ...q, nome: draft.nome, capacidade: draft.capacidade, banheiro: draft.banheiro, descricao: draft.descricao }
            : q,
        );
      }
      const id = `q${Date.now()}`;
      return [
        ...prev,
        {
          id,
          nome: draft.nome,
          capacidade: draft.capacidade,
          banheiro: draft.banheiro,
          descricao: draft.descricao,
          vagas: [],
        },
      ];
    });
    setQuartoModal({ open: false });
  };

  const onSaveVaga = (quartoId: string, draft: VagaDraft) => {
    setQuartos((prev) =>
      prev.map((q) => {
        if (q.id !== quartoId) return q;
        if (draft.id) {
          return {
            ...q,
            vagas: q.vagas.map((v) =>
              v.id === draft.id
                ? {
                    ...v,
                    numero: draft.numero,
                    tipo: draft.tipo,
                    precoDiaria: draft.precoDiaria,
                    disponivel: draft.disponivel,
                    features: draft.features,
                  }
                : v,
            ),
          };
        }
        return {
          ...q,
          vagas: [
            ...q.vagas,
            {
              id: `${q.id}-v${Date.now()}`,
              numero: draft.numero,
              tipo: draft.tipo,
              precoDiaria: draft.precoDiaria,
              disponivel: draft.disponivel,
              features: draft.features,
            },
          ],
        };
      }),
    );
    setVagaModal({ open: false });
  };

  const onDeleteVaga = (quartoId: string, vagaId: string) => {
    setQuartos((prev) =>
      prev.map((q) => (q.id === quartoId ? { ...q, vagas: q.vagas.filter((v) => v.id !== vagaId) } : q)),
    );
  };

  return (
    <div className="p-8 max-w-6xl">
      <header className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl">Quartos & camas</h1>
          <p className="text-muted-foreground text-sm mt-1">Gerencie a disponibilidade e características de cada cama.</p>
        </div>

        <Button onClick={() => setQuartoModal({ open: true })}>
          <Plus className="size-4" /> Novo quarto
        </Button>
      </header>

      <div className="space-y-5">
        {quartos.map((q) => (
          <section key={q.id} className="bg-card border border-border rounded-2xl overflow-hidden">
            <header className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-border">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-2xl">{q.nome}</h2>
                  <Badge variant="secondary">{q.capacidade} camas</Badge>
                  <Badge
                    className={
                      q.banheiro
                        ? "bg-accent/15 text-accent border-transparent"
                        : "bg-muted text-muted-foreground border-transparent"
                    }
                  >
                    <Bath className="size-3.5 mr-1" /> {q.banheiro ? "Com banheiro" : "Sem banheiro"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{q.descricao}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setVagaModal({ open: true, quartoId: q.id })}>
                  <Plus className="size-4" /> Nova cama
                </Button>
                <Button variant="outline" size="sm" onClick={() => setQuartoModal({ open: true, quarto: q })}>
                  <Settings2 className="size-4" /> Editar quarto
                </Button>
              </div>
            </header>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left py-2.5 px-5">Cama</th>
                    <th className="text-left py-2.5 px-5">Tipo</th>
                    <th className="text-left py-2.5 px-5">Características</th>
                    <th className="text-left py-2.5 px-5">Diária</th>
                    <th className="text-left py-2.5 px-5">Status</th>
                    <th className="text-right py-2.5 px-5">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {q.vagas.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-6 px-5 text-center text-sm text-muted-foreground">
                        Nenhuma cama cadastrada nesse quarto.
                      </td>
                    </tr>
                  )}
                  {q.vagas.map((v) => (
                    <tr key={v.id} className="hover:bg-secondary/40">
                      <td className="py-3 px-5 font-medium">Nº {v.numero.toString().padStart(2, "0")}</td>
                      <td className="py-3 px-5">
                        <Badge variant="secondary" className="font-normal">
                          {camaTipoLabel[v.tipo]}
                        </Badge>
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex flex-wrap gap-1">
                          {v.features.map((f) => (
                            <span key={f} className="text-[11px] px-2 py-0.5 rounded-full bg-secondary">
                              {featureLabel[f]}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-5">{formatBRL(v.precoDiaria)}</td>
                      <td className="py-3 px-5">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            v.disponivel ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {v.disponivel ? "Disponível" : "Ocupada"}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setVagaModal({ open: true, quartoId: q.id, vaga: v })}>
                            Editar
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => onDeleteVaga(q.id, v.id)}>
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>

      <QuartoDialog
        key={quartoModal.quarto?.id ?? "new-quarto"}
        open={quartoModal.open}
        quarto={quartoModal.quarto}
        onClose={() => setQuartoModal({ open: false })}
        onSave={onSaveQuarto}
      />
      <VagaDialog
        key={vagaModal.vaga?.id ?? `new-vaga-${vagaModal.quartoId ?? ""}`}
        open={vagaModal.open}
        quartoId={vagaModal.quartoId}
        vaga={vagaModal.vaga}
        proximoNumero={
          vagaModal.quartoId
            ? (quartos.find((q) => q.id === vagaModal.quartoId)?.vagas.length ?? 0) + 1
            : 1
        }
        onClose={() => setVagaModal({ open: false })}
        onSave={onSaveVaga}
      />
    </div>
  );
}

function QuartoDialog({
  open,
  quarto,
  onClose,
  onSave,
}: {
  open: boolean;
  quarto?: Quarto;
  onClose: () => void;
  onSave: (draft: QuartoDraft) => void;
}) {
  const [nome, setNome] = useState(quarto?.nome ?? "");
  const [capacidade, setCapacidade] = useState<4 | 8 | 12>(quarto?.capacidade ?? 4);
  const [banheiro, setBanheiro] = useState<boolean>(quarto?.banheiro ?? false);
  const [descricao, setDescricao] = useState(quarto?.descricao ?? "");

  const isEdit = Boolean(quarto?.id);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar quarto" : "Novo quarto"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize as informações do quarto." : "Cadastre um novo quarto no albergue."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="nome">Nome do quarto</Label>
            <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Quarto Alecrim" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Capacidade</Label>
              <Select value={String(capacidade)} onValueChange={(v) => setCapacidade(Number(v) as 4 | 8 | 12)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CAPACIDADES.map((c) => (
                    <SelectItem key={c} value={String(c)}>{c} camas</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Banheiro privativo</Label>
              <div className="flex items-center gap-3 h-9">
                <Switch checked={banheiro} onCheckedChange={setBanheiro} />
                <span className="text-sm text-muted-foreground">{banheiro ? "Sim" : "Não"}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="desc">Descrição</Label>
            <Textarea id="desc" rows={3} value={descricao} onChange={(e) => setDescricao(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button
            disabled={!nome.trim()}
            onClick={() => onSave({ id: quarto?.id, nome: nome.trim(), capacidade, banheiro, descricao: descricao.trim() })}
          >
            {isEdit ? "Salvar alterações" : "Criar quarto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function VagaDialog({
  open,
  quartoId,
  vaga,
  proximoNumero,
  onClose,
  onSave,
}: {
  open: boolean;
  quartoId?: string;
  vaga?: Vaga;
  proximoNumero: number;
  onClose: () => void;
  onSave: (quartoId: string, draft: VagaDraft) => void;
}) {
  const [numero, setNumero] = useState<number>(vaga?.numero ?? proximoNumero);
  const [tipo, setTipo] = useState<CamaTipo>(vaga?.tipo ?? "solteiro");
  const [preco, setPreco] = useState<number>(vaga?.precoDiaria ?? 80);
  const [disponivel, setDisponivel] = useState<boolean>(vaga?.disponivel ?? true);
  const [features, setFeatures] = useState<VagaFeature[]>(vaga?.features ?? []);

  const toggleFeature = (f: VagaFeature) =>
    setFeatures((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));

  const isEdit = Boolean(vaga?.id);
  const canSave = useMemo(() => Boolean(quartoId) && numero > 0 && preco >= 0, [quartoId, numero, preco]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar cama" : "Nova cama"}</DialogTitle>
          <DialogDescription>
            Configure tipo, preço da diária, disponibilidade e características.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="num">Número</Label>
              <Input id="num" type="number" min={1} value={numero} onChange={(e) => setNumero(Number(e.target.value))} />
            </div>
            <div className="grid gap-2">
              <Label>Tipo</Label>
              <Select value={tipo} onValueChange={(v) => setTipo(v as CamaTipo)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIPOS.map((t) => (
                    <SelectItem key={t} value={t}>{camaTipoLabel[t]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="preco">Diária (R$)</Label>
              <Input id="preco" type="number" min={0} step={5} value={preco} onChange={(e) => setPreco(Number(e.target.value))} />
            </div>
            <div className="grid gap-2">
              <Label>Disponível</Label>
              <div className="flex items-center gap-3 h-9">
                <Switch checked={disponivel} onCheckedChange={setDisponivel} />
                <span className="text-sm text-muted-foreground">{disponivel ? "Sim" : "Ocupada"}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Características</Label>
            <div className="flex flex-wrap gap-2">
              {FEATURES.map((f) => {
                const active = features.includes(f);
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => toggleFeature(f)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition ${
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary text-foreground border-transparent hover:bg-secondary/70"
                    }`}
                  >
                    {featureLabel[f]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button
            disabled={!canSave}
            onClick={() => quartoId && onSave(quartoId, { id: vaga?.id, numero, tipo, precoDiaria: preco, disponivel, features })}
          >
            {isEdit ? "Salvar alterações" : "Adicionar cama"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
