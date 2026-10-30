// All page copy. Polish corrected from the Staffinit source, product renamed to Jelly Match.

export const LINKS = {
  signUp: "https://staffinit.com/pl/auth/sign-up",
  demo: "https://staffinit.com/pl/auth/sign-in?live=1",
  signIn: "https://staffinit.com/pl/auth/sign-in",
  // TODO: the brief gives no addresses for these; they point at the product home until supplied.
  jobs: "https://staffinit.com/pl",
  terms: "https://staffinit.com/pl",
  privacy: "https://staffinit.com/pl",
  // TODO: no sales contact in the brief.
  sales: "https://staffinit.com/pl/auth/sign-up",
};

export const NAV = [
  { label: "Cennik", href: "#cennik", external: false },
  { label: "Oferty pracy", href: LINKS.jobs, external: true },
];

export const HERO = {
  badge: "Pierwsza selekcja AI za darmo",
  before: "Oprogramowanie do rekrutacji, które zaczyna się",
  accent: "za darmo.",
  // Source says both 300 and 250; plan limits say 250, so 250 is used everywhere.
  lead: "Prowadź swoją pierwszą rekrutację w Jelly Match — 1 aktywne stanowisko i 250 kandydatów za darmo. Przejdź na wyższy plan dopiero, gdy Twój lejek rekrutacyjny urośnie.",
  primary: "Utwórz konto",
  secondary: "Wypróbuj demo na żywo",
};

export const MARQUEE = [
  "Bez karty kredytowej",
  "Bez opłat za użytkownika",
  "Selekcja AI",
  "Nielimitowani kandydaci w płatnych planach",
  "Płacisz za aktywne stanowiska",
  "Cały zespół w cenie",
];

export const BENEFITS = [
  {
    image: "benefit-free-role",
    alt: "Pojedyncza limonkowa kostka z galaretki na małym postumencie",
    value: 1,
    unit: "stanowisko",
    title: "Jedno darmowe, aktywne stanowisko",
    text: "Przeprowadź prawdziwą rekrutację, zanim zapłacisz. Bez karty kredytowej.",
  },
  {
    image: "benefit-250",
    alt: "Uporządkowana siatka limonkowych i fioletowych kulek z galaretki",
    value: 250,
    unit: "kandydatów",
    title: "Miejsce na 250 kandydatów",
    text: "Wystarczająco dużo, by przetestować źródła pozyskiwania, selekcję i przepływ kandydatów na prawdziwym stanowisku.",
  },
  {
    image: "benefit-team",
    alt: "Grupa postaci z galaretki w jednej wspólnej, fioletowej bańce",
    value: 0,
    unit: "zł za użytkownika",
    title: "Bez opłat za użytkownika",
    text: "Dodaj cały zespół rekrutacyjny, a każdy współpracownik nie oznacza kolejnej opłaty.",
  },
];

export const AI_STEPS = [
  {
    image: "ai-stack",
    alt: "Wysoki, nierówny stos półprzezroczystych kart dokumentów",
    title: "Zbierasz cały stos aplikacji",
    text: "Zgłoszenia trafiają w jedno miejsce, a odczyt CV zamienia je w profile kandydatów. Zgłoszenia ze strony kariery nigdy nie są odrzucane.",
  },
  {
    image: "ai-scan",
    alt: "Stos kart przechodzący przez płaszczyznę fioletowego światła, limonkowe karty wysuwają się na bok",
    title: "AI ocenia każdą aplikację",
    text: "Jelly Match ocenia cały stos i układa ranking kandydatów, bez ręcznego przeglądania każdego CV.",
  },
  {
    image: "ai-shortlist",
    alt: "Trzy świecące limonkowe karty ułożone w wachlarz, reszta rozpływa się w fioletowe krople",
    title: "Dostajesz krótką listę",
    text: "Na końcu masz krótką listę, której możesz zaufać. Pierwsza selekcja AI jest bezpłatna i nie wymaga karty.",
  },
];

export const PRICING = {
  title: { before: "Jedna cena za stanowisko.", accent: "Cały zespół w cenie." },
  lead: "Jelly Match ocenia cały stos aplikacji i przekazuje Ci krótką listę, której możesz zaufać. Płatne plany przyjmują nielimitowaną liczbę kandydatów, a płacisz za stanowiska, na które aktywnie rekrutujesz — nigdy za wielkość zespołu. Zacznij bezpłatnie od jednego stanowiska, bez karty.",
  primary: "Zacznij bezpłatnie",
  secondary: "Zobacz demo",
  notes: [
    "Wszystkie ceny są cenami netto, dla klientów biznesowych.",
    "Plany roczne pokazują równowartość miesięczną. Wiążąca jest kwota przy płatności w Stripe.",
  ],
};

export type Plan = {
  id: string;
  name: string;
  image: string;
  alt: string;
  /** Monthly net price in PLN; null = custom. */
  monthly: number | null;
  /** TODO: fill in equivalent monthly price on a yearly plan. Never invented. */
  yearly: number | null;
  tagline: string;
  inherits?: string;
  features: string[];
  cta: string;
  href: string;
  popular?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Bezpłatny",
    image: "plan-free",
    alt: "Pojedyncza kropla galaretki",
    monthly: 0,
    yearly: 0,
    tagline: "Oceń cały stos aplikacji na jednym prawdziwym stanowisku.",
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
    href: LINKS.signUp,
  },
  {
    id: "starter",
    name: "Starter",
    image: "plan-starter",
    alt: "Trzy krople galaretki rosnące od najmniejszej do największej",
    monthly: 199,
    yearly: null,
    tagline: "Dla jednej osoby rekrutującej na kilka stanowisk naraz.",
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
    href: LINKS.signUp,
  },
  {
    id: "growth",
    name: "Growth",
    image: "plan-growth",
    alt: "Krople galaretki zlewające się w jedną większą formę",
    monthly: 499,
    yearly: null,
    tagline: "Dla zespołu, który rekrutuje bez przerwy.",
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
    href: LINKS.signUp,
    popular: true,
  },
  {
    id: "scale",
    name: "Scale",
    image: "plan-scale",
    alt: "Wysoka wieża z zaokrąglonych bloków galaretki",
    monthly: 999,
    yearly: null,
    tagline: "Wszystko, co potrafi Jelly Match, w jednym stałym planie.",
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
    href: LINKS.signUp,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    image: "plan-enterprise",
    alt: "Fioletowy kryształ z galaretki ze świecącym limonkowym rdzeniem",
    monthly: null,
    yearly: null,
    tagline: "Dla wolumenu agencji rekrutacyjnej.",
    inherits: "Wszystko ze Scale, plus:",
    features: [
      "Limit stanowisk ustalony w umowie",
      "Indywidualna umowa i fakturowanie",
      "Przegląd bezpieczeństwa i prawny",
      "Dedykowany kanał wsparcia",
    ],
    cta: "Skontaktuj się z działem sprzedaży",
    href: LINKS.sales,
  },
];

export const PRINCIPLES = [
  {
    title: "Bez opłat za użytkownika",
    text: "Zaproś cały zespół. Żaden plan nie nalicza opłat za użytkownika, więc współpraca nigdy nie jest płatna.",
  },
  {
    title: "Nielimitowani kandydaci w każdym płatnym planie",
    text: "Dodawaj, importuj i oceniaj tyle osób, ile potrzebujesz. Zgłoszenia ze strony kariery nie są odrzucane w żadnym planie.",
  },
  {
    title: "Cena zależy od aktywnych stanowisk",
    text: "Płacisz za liczbę jednocześnie otwartych stanowisk, plus własny branding, integracje i zgodność, w miarę jak rośniecie.",
  },
];

export const FOOTER_TAGLINE = "Jelly Match — system rekrutacyjny, który zaczyna się za darmo";
