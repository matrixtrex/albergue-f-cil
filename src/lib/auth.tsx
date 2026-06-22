import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "admin" | "cliente";
export interface User {
  email: string;
  nome: string;
  role: Role;
}

interface AuthContextValue {
  user: User | null;
  login: (email: string, senha: string) => { ok: true } | { ok: false; error: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "albergue.auth.user";

// Credenciais de demonstração
const KNOWN_USERS: Record<string, { senha: string; user: User }> = {
  "admin@albergue.com": {
    senha: "admin123",
    user: { email: "admin@albergue.com", nome: "Sr. Almeida", role: "admin" },
  },
  "cliente@exemplo.com": {
    senha: "cliente123",
    user: { email: "cliente@exemplo.com", nome: "Hóspede Demo", role: "cliente" },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  function login(email: string, senha: string) {
    const entry = KNOWN_USERS[email.trim().toLowerCase()];
    if (!entry || entry.senha !== senha) {
      return { ok: false as const, error: "E-mail ou senha incorretos." };
    }
    setUser(entry.user);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entry.user));
    return { ok: true as const };
  }

  function logout() {
    setUser(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
