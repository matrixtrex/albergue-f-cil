import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { z } from "zod";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { LogIn, ShieldCheck } from "lucide-react";

const searchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/login")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Entrar — Albergue Almeida" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    const res = login(email, senha);
    if (!res.ok) {
      setErro(res.error);
      return;
    }
    navigate({ to: search.redirect ?? "/" });
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-md px-6 py-16">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-primary text-sm">
            <LogIn className="size-4" /> Acessar conta
          </div>
          <h1 className="font-display text-3xl mt-1">Entrar</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Acesse para gerenciar suas reservas ou a área administrativa.
          </p>

          <form onSubmit={onSubmit} className="mt-6 grid gap-4">
            <div>
              <Label htmlFor="email" className="text-xs">E-mail</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" placeholder="voce@email.com" />
            </div>
            <div>
              <Label htmlFor="senha" className="text-xs">Senha</Label>
              <Input id="senha" type="password" required value={senha} onChange={(e) => setSenha(e.target.value)} className="mt-1.5" />
            </div>
            {erro && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
                {erro}
              </div>
            )}
            <Button type="submit" size="lg" className="w-full">Entrar</Button>
          </form>

          <div className="mt-6 pt-5 border-t border-border text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 font-medium text-foreground mb-1.5">
              <ShieldCheck className="size-3.5" /> Contas de demonstração
            </div>
            <div>Admin: <code>admin@albergue.com</code> / <code>admin123</code></div>
            <div>Cliente: <code>cliente@exemplo.com</code> / <code>cliente123</code></div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          <Link to="/" className="hover:underline">← Voltar ao site</Link>
        </p>
      </div>
    </div>
  );
}
