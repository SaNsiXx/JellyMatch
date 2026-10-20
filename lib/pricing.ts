import { links } from "./content";

export type Billing = "monthly" | "yearly";

export type Plan = {
  id: "free" | "starter" | "growth" | "scale" | "enterprise";
  name: string;
  /** Net PLN per month. null = custom pricing. */
  monthly: number | null;
  /**
   * Monthly equivalent when billed yearly (net PLN).
   * TODO: yearly prices were not provided — fill these in. While null, the yearly view shows the monthly price.
   */
  yearly: number | null;
  description: string;
  inherits?: string;
  features: string[];
  cta: string;
  href: string;
  popular?: boolean;
  image: string;
  alt: string;
};

export const plans: Plan[] = [
  {
    id: "free",
    name: "Bezpłatny",
    monthly: 0,
    yearly: 0,
    description: "Oceń cały stos aplikacji na jednym prawdziwym stanowisku.",
    features: [
      "1 aktywne stanowisko",
      "50 nowych kandydatów miesięcznie",
      "250 zapisanych kandydatów z powiadomieniem, gdy limit się zbliża",
      "Zgłoszenia ze strony kariery nigdy nie są odrzucane",
      "Ranking kandydatów przez AI",
      "Pierwsza selekcja AI bezpłatnie, bez karty",
      "20 zapytań do asystenta AI",
      "5 rozmów z kandydatami, nielimitowane odpowiedzi",
      "Formularze aplikacyjne w Twojej identyfikacji",
      "Odczyt CV i profile kandydatów",
      "Śledzenie źródeł",
      "Obsługa wielu języków",
    ],
    cta: "Zacznij bezpłatnie",
    href: links.signUp,
    image: "plan-free",
    alt: "Pojedyncza limonkowa kropla galaretki",
  },
  {
    id: "starter",
    name: "Starter",
    monthly: 199,
    yearly: null,
    description: "Dla jednej osoby rekrutującej na kilka stanowisk naraz.",
    inherits: "Wszystko z Bezpłatnego, plus:",
    features: [
      "Do 3 aktywnych stanowisk",
      "Nielimitowani kandydaci",
      "Nielimitowane selekcje AI",
      "Asystent AI bez limitu zapytań",
      "Własny klucz AI (BYOK)",
      "Planowanie rozmów i szablony wiadomości",
      "Śledzenie źródeł i analizy",
      "Wsparcie mailowe",
    ],
    cta: "Wybierz Starter",
    href: links.signUp,
    image: "plan-starter",
    alt: "Trzy krople galaretki, dwie limonkowe i jedna fioletowa",
  },
  {
    id: "growth",
    name: "Growth",
    monthly: 499,
    yearly: null,
    description: "Dla zespołu, który rekrutuje bez przerwy.",
    inherits: "Wszystko ze Startera, plus:",
    features: [
      "Do 10 aktywnych stanowisk",
      "Panel analiz AI",
      "Głębsza analiza każdej wyselekcjonowanej aplikacji",
      "Integracja kalendarza",
      "Pełna historia aktywności kandydata",
      "Procesy rekrutacyjne",
      "Priorytetowe wsparcie mailowe",
    ],
    cta: "Wybierz Growth",
    href: links.signUp,
    popular: true,
    image: "plan-growth",
    alt: "Wieża z galaretkowych bloków z fioletowym rdzeniem",
  },
  {
    id: "scale",
    name: "Scale",
    monthly: 999,
    yearly: null,
    description: "Wszystko, co potrafi Jelly Match, w jednym stałym planie.",
    inherits: "Wszystko z Growth, plus:",
    features: [
      "Do 20 aktywnych stanowisk",
      "Własna domena bez brandingu Jelly Match",
      "Podłączone skrzynki w Twojej domenie",
      "SSO, SAML i SCIM",
      "Dziennik audytu i zasady retencji",
      "Priorytetowe wsparcie",
    ],
    cta: "Wybierz Scale",
    href: links.signUp,
    image: "plan-scale",
    alt: "Duży, fasetowany kryształ z galaretki",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthly: null,
    yearly: null,
    description: "Dla wolumenu agencji rekrutacyjnej.",
    inherits: "Wszystko ze Scale, plus:",
    features: [
      "Limit stanowisk ustalony w umowie",
      "Indywidualna umowa i fakturowanie",
      "Przegląd bezpieczeństwa i prawny",
      "Dedykowany kanał wsparcia",
    ],
    cta: "Skontaktuj się z działem sprzedaży",
    href: links.sales,
    image: "plan-enterprise",
    alt: "Monumentalny monolit z przydymionej galaretki z limonkowym i fioletowym światłem",
  },
];

export function priceFor(plan: Plan, billing: Billing): number | null {
  if (plan.monthly === null) return null;
  if (billing === "yearly") return plan.yearly ?? plan.monthly;
  return plan.monthly;
}
