/**
 * Every string on the site lives here. Edit copy in this file, not in
 * components. No em-dashes anywhere: the house style uses periods and commas.
 */

export const brand = {
  name: "Cinq",
  wordmark: "cinq",
  tagline: "Software your business actually runs on.",
  domain: "cinqstudios.com",
} as const;

export const seo = {
  title: "Cinq. Software your business actually runs on.",
  description:
    "Cinq builds websites, mobile apps and the management systems behind restaurants, clinics and growing companies. Five founders in Islamabad, Pakistan.",
} as const;

export const contact = {
  // Still the working inbox. Swap for a Cinq address the day one exists;
  // an address that bounces is worse than one with the old name on it.
  email: "vertexdevstudio.tech@gmail.com",
  location: "Islamabad, Pakistan",
  response: "A senior person replies within 24 business hours.",
  copyright: "© 2026 Cinq",
  phones: [
    {
      name: "Hamza Sultan",
      display: "+92 320 2929511",
      tel: "+923202929511",
      wa: "923202929511",
    },
    {
      name: "Shahzaib Farooq",
      display: "+92 340 5889424",
      tel: "+923405889424",
      wa: "923405889424",
    },
  ],
} as const;

export const nav = {
  links: [
    { href: "#work", label: "Work" },
    { href: "#products", label: "Products" },
    { href: "#services", label: "Services" },
    { href: "#founders", label: "Founders" },
  ],
  cta: { href: "#contact", label: "Start a project" },
  menuNote: "Five founders. One studio. Islamabad, Pakistan.",
} as const;

export const hero = {
  headline: "Software your business actually runs on.",
  sub: "Websites, mobile apps and the systems behind restaurants, clinics and growing companies. Built in Islamabad by five founders.",
  primary: { href: "#contact", label: "Start a project" },
  secondary: { href: "#work", label: "See the work" },
} as const;

export const marquee = [
  "Restaurant systems",
  "Clinic software",
  "Personal finance",
  "Mobile apps",
  "Websites",
  "Automation and AI",
  "Product design",
] as const;

export type WorkVisual = "qeemat" | "rms" | "dentisto" | "spicehut";

export type WorkProject = {
  slug: string;
  name: string;
  title: string;
  kind: string;
  summary: string;
  outcome: string;
  visual: WorkVisual;
  /** Panel treatment inside the horizontal showcase. */
  tone: "ink" | "accent" | "deep" | "bone";
};

/** Claims are limited to what the source material supports. Do not add a
    capability to a card without something to back it up. */
export const work: WorkProject[] = [
  {
    slug: "qeemat",
    name: "Qeemat",
    title: "Money tracked from the alerts you already get.",
    kind: "Our product. In development.",
    summary:
      "Pakistani banks do not share transactions with apps, so every tracker asks you to type them in by hand. Qeemat reads the bank alerts in your notification tray and the receipt in your pocket, on the phone itself.",
    outcome: "A month you can look back at without logging a thing.",
    visual: "qeemat",
    tone: "ink",
  },
  {
    slug: "rms",
    name: "Cinq RMS",
    title: "One system for the floor, the kitchen and the till.",
    kind: "Restaurant management",
    summary:
      "A customer app for menus, ordering, delivery and loyalty. Behind it, the system the restaurant runs on: orders, kitchen, tables, branches and the till, with separate access for owners, managers, waiters and cashiers.",
    outcome: "Nothing gets lost between the table and the kitchen.",
    visual: "rms",
    tone: "accent",
  },
  {
    slug: "dentisto",
    name: "Dentisto",
    title: "A dental clinic that runs without paper.",
    kind: "Clinic management",
    summary:
      "Patients, appointments, tooth-by-tooth records, treatment notes, lab tests and billing in one place, so the front desk and the dentist are looking at the same thing.",
    outcome: "The full history is on screen before the patient sits down.",
    visual: "dentisto",
    tone: "deep",
  },
  {
    slug: "spicehut",
    name: "SpiceHUT",
    title: "Five products for one restaurant brand in Canada.",
    kind: "Client case study",
    summary:
      "Our largest client project to date. Two iOS apps, two Android apps and a website, covering online ordering for customers and the tools the restaurant runs on.",
    outcome: "Five products, one connected system.",
    visual: "spicehut",
    tone: "bone",
  },
];

export const studio = {
  statement:
    "We are a small software studio in Islamabad. We build our own products and we build for clients, on purpose. Running a restaurant system and a clinic system teaches you what goes wrong on a busy day: the order nobody sent to the kitchen, the appointment written on paper, the records living in three places. We bring that to every project.",
  facts: [
    { value: "5", label: "founders, all still building" },
    { value: "3", label: "products of our own" },
    { value: "24h", label: "to hear back from a senior person" },
  ],
} as const;

export type Product = {
  id: string;
  name: string;
  status?: string;
  who: string;
  what: string;
  get: string;
  cta: string;
  href: string;
};

export const products = {
  heading: "Three products, built from watching how these businesses actually run.",
  items: [
    {
      id: "qeemat",
      name: "Qeemat",
      status: "In development",
      who: "Anyone trying to keep track of where their money goes.",
      what: "Builds the record from bank alerts and receipt photos, read on the phone. Budgets, renewal reminders, spending by category and by person, exportable reports.",
      get: "A month you can look back at, without sitting down to log anything.",
      cta: "Ask about Qeemat",
      href: "#contact",
    },
    {
      id: "rms",
      name: "Cinq RMS",
      who: "Restaurants and cafés, from one branch to several.",
      what: "A customer app for ordering, delivery and loyalty. A back office for orders, kitchen, tables, floor areas and the till.",
      get: "One place where the floor, the kitchen and the till agree.",
      cta: "Book a restaurant demo",
      href: "#contact",
    },
    {
      id: "dentisto",
      name: "Dentisto",
      who: "Dentists and small clinics still on paper and phone calls.",
      what: "Patients and history, appointments and the front desk, tooth-by-tooth records, treatment notes, lab tests, pricing and billing.",
      get: "A patient's full history in front of you before they sit down.",
      cta: "Book a clinic demo",
      href: "#contact",
    },
  ] satisfies Product[],
} as const;

export type Service = {
  id: string;
  title: string;
  description: string;
  points: readonly string[];
};

export const services = {
  heading: "Need something that does not exist yet?",
  sub: "Senior people lead the work, and you see what shipped every week. Not a black box until the end of the month.",
  items: [
    {
      id: "web",
      title: "Websites and web software",
      description:
        "The site your customers see, and the tools your team uses behind it. Booking pages, customer portals, dashboards for whoever is running the day.",
      points: ["Marketing sites", "Portals and dashboards", "Built to stay quick as you grow"],
    },
    {
      id: "apps",
      title: "iPhone and Android apps",
      description:
        "Apps for your customers, or for staff working away from a desk. They keep working when the signal drops, and we handle the App Store and Play Store.",
      points: ["iOS and Android", "Works offline", "Store submission handled"],
    },
    {
      id: "ai",
      title: "Automation and AI where it saves time",
      description:
        "We take the repetitive work off your team: reading a receipt, sorting an enquiry, filling in what someone would otherwise retype. A person can always step in.",
      points: ["Inside the software you already use", "Human in the loop", "Only where it helps"],
    },
    {
      id: "design",
      title: "Product design",
      description:
        "Working out what to build before you pay to build it. Something you can click through and react to, and a design developers can hand straight to code.",
      points: ["Clickable prototypes", "Design systems", "Ready for engineering"],
    },
  ] satisfies Service[],
} as const;

export type Step = {
  title: string;
  body: string;
  gets: readonly string[];
};

export const process = {
  heading: "Four steps. You always know what happens next.",
  steps: [
    {
      title: "Understand",
      body: "We sit down with you and learn how the business actually runs, and what is going wrong, before anyone talks about screens.",
      gets: ["How it works today, written down", "The problems, in priority order"],
    },
    {
      title: "Plan",
      body: "We agree what gets built, in what order and for what budget. You see the shape of it and can change your mind while that is still cheap.",
      gets: ["Scope, split into what ships first", "A budget and a date"],
    },
    {
      title: "Build",
      body: "We design it and write it, and show you working software every week. The people you met are the people building it.",
      gets: ["A link you can click, every week", "The same people you met"],
    },
    {
      title: "Launch and improve",
      body: "We put it live, help your team get on to it, and keep improving it once real use shows what needs fixing.",
      gets: ["Your team trained on it", "Fixes driven by real use"],
    },
  ] satisfies Step[],
} as const;

export type Founder = {
  name: string;
  first: string;
  role: string;
  bio: string;
  image: string;
  github?: string;
  linkedin?: string;
  site?: string;
};

export const founders = {
  heading: "Five founders. The people accountable for the work.",
  /** Never guess a username. The UI only renders links that exist. */
  people: [
    {
      name: "Hamza Sultan",
      first: "Hamza",
      role: "Founder and CEO",
      bio: "Sets company direction and product strategy, and looks after client relationships across our products and custom work.",
      image: "/team/hamza.jpg",
      github: "https://github.com/hamziCodes",
      linkedin: "https://www.linkedin.com/in/hamzasultan-dev/",
    },
    {
      name: "Sameer Hassan",
      first: "Sameer",
      role: "Co-founder and CPO",
      bio: "Shapes what we build and why, turning what a business needs into a product people can actually use.",
      image: "/team/sameer.jpg",
      github: "https://github.com/sameer-hassan01",
      linkedin: "https://www.linkedin.com/in/sameer-hassan-isb/",
      site: "https://sameer-hassan01.github.io/",
    },
    {
      name: "Shahzaib Farooq",
      first: "Shahzaib",
      role: "Co-founder and COO",
      bio: "Runs delivery and staffing: how work gets planned, built and out the door on time.",
      image: "/team/shahzaib.jpg",
      github: "https://github.com/sha1z-0",
      linkedin: "https://www.linkedin.com/in/shahzaib-farooq-/",
    },
    {
      name: "Hamood Bin Hafeez",
      first: "Hamood",
      role: "Co-founder and CTO",
      bio: "Leads engineering and the technical decisions behind what we build, from the first sketch to what runs in production.",
      image: "/team/hamood.jpg",
      linkedin: "https://www.linkedin.com/in/hamood-bin-hafeez-00b78a326/",
    },
    {
      name: "Umair Aamir",
      first: "Umair",
      role: "Co-founder and Security Lead",
      bio: "Keeps what we build safe, reviewing how customer data is stored, moved and protected before anything ships.",
      image: "/team/umair.jpg",
      linkedin: "https://www.linkedin.com/in/umair-aamir/",
    },
  ] satisfies Founder[],
} as const;

export const contactSection = {
  heading: "Tell us what you need.",
  lead: contact.response,
  needs: [
    { id: "rms", label: "Restaurant management", subject: "Book a restaurant demo" },
    { id: "clinic", label: "Clinic management", subject: "Book a clinic demo" },
    { id: "qeemat", label: "Qeemat", subject: "Ask about Qeemat" },
    { id: "web", label: "A website or app", subject: "Talk to Cinq about a website or app" },
    { id: "custom", label: "Custom software", subject: "Talk to Cinq about custom software" },
  ],
  timing: ["Immediately", "In 1 to 3 months", "Just looking"],
  fields: {
    name: "Your name",
    reach: "Email or phone",
    message: "In a sentence or two, what is the actual problem?",
    optional: "Optional",
  },
  send: "Send it to us",
  sendNote: "Opens your email app with everything filled in.",
  whatsapp: "Or message us on WhatsApp",
  errors: {
    need: "Pick what you need.",
    reach: "Add your name and an email or phone number.",
  },
} as const;

export const footer = {
  columns: [
    {
      title: "Site",
      links: [
        { href: "#work", label: "Work" },
        { href: "#products", label: "Products" },
        { href: "#services", label: "Services" },
        { href: "#process", label: "Process" },
        { href: "#founders", label: "Founders" },
        { href: "#contact", label: "Contact" },
      ],
    },
    {
      title: "Products",
      links: [
        { href: "#products", label: "Qeemat" },
        { href: "#products", label: "Cinq RMS" },
        { href: "#products", label: "Dentisto" },
      ],
    },
  ],
} as const;
