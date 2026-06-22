export type CamaTipo = "solteiro" | "casal" | "beliche-superior" | "beliche-inferior";

export type VagaFeature =
  | "perto-janela"
  | "perto-porta"
  | "sol-manha"
  | "sem-sol"
  | "tomada-individual"
  | "luz-leitura";

export interface Vaga {
  id: string;
  numero: number;
  tipo: CamaTipo;
  features: VagaFeature[];
  disponivel: boolean;
  precoDiaria: number;
}

export interface Quarto {
  id: string;
  nome: string;
  capacidade: 4 | 8 | 12;
  banheiro: boolean;
  descricao: string;
  vagas: Vaga[];
}

const feat = (...f: VagaFeature[]) => f;

const belicheTipo = (i: number): CamaTipo =>
  i % 2 === 0 ? "beliche-inferior" : "beliche-superior";

export const quartos: Quarto[] = [
  {
    id: "q1",
    nome: "Quarto Alecrim",
    capacidade: 4,
    banheiro: true,
    descricao: "Quarto compacto com banheiro privativo e sol da manhã. Mix de cama de solteiro e beliche.",
    vagas: [
      { id: "q1-v1", numero: 1, tipo: "solteiro", disponivel: true, precoDiaria: 110, features: feat("perto-janela", "sol-manha", "tomada-individual", "luz-leitura") },
      { id: "q1-v2", numero: 2, tipo: "casal", disponivel: true, precoDiaria: 180, features: feat("perto-janela", "sol-manha", "tomada-individual", "luz-leitura") },
      { id: "q1-v3", numero: 3, tipo: "beliche-inferior", disponivel: false, precoDiaria: 85, features: feat("perto-porta", "tomada-individual") },
      { id: "q1-v4", numero: 4, tipo: "beliche-superior", disponivel: true, precoDiaria: 75, features: feat("perto-porta", "luz-leitura") },
    ],
  },
  {
    id: "q2",
    nome: "Quarto Manjericão",
    capacidade: 8,
    banheiro: false,
    descricao: "Dormitório compartilhado amplo, ventilado, com beliches e camas de solteiro.",
    vagas: Array.from({ length: 8 }).map((_, i) => ({
      id: `q2-v${i + 1}`,
      numero: i + 1,
      tipo: i < 2 ? "solteiro" as CamaTipo : belicheTipo(i),
      disponivel: i % 3 !== 0,
      precoDiaria: i < 2 ? 80 : i % 2 === 0 ? 65 : 55,
      features: feat(
        i < 2 ? "perto-janela" : i > 5 ? "perto-porta" : "sem-sol",
        "tomada-individual",
      ),
    })),
  },
  {
    id: "q3",
    nome: "Quarto Hortelã",
    capacidade: 12,
    banheiro: true,
    descricao: "Dormitório grande com dois banheiros, beliches e área de bagagem.",
    vagas: Array.from({ length: 12 }).map((_, i) => ({
      id: `q3-v${i + 1}`,
      numero: i + 1,
      tipo: belicheTipo(i),
      disponivel: i % 4 !== 0,
      precoDiaria: i % 2 === 0 ? 75 : 65,
      features: feat(
        i < 4 ? "sol-manha" : "sem-sol",
        i % 3 === 0 ? "perto-janela" : "perto-porta",
        "luz-leitura",
        "tomada-individual",
      ),
    })),
  },
  {
    id: "q4",
    nome: "Quarto Lavanda",
    capacidade: 4,
    banheiro: true,
    descricao: "Quarto íntimo com banheiro, cama de casal e camas de solteiro.",
    vagas: [
      { id: "q4-v1", numero: 1, tipo: "casal", disponivel: true, precoDiaria: 190, features: feat("perto-janela", "sol-manha", "luz-leitura", "tomada-individual") },
      { id: "q4-v2", numero: 2, tipo: "solteiro", disponivel: true, precoDiaria: 110, features: feat("perto-janela", "sol-manha", "luz-leitura", "tomada-individual") },
      { id: "q4-v3", numero: 3, tipo: "solteiro", disponivel: true, precoDiaria: 105, features: feat("perto-porta", "sol-manha", "luz-leitura", "tomada-individual") },
      { id: "q4-v4", numero: 4, tipo: "solteiro", disponivel: true, precoDiaria: 105, features: feat("perto-porta", "luz-leitura", "tomada-individual") },
    ],
  },
];

export const featureLabel: Record<VagaFeature, string> = {
  "perto-janela": "Perto da janela",
  "perto-porta": "Perto da porta",
  "sol-manha": "Sol da manhã",
  "sem-sol": "Sem sol direto",
  "tomada-individual": "Tomada individual",
  "luz-leitura": "Luz de leitura",
};

export const camaTipoLabel: Record<CamaTipo, string> = {
  "solteiro": "Cama de solteiro",
  "casal": "Cama de casal",
  "beliche-superior": "Beliche · superior",
  "beliche-inferior": "Beliche · inferior",
};

export const camaTipoShort: Record<CamaTipo, string> = {
  "solteiro": "Solteiro",
  "casal": "Casal",
  "beliche-superior": "Beliche sup.",
  "beliche-inferior": "Beliche inf.",
};

export interface Reserva {
  id: string;
  hospede: string;
  email: string;
  vagaId: string;
  quartoId: string;
  inicio: string;
  fim: string;
  diarias: number;
  total: number;
  status: "confirmada" | "cancelada" | "concluida";
  criadaEm: string;
}

export const reservasMock: Reserva[] = [
  {
    id: "R-2041",
    hospede: "Marina Costa",
    email: "marina@exemplo.com",
    vagaId: "q1-v3",
    quartoId: "q1",
    inicio: "2026-06-19",
    fim: "2026-06-23",
    diarias: 4,
    total: 340,
    status: "confirmada",
    criadaEm: "2026-06-10",
  },
  {
    id: "R-2042",
    hospede: "Lucas Ferreira",
    email: "lucas@exemplo.com",
    vagaId: "q2-v1",
    quartoId: "q2",
    inicio: "2026-06-22",
    fim: "2026-06-28",
    diarias: 6,
    total: 480,
    status: "confirmada",
    criadaEm: "2026-06-15",
  },
  {
    id: "R-2039",
    hospede: "Aiko Tanaka",
    email: "aiko@exemplo.com",
    vagaId: "q3-v5",
    quartoId: "q3",
    inicio: "2026-06-05",
    fim: "2026-06-12",
    diarias: 7,
    total: 525,
    status: "concluida",
    criadaEm: "2026-05-28",
  },
];

export const findVaga = (id: string) => {
  for (const q of quartos) {
    const v = q.vagas.find((x) => x.id === id);
    if (v) return { quarto: q, vaga: v };
  }
  return null;
};

export const formatBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
