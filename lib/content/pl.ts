// Polish copy. Source: staffinit.com/pl, machine-translation errors corrected, brand renamed to Jelly Match.

const links = {
  signUp: "https://staffinit.com/pl/auth/sign-up",
  demo: "https://staffinit.com/pl/auth/sign-in?live=1",
  signIn: "https://staffinit.com/pl/auth/sign-in",
  // TODO: real URLs for these pages were not provided — point them at the right destinations before launch.
  jobs: "https://staffinit.com/pl",
  terms: "https://staffinit.com/pl",
  privacy: "https://staffinit.com/pl",
  sales: "https://staffinit.com/pl/auth/sign-in?live=1",
};

export const pl = {
  links,
  brand: {
    name: "Jelly Match",
    tagline: "Jelly Match — system rekrutacyjny, który zaczyna się za darmo",
  },

  nav: [
    { label: "Cennik", href: "#cennik" },
    { label: "Oferty pracy", href: links.jobs },
  ],

  hero: {
    eyebrow: "System rekrutacyjny z AI",
    titleLines: ["Oprogramowanie", "do rekrutacji,", "które zaczyna się", "za darmo."],
    body: "Prowadź swoją pierwszą rekrutację w Jelly Match — 1 aktywne stanowisko i 300 kandydatów za darmo. Przejdź na wyższy plan dopiero, gdy Twój lejek rekrutacyjny urośnie.",
    primary: "Utwórz konto",
    secondary: "Wypróbuj demo na żywo",
    badge: "Pierwsza selekcja AI za darmo",
  },

  marquee: [
    "Bez karty kredytowej",
    "Bez opłat za użytkownika",
    "Selekcja AI",
    "Nielimitowani kandydaci w planach płatnych",
    "Ranking kandydatów przez AI",
    "Płacisz za aktywne stanowiska",
    "Strona kariery w Twojej identyfikacji",
    "Obsługa wielu języków",
  ],

  benefits: {
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
  },

  aiSelection: {
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
  },

  pricingIntro: {
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
  },

  principles: {
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
  },

  finalCta: {
    title: "Zacznij rekrutować | za darmo.",
    body: "Jedno stanowisko, pierwsza selekcja AI i cały zespół — bez karty kredytowej.",
    primary: "Utwórz konto",
    secondary: "Wypróbuj demo na żywo",
  },

  footer: {
    links: [
      { label: "Cennik", href: "#cennik" },
      { label: "Oferty pracy", href: links.jobs },
      { label: "Regulamin", href: links.terms },
      { label: "Prywatność", href: links.privacy },
    ],
    copyright: "© 2026 Jelly Match",
  },
  plans: {
    free: {
      name: "Bezpłatny",
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
      alt: "Pojedyncza limonkowa kropla galaretki",
    },
    starter: {
      name: "Starter",
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
      alt: "Trzy krople galaretki, dwie limonkowe i jedna fioletowa",
    },
    growth: {
      name: "Growth",
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
      alt: "Wieża z galaretkowych bloków z fioletowym rdzeniem",
    },
    scale: {
      name: "Scale",
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
      alt: "Duży, fasetowany kryształ z galaretki",
    },
    enterprise: {
      name: "Enterprise",
      description: "Dla wolumenu agencji rekrutacyjnej.",
      inherits: "Wszystko ze Scale, plus:",
      features: [
        "Limit stanowisk ustalony w umowie",
        "Indywidualna umowa i fakturowanie",
        "Przegląd bezpieczeństwa i prawny",
        "Dedykowany kanał wsparcia",
      ],
      cta: "Skontaktuj się z działem sprzedaży",
      alt: "Monumentalny monolit z przydymionej galaretki z limonkowym i fioletowym światłem",
    },
  },
  ui: {
    home: "Jelly Match — strona główna",
    top: "Jelly Match — do góry",
    mainNav: "Główna",
    mobileNav: "Menu mobilne",
    footerNav: "Stopka",
    menu: "Menu",
    openMenu: "Otwórz menu",
    closeMenu: "Zamknij menu",
    signIn: "Zaloguj się",
    signUp: "Załóż konto",
    tryDemo: "Wypróbuj demo na żywo",
    skip: "Przejdź do treści",
    languageSwitch: "Wybór języka",
    switchTo: "przełącz na polski",
    scroll: "Przewiń",
    heroOutro: ["Selekcja AI.", "Bez karty kredytowej."],
    marqueeLabel: "Najważniejsze cechy",
    firstAiFree: "Pierwsza selekcja AI za darmo",
    billingLabel: "Okres rozliczeniowy",
    popular: "Popularny",
    custom: "Indywidualna",
    currency: "zł",
    perMonth: "/mies.",
    perMonthSr: "zł miesięcznie",
    numberLocale: "pl-PL",
    footerKicker: "Zaczyna się za darmo",
    mascotPointAlt: "Maskotka Jelly Match wskazuje skrzydłem na listę zasad",
    mascotCelebrateAlt:
      "Maskotka Jelly Match — orzeł z limonkowo-fioletowej galaretki — świętuje z uniesionymi skrzydłami",
    mascotAlt: "Maskotka Jelly Match — orzeł z galaretki",
    notFoundTitle: "Tej strony tu nie ma.",
    notFoundBody: "Ale rekrutacja wciąż zaczyna się za darmo.",
    notFoundCta: "Wróć na stronę główną",
  },
  meta: {
    title: "Jelly Match — oprogramowanie do rekrutacji, które zaczyna się za darmo",
    description:
      "System rekrutacyjny (ATS) z selekcją AI. 1 aktywne stanowisko i pierwsza selekcja AI za darmo, bez karty kredytowej i bez opłat za użytkownika.",
    ogLocale: "pl_PL",
    ogImage: "/og.jpg",
  },
};

export type Content = typeof pl;
