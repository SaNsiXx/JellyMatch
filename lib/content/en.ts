// English copy (default locale). Mirrors the Polish structure in ./pl.ts key for key.
import type { Content } from "./pl";

// The hiring app (accounts, demo, applications) stays on Staffinit's infrastructure.
const links = {
  signUp: "https://staffinit.com/auth/sign-up",
  demo: "https://staffinit.com/auth/sign-in?live=1",
  signIn: "https://staffinit.com/auth/sign-in",
  sales: "mailto:sales@staffinit.com",
};

export const en: Content = {
  links,
  brand: {
    name: "Jelly Match",
    tagline: "Jelly Match — applicant tracking that starts free",
  },

  nav: [
    { label: "Pricing", href: "/pricing" },
    { label: "Open positions", href: "/jobs" },
  ],

  hero: {
    eyebrow: "AI-powered applicant tracking",
    titleLines: ["Hiring software", "that starts", "free."],
    body: "Track your first role in Jelly Match with 1 active job and 300 applicants free. Upgrade only when your hiring pipeline grows.",
    primary: "Create account",
    secondary: "Try live demo",
    badge: "Free until your first AI shortlist",
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
        title: "One free active job",
        body: "Run a real hiring process before you pay. No credit card needed.",
        image: "benefit-free-role",
        alt: "A lime jelly cube with a glowing keyhole, resting on a dark pedestal",
      },
      {
        stat: { value: 250, suffix: "", label: "candidates" },
        title: "Room for 250 candidates",
        body: "Enough room to test sourcing, screening, and pipeline flow on a real role.",
        image: "benefit-250",
        alt: "A glass tray filled with neat rows of lime and violet jelly spheres",
      },
      {
        stat: { value: 0, suffix: " PLN", label: "per seat" },
        title: "No per-seat pricing",
        body: "Add your hiring team without turning every collaborator into another seat charge.",
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
    title: "One price per role. | Your whole team included.",
    body: "Jelly Match ranks your whole applicant pile and hands you a shortlist you can trust. Paid plans take in unlimited candidates, and you pay for the roles you are actively recruiting for — never for the size of your team. Start free on one role, no card.",
    primary: "Start free",
    secondary: "View demo",
    monthly: "Monthly",
    yearly: "Annual",
    notes: [
      "All prices are net, for business customers.",
      "Annual plans show the monthly equivalent. Stripe remains the source of truth at checkout.",
    ],
  },

  principles: {
    title: "Three principles | that never change.",
    items: [
      {
        title: "No per-seat pricing",
        body: "Invite the whole hiring team. No plan charges per seat and no plan gives you more colleagues than another, so collaboration is never a billable event.",
      },
      {
        title: "Unlimited candidates on every paid plan",
        body: "Add, import and rank as many people as you need. Applicants arriving through your career page are never refused on any plan, including Free.",
      },
      {
        title: "Priced by active roles",
        body: "Pay for how many roles you keep open at once — plus custom branding, integrations and compliance as you grow.",
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
      { label: "Pricing", href: "/pricing" },
      { label: "Open positions", href: "/jobs" },
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
    copyright: "© 2026 Jelly Match",
  },

  plans: {
    free: {
      name: "Free",
      description: "Rank your whole pile on one real role.",
      features: [
        "1 active role",
        "50 new candidates a month",
        "250 stored candidates, with a heads-up as you fill up",
        "Career-page applicants are never turned away",
        "AI shortlist ranking",
        "Your first AI shortlist free, no card",
        "20 AI assistant prompts to try on your own pipeline",
        "5 candidate conversations, unlimited replies",
        "Branded application forms",
        "Resume parsing and candidate profiles",
        "Source tracking",
        "Multi-language support",
      ],
      cta: "Start free",
      alt: "A single lime jelly droplet",
    },
    starter: {
      name: "Starter",
      description: "For one recruiter running a handful of roles at a time.",
      inherits: "Everything in Free, plus:",
      features: [
        "Up to 3 active roles",
        "Unlimited candidates — no monthly intake cap",
        "Unlimited AI shortlists on every role",
        "The AI assistant on your whole pipeline, no prompt cap",
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
      description: "For a hiring team recruiting continuously.",
      inherits: "Everything in Starter, plus:",
      features: [
        "Up to 10 active roles",
        "The AI Analysis dashboard",
        "Deeper analysis on every shortlisted application",
        "Calendar integration on every interview",
        "The full activity timeline on every candidate",
        "Recruiting pipelines",
        "Priority email support",
      ],
      cta: "Choose Growth",
      alt: "A tower of jelly blocks with a violet core",
    },
    scale: {
      name: "Scale",
      description: "Everything Jelly Match does, on one flat monthly plan.",
      inherits: "Everything in Growth, plus:",
      features: [
        "Up to 20 active roles",
        "Your own domain, no Jelly Match branding",
        "Connected mailboxes on your own domain",
        "SSO, SAML and SCIM",
        "Audit log and retention controls",
        "Priority support",
      ],
      cta: "Choose Scale",
      alt: "A large faceted jelly crystal",
    },
    enterprise: {
      name: "Enterprise",
      description: "For staffing-scale volume.",
      inherits: "Everything in Scale, plus:",
      features: [
        "An active-role limit negotiated for your contract",
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
    signIn: "Log in",
    signUp: "Sign up",
    tryDemo: "Try live demo",
    skip: "Skip to content",
    languageSwitch: "Language",
    switchTo: "switch to English",
    scroll: "Scroll",
    heroOutro: ["AI screening.", "No credit card."],
    marqueeLabel: "Key features",
    firstAiFree: "Free until your first AI shortlist",
    billingLabel: "Billing period",
    popular: "Popular",
    custom: "Custom",
    currency: "PLN",
    perMonth: "/month",
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

  pages: {
    pricing: {
      metaTitle: "Pricing — Jelly Match",
      metaDescription: "One price per role, your whole team included. Start free on one role — no card, no per-seat fees.",
    },
    jobs: {
      metaTitle: "Open positions — Jelly Match",
      metaDescription: "Browse current openings from teams hiring with Jelly Match and find your next opportunity.",
      eyebrow: "Job board",
      title: "Open | positions.",
      body: "Browse our current openings and find your next opportunity.",
      search: "Search jobs by title or location…",
      searchLabel: "Search jobs",
      typeLabel: "Job type",
      allTypes: "All types",
      types: { full_time: "Full-time", part_time: "Part-time", contract: "Contract", internship: "Internship" },
      remote: { remote: "Remote", hybrid: "Hybrid", onsite: "On-site" },
      count: (n: number) => (n === 1 ? "1 open position" : `${n} open positions`),
      posted: "Posted",
      noResults: "No positions match your search.",
      unavailable: "Open positions can't be loaded right now. Please try again in a moment.",
      view: "View position",
      back: "All positions",
      apply: "Apply now",
      applyNote: "Takes a few minutes · No account required",
      about: "About this role",
      details: "Details",
      company: "Company",
      location: "Location",
      salary: "Salary",
      units: { HOUR: "per hour", MONTH: "per month", YEAR: "per year" },
      readyTitle: "Ready to apply?",
      readyBody: "Submit your application in just a few minutes.",
      applyCta: "Apply for this position",
      hiringCta: "Hiring yourself? Post your roles on Jelly Match — free for your first role.",
      hiringButton: "Start free",
    },
    legal: {
      contents: "Contents",
      languageNote: "",
      terms: { title: "Terms of Service", metaDescription: "The terms that govern your use of the hosted Jelly Match service." },
      privacy: { title: "Privacy Policy", metaDescription: "How Jelly Match collects, uses and protects personal data." },
    },
  },

  meta: {
    title: "Jelly Match — hiring software that starts free",
    description:
      "An applicant tracking system with AI screening. 1 active job and your first AI screening free — no credit card, no per-seat fees.",
    ogLocale: "en_GB",
    ogImage: "/og-en.jpg",
  },
};
