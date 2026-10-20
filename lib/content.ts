// All page copy (PL). Source: staffinit.com/pl, machine-translation errors corrected, brand renamed to Jelly Match.

export const brand = {
  name: "Jelly Match",
  tagline: "Jelly Match — system rekrutacyjny, który zaczyna się za darmo",
};

export const links = {
  signUp: "https://staffinit.com/pl/auth/sign-up",
  demo: "https://staffinit.com/pl/auth/sign-in?live=1",
  signIn: "https://staffinit.com/pl/auth/sign-in",
  // TODO: real URLs for these pages were not provided — point them at the right destinations before launch.
  jobs: "https://staffinit.com/pl",
  terms: "https://staffinit.com/pl",
  privacy: "https://staffinit.com/pl",
  sales: "https://staffinit.com/pl/auth/sign-in?live=1",
};

export const nav = [
  { label: "Cennik", href: "#cennik" },
  { label: "Oferty pracy", href: links.jobs },
];

export const hero = {
  eyebrow: "System rekrutacyjny z AI",
  titleLines: ["Oprogramowanie", "do rekrutacji,", "które zaczyna się", "za darmo."],
  body: "Prowadź swoją pierwszą rekrutację w Jelly Match — 1 aktywne stanowisko i 300 kandydatów za darmo. Przejdź na wyższy plan dopiero, gdy Twój lejek rekrutacyjny urośnie.",
  primary: "Utwórz konto",
  secondary: "Wypróbuj demo na żywo",
  badge: "Pierwsza selekcja AI za darmo",
};

export const marquee = [
  "Bez karty kredytowej",
  "Bez opłat za użytkownika",
  "Selekcja AI",
  "Nielimitowani kandydaci w planach płatnych",
  "Ranking kandydatów przez AI",
  "Płacisz za aktywne stanowiska",
  "Strona kariery w Twojej identyfikacji",
  "Obsługa wielu języków",
];

export const benefits = {
  eyebrow: "Zacznij bez ryzyka",
  title: "Prawdziwa rekrutacja, | zanim zapłacisz.",
  items: [
    {
      stat: { value: 1, suffix: "", label: "darmowe stanowisko" },
      title: "Jedno darmowe, aktywne stanowisko",
      body: "Przeprowadź prawdziwą rekrutację, zanim zapłacisz. Bez karty kredytowej.",
      image: "benefit-free-role",
      alt: "Limonkowa kostka z galaretki z podświetloną dziurką od klucza na ciemnym postumencie",
    },
    {
      stat: { value: 250, suffix: "", label: "kandydatów" },
      title: "Miejsce na 250 kandydatów",
      body: "Wystarczająco dużo, by przetestować źródła pozyskiwania, selekcję i przepływ kandydatów na prawdziwym stanowisku.",
      image: "benefit-250",
      alt: "Szklana taca wypełniona równymi rzędami limonkowych i fioletowych kulek z galaretki",
    },
    {
      stat: { value: 0, suffix: " zł", label: "za użytkownika" },
      title: "Bez opłat za użytkownika",
      body: "Dodaj cały zespół rekrutacyjny, a każdy współpracownik nie oznacza kolejnej opłaty.",
      image: "benefit-team",
      alt: "Grupa galaretkowych postaci pod jedną wspólną fioletową kopułą",
    },
  ],
};

export const aiSelection = {
  eyebrow: "Jak działa selekcja AI",
  title: "Od stosu CV | do krótkiej listy.",
  steps: [
    {
      kicker: "01 — Zbieranie",
      title: "Cały stos aplikacji w jednym miejscu",
      body: "Zgłoszenia ze strony kariery trafiają do lejka rekrutacyjnego — nigdy nie są odrzucane. Jelly Match odczytuje CV i buduje profile kandydatów.",
      image: "ai-stack",
      alt: "Wysoki, nieuporządkowany stos szklanych kart dokumentów",
    },
    {
      kicker: "02 — Ocena",
      title: "AI ocenia każdą aplikację",
      body: "Ranking kandydatów przez AI porównuje każde zgłoszenie z wymaganiami stanowiska. Pierwsza selekcja AI jest bezpłatna, bez karty.",
      image: "ai-scan",
      alt: "Stos kart prześwietlany fioletową płaszczyzną światła, część kart świeci na limonkowo",
    },
    {
      kicker: "03 — Krótka lista",
      title: "Krótka lista, której możesz zaufać",
      body: "Dostajesz wyselekcjonowanych kandydatów i od razu przechodzisz do rozmów — z szablonami wiadomości i historią aktywności.",
      image: "ai-shortlist",
      alt: "Trzy świecące limonkowe karty ustawione w równym rzędzie, reszta rozpływa się we fioletowej mgle",
    },
  ],
};

export const pricingIntro = {
  eyebrow: "Cennik",
  title: "Jedna cena za stanowisko. | Cały zespół w cenie.",
  body: "Jelly Match ocenia cały stos aplikacji i przekazuje Ci krótką listę, której możesz zaufać. Płatne plany przyjmują nielimitowaną liczbę kandydatów, a płacisz za stanowiska, na które aktywnie rekrutujesz — nigdy za wielkość zespołu. Zacznij bezpłatnie od jednego stanowiska, bez karty.",
  primary: "Zacznij bezpłatnie",
  secondary: "Zobacz demo",
  monthly: "Miesięcznie",
  yearly: "Rocznie",
  notes: [
    "Wszystkie ceny są cenami netto, dla klientów biznesowych.",
    "Plany roczne pokazują równowartość miesięczną. Wiążąca jest kwota przy płatności w Stripe.",
  ],
};

export const principles = {
  title: "Trzy zasady, | które się nie zmieniają.",
  items: [
    {
      title: "Bez opłat za użytkownika",
      body: "Zaproś cały zespół. Żaden plan nie nalicza opłat za użytkownika, więc współpraca nigdy nie jest płatna.",
    },
    {
      title: "Nielimitowani kandydaci w każdym płatnym planie",
      body: "Dodawaj, importuj i oceniaj tyle osób, ile potrzebujesz. Zgłoszenia ze strony kariery nie są odrzucane w żadnym planie.",
    },
    {
      title: "Cena zależy od aktywnych stanowisk",
      body: "Płacisz za liczbę jednocześnie otwartych stanowisk, plus własny branding, integracje i zgodność, w miarę jak rośniecie.",
    },
  ],
};

export const finalCta = {
  title: "Zacznij rekrutować | za darmo.",
  body: "Jedno stanowisko, pierwsza selekcja AI i cały zespół — bez karty kredytowej.",
  primary: "Utwórz konto",
  secondary: "Wypróbuj demo na żywo",
};

export const footer = {
  links: [
    { label: "Cennik", href: "#cennik" },
    { label: "Oferty pracy", href: links.jobs },
    { label: "Regulamin", href: links.terms },
    { label: "Prywatność", href: links.privacy },
  ],
  copyright: "© 2026 Jelly Match",
};
