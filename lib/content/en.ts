// English copy (default locale). Mirrors the Polish structure in ./pl.ts key for key.
import type { Content } from "./pl";

// TODO: English destinations were not provided — these point at the Polish Staffinit app until confirmed.
const links = {
  signUp: "https://staffinit.com/pl/auth/sign-up",
  demo: "https://staffinit.com/pl/auth/sign-in?live=1",
  signIn: "https://staffinit.com/pl/auth/sign-in",
  jobs: "https://staffinit.com/pl",
  terms: "https://staffinit.com/pl",
  privacy: "https://staffinit.com/pl",
  sales: "https://staffinit.com/pl/auth/sign-in?live=1",
};

export const en: Content = {
  links,
  brand: {
    name: "Jelly Match",
    tagline: "Jelly Match — the applicant tracking system that starts free",
  },

  nav: [
    { label: "Pricing", href: "#cennik" },
    { label: "Jobs", href: links.jobs },
  ],

  hero: {
    eyebrow: "AI-powered applicant tracking",
    titleLines: ["Hiring software", "that starts", "free."],
    body: "Run your first hire in Jelly Match — 1 active job and 300 candidates for free. Upgrade only when your hiring pipeline grows.",
    primary: "Create account",
    secondary: "Try the live demo",
    badge: "Your first AI screening is free",
  },

  marquee: [
    "No credit card",
    "No per-seat fees",
    "AI screening",
    "Unlimited candidates on paid plans",
    "AI candidate ranking",
    "Pay for active jobs",
    "Career page in your branding",
    "Multi-language support",
  ],

  benefits: {
    eyebrow: "Start risk-free",
    title: "A real hire, | before you pay.",
    items: [
      {
        stat: { value: 1, suffix: "", label: "free job" },
        title: "One free, active job",
        body: "Run a real hire before you pay anything. No credit card required.",
        image: "benefit-free-role",
        alt: "A lime jelly cube with a glowing keyhole, resting on a dark pedestal",
      },
      {
        stat: { value: 250, suffix: "", label: "candidates" },
        title: "Room for 250 candidates",
        body: "Enough to test sourcing, screening and candidate flow on a real job.",
        image: "benefit-250",
        alt: "A glass tray filled with neat rows of lime and violet jelly spheres",
      },
      {
        stat: { value: 0, suffix: " PLN", label: "per seat" },
        title: "No per-seat fees",
        body: "Bring your whole hiring team — every collaborator you add costs nothing extra.",
        image: "benefit-team",
        alt: "A group of jelly figures sheltered under one shared violet dome",
      },
    ],
  },

  aiSelection: {
    eyebrow: "How AI screening works",
    title: "From a pile of CVs | to a shortlist.",
    steps: [
      {
        kicker: "01 — Collect",
        title: "Every application in one place",
        body: "Career-page applications flow straight into your hiring pipeline — never rejected. Jelly Match reads every CV and builds candidate profiles.",
        image: "ai-stack",
        alt: "A tall, messy stack of glass document cards",
      },
      {
        kicker: "02 — Score",
        title: "AI reviews every application",
        body: "AI candidate ranking compares each application with the job requirements. Your first AI screening is free, no card needed.",
        image: "ai-scan",
        alt: "A stack of cards scanned by a violet plane of light, some cards glowing lime",
      },
      {
        kicker: "03 — Shortlist",
        title: "A shortlist you can trust",
        body: "You get the strongest candidates and move straight to interviews — with message templates and full activity history.",
        image: "ai-shortlist",
        alt: "Three glowing lime cards standing in a neat row while the rest dissolve into violet mist",
      },
    ],
  },

  pricingIntro: {
    eyebrow: "Pricing",
    title: "One price per job. | Your whole team included.",
    body: "Jelly Match scores the entire application pile and hands you a shortlist you can trust. Paid plans accept unlimited candidates, and you pay for the jobs you're actively hiring for — never for the size of your team. Start free with one job, no card.",
    primary: "Start for free",
    secondary: "See the demo",
    monthly: "Monthly",
    yearly: "Yearly",
    notes: [
      "All prices are net, for business customers.",
      "Yearly plans show the monthly equivalent. The amount charged at Stripe checkout is binding.",
    ],
  },

  principles: {
    title: "Three principles | that never change.",
    items: [
      {
        title: "No per-seat fees",
        body: "Invite your whole team. No plan charges per user, so collaboration is never a cost.",
      },
      {
        title: "Unlimited candidates on every paid plan",
        body: "Add, import and score as many people as you need. Career-page applications are never rejected on any plan.",
      },
      {
        title: "Pricing follows your active jobs",
        body: "You pay for the number of jobs open at the same time, plus custom branding, integrations and compliance as you grow.",
      },
    ],
  },

  finalCta: {
    title: "Start hiring | for free.",
    body: "One job, your first AI screening and your whole team — no credit card.",
    primary: "Create account",
    secondary: "Try the live demo",
  },

  footer: {
    links: [
      { label: "Pricing", href: "#cennik" },
      { label: "Jobs", href: links.jobs },
      { label: "Terms", href: links.terms },
      { label: "Privacy", href: links.privacy },
    ],
    copyright: "© 2026 Jelly Match",
  },

  plans: {
    free: {
      name: "Free",
      description: "Score the whole application pile on one real job.",
      features: [
        "1 active job",
        "50 new candidates per month",
        "250 saved candidates, with a heads-up as you near the limit",
        "Career-page applications are never rejected",
        "AI candidate ranking",
        "First AI screening free, no card",
        "20 AI assistant queries",
        "5 candidate conversations, unlimited replies",
        "Application forms in your branding",
        "CV parsing and candidate profiles",
        "Source tracking",
        "Multi-language support",
      ],
      cta: "Start for free",
      alt: "A single lime jelly droplet",
    },
    starter: {
      name: "Starter",
      description: "For one recruiter hiring for a few jobs at once.",
      inherits: "Everything in Free, plus:",
      features: [
        "Up to 3 active jobs",
        "Unlimited candidates",
        "Unlimited AI screenings",
        "AI assistant with unlimited queries",
        "Bring your own AI key (BYOK)",
        "Interview scheduling and message templates",
        "Source tracking and analytics",
        "Email support",
      ],
      cta: "Choose Starter",
      alt: "Three jelly droplets, two lime and one violet",
    },
    growth: {
      name: "Growth",
      description: "For a team that never stops hiring.",
      inherits: "Everything in Starter, plus:",
      features: [
        "Up to 10 active jobs",
        "AI analytics dashboard",
        "Deeper analysis of every shortlisted application",
        "Calendar integration",
        "Full candidate activity history",
        "Hiring workflows",
        "Priority email support",
      ],
      cta: "Choose Growth",
      alt: "A tower of jelly blocks with a violet core",
    },
    scale: {
      name: "Scale",
      description: "Everything Jelly Match can do, in one fixed plan.",
      inherits: "Everything in Growth, plus:",
      features: [
        "Up to 20 active jobs",
        "Custom domain without Jelly Match branding",
        "Connected mailboxes on your domain",
        "SSO, SAML and SCIM",
        "Audit log and retention policies",
        "Priority support",
      ],
      cta: "Choose Scale",
      alt: "A large faceted jelly crystal",
    },
    enterprise: {
      name: "Enterprise",
      description: "For recruitment-agency volume.",
      inherits: "Everything in Scale, plus:",
      features: [
        "Job limit set in your contract",
        "Custom contract and invoicing",
        "Security and legal review",
        "Dedicated support channel",
      ],
      cta: "Contact sales",
      alt: "A monumental smoked-jelly monolith glowing lime and violet inside",
    },
  },

  ui: {
    home: "Jelly Match — home",
    top: "Jelly Match — back to top",
    mainNav: "Main",
    mobileNav: "Mobile menu",
    footerNav: "Footer",
    menu: "Menu",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    signIn: "Sign in",
    signUp: "Sign up",
    tryDemo: "Try the live demo",
    skip: "Skip to content",
    languageSwitch: "Language",
    switchTo: "switch to English",
    scroll: "Scroll",
    heroOutro: ["AI screening.", "No credit card."],
    marqueeLabel: "Key features",
    firstAiFree: "Your first AI screening is free",
    billingLabel: "Billing period",
    popular: "Popular",
    custom: "Custom",
    currency: "PLN",
    perMonth: "/mo",
    perMonthSr: "PLN per month",
    numberLocale: "en-GB",
    footerKicker: "Starts free",
    mascotPointAlt: "The Jelly Match mascot points a wing at the list of principles",
    mascotCelebrateAlt: "The Jelly Match mascot — a lime-and-violet jelly eagle — celebrating with its wings raised",
    mascotAlt: "The Jelly Match mascot — a jelly eagle",
    notFoundTitle: "This page isn't here.",
    notFoundBody: "But hiring still starts free.",
    notFoundCta: "Back to the homepage",
  },

  meta: {
    title: "Jelly Match — hiring software that starts free",
    description:
      "An applicant tracking system with AI screening. 1 active job and your first AI screening free — no credit card, no per-seat fees.",
    ogLocale: "en_GB",
    ogImage: "/og-en.jpg",
  },
};
