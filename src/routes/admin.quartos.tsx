import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { quartos, featureLabel, formatBRL, camaTipoLabel } from "@/lib/hostel-data";
import { Bath, Plus, Settings2 } from "lucide-react";

export const Route = createFileRoute("/admin/quartos")({
  component: AdminQuartos,
});

function AdminQuartos() {
  return (
    <div className="p-8 max-w-6xl">
      <header className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl">Quartos & camas</h1>
          <p className="text-muted-foreground text-sm mt-1">Gerencie a disponibilidade e características de cada cama.</p>
        </div>

        <Button><Plus className="size-4" /> Novo quarto</Button>
      </header>

      <div className="space-y-5">
        {quartos.map((q) => (
          <section key={q.id} className="bg-card border border-border rounded-2xl overflow-hidden">
            <header className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-border">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-2xl">{q.nome}</h2>
                  <Badge variant="secondary">{q.capacidade} camas</Badge>
                  <Badge className={q.banheiro ? "bg-accent/15 text-accent border-transparent" : "bg-muted text-muted-foreground border-transparent"}>

                    <Bath className="size-3.5 mr-1" /> {q.banheiro ? "Com banheiro" : "Sem banheiro"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{q.descricao}</p>
              </div>
              <Button variant="outline" size="sm"><Settings2 className="size-4" /> Editar quarto</Button>
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
                  {q.vagas.map((v) => (
                    <tr key={v.id} className="hover:bg-secondary/40">
                      <td className="py-3 px-5 font-medium">Nº {v.numero.toString().padStart(2, "0")}</td>
                      <td className="py-3 px-5">
                        <Badge variant="secondary" className="font-normal">{camaTipoLabel[v.tipo]}</Badge>
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex flex-wrap gap-1">
                          {v.features.map((f) => (
                            <span key={f} className="text-[11px] px-2 py-0.5 rounded-full bg-secondary">{featureLabel[f]}</span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-5">{formatBRL(v.precoDiaria)}</td>
                      <td className="py-3 px-5">
                        <span className={`text-xs px-2 py-1 rounded-full ${v.disponivel ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
                          {v.disponivel ? "Disponível" : "Ocupada"}
                        </span>
                      </td>
                      <td colSpan={1} className="py-3 px-5 text-right">
                        <Button variant="ghost" size="sm">Editar</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
