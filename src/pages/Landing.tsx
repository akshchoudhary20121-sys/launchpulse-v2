import { motion } from "framer-motion";
import {
  Code,
  Globe,
  Palette,
  Bot,
  Cog,
  MessageSquare,
  ArrowRight,
  Check,
  Star,
  ChevronRight,
  Zap,
  Shield,
  Clock,
  Headphones,
  Send,
  Layers,
  Terminal,
  Search,
} from "lucide-react";
import logo from "@/assets/logo.svg";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.4, 0.25, 1] as const },
  }),
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const services = [
  { icon: Globe, title: "Web Development", description: "Custom, performant websites and web apps built with modern frameworks. Responsive, fast, and production-ready.", bgGradient: "from-cyan-500/15 to-blue-500/15" },
  { icon: Bot, title: "Discord & Bot Dev", description: "Custom bots, server automation, ticket systems, and community tools that scale with your audience.", bgGradient: "from-blue-500/15 to-indigo-500/15" },
  { icon: Palette, title: "UI/UX Design", description: "User interfaces that balance aesthetics with usability. Wireframes, prototypes, and design systems.", bgGradient: "from-indigo-500/15 to-purple-500/15" },
  { icon: Code, title: "Roblox Development", description: "Game systems, Luau scripting, UI design, and complete experiences from concept to publish.", bgGradient: "from-purple-500/15 to-pink-500/15" },
  { icon: Cog, title: "Automation", description: "Workflow automations, custom dashboards, and integration pipelines that eliminate manual work.", bgGradient: "from-pink-500/15 to-rose-500/15" },
  { icon: MessageSquare, title: "Brand & Marketing", description: "Brand identity, social content, campaign strategy, and digital marketing that drives engagement.", bgGradient: "from-rose-500/15 to-cyan-500/15" },
];

const processSteps = [
  { step: "01", title: "Browse the catalog", description: "Explore our services, compare pricing, and find the right fit for your project.", icon: Search },
  { step: "02", title: "Book a session", description: "Pick a date and time that works. We'll confirm within the hour.", icon: Layers },
  { step: "03", title: "We deliver", description: "Fast turnaround with revisions included. Track progress from your dashboard.", icon: Zap },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "₹999",
    period: "one-time",
    description: "For quick, single-deliverable projects.",
    features: ["Single service delivery", "Up to 2 revisions", "48-hour turnaround", "Discord support", "Source files included"],
    highlighted: false,
  },
  {
    name: "Professional",
    price: "₹4,999",
    period: "one-time",
    description: "For complex projects that need more attention.",
    features: ["Multi-service package", "Up to 5 revisions", "24-hour turnaround", "Priority support", "Post-delivery support", "Custom scope available", "Source files included"],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "₹14,999",
    period: "per month",
    description: "Ongoing partnership with dedicated support.",
    features: ["Unlimited services", "Unlimited revisions", "Same-day turnaround", "Dedicated PM", "30-day post-delivery SLA", "Custom scope & contract", "Direct priority channel", "Weekly reports"],
    highlighted: false,
  },
];

const testimonials = [
  { quote: "LaunchPulse kept the scope tight, communicated clearly, and delivered exactly what was promised. The bot runs flawlessly at scale.", author: "Community Lead", service: "Discord Bot Development" },
  { quote: "The website was fast, modern, and perfectly aligned with our brand. Turnaround was under 24 hours — genuinely impressive.", author: "Startup Founder", service: "Web Development" },
  { quote: "Professional from first message to final handoff. The brand package gave our entire project a cohesive, premium identity.", author: "Indie Developer", service: "Brand Identity" },
];

const stats = [
  { value: "200+", label: "Projects Shipped" },
  { value: "150+", label: "Clients Served" },
  { value: "24h", label: "Avg. Turnaround" },
  { value: "4.9", label: "Client Rating" },
];

export default function Landing() {
  return (
    <div className="noise-overlay min-h-screen bg-background text-foreground overflow-hidden">
      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <a href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <img src={logo} alt="Logo" className="h-9 w-9" />
            <span className="text-lg font-bold tracking-tight">
              Launch<span className="gradient-text">Pulse</span>
              <span className="text-xs font-normal text-muted-foreground ml-0.5">.studio</span>
            </span>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            <a href="/catalog" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Catalog</a>
            <a href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Pricing</a>
            <a href="#testimonials" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Reviews</a>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <a href="/auth" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Sign in</a>
            <a href="/auth" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-purple-500/20 transition-all hover:shadow-purple-500/40 hover:brightness-110">
              Get Started <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <button type="button" className="inline-flex size-10 items-center justify-center rounded-xl border border-border/50 bg-card/30 text-muted-foreground transition-colors hover:text-foreground md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 border-border/40 bg-background/95 backdrop-blur-2xl">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex flex-col gap-1 pt-12">
                <SheetClose asChild><a href="/catalog" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-card/60 hover:text-foreground"><Globe className="h-4 w-4" />Catalog</a></SheetClose>
                <SheetClose asChild><a href="#pricing" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-card/60 hover:text-foreground"><Layers className="h-4 w-4" />Pricing</a></SheetClose>
                <SheetClose asChild><a href="#testimonials" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-card/60 hover:text-foreground"><Star className="h-4 w-4" />Reviews</a></SheetClose>
                <SheetClose asChild><a href="/auth" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-card/60 hover:text-foreground"><Terminal className="h-4 w-4" />Sign in</a></SheetClose>
              </div>
              <div className="mt-auto px-4 pb-6">
                <SheetClose asChild>
                  <a href="/auth" className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition-all hover:brightness-110">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </a>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative flex min-h-screen items-center justify-center px-6 pt-16">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-[20%] h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/[0.07] blur-[150px]" />
          <div className="absolute right-[15%] top-[40%] h-[500px] w-[500px] rounded-full bg-purple-500/[0.06] blur-[130px]" />
          <div className="absolute left-[10%] top-[60%] h-[400px] w-[400px] rounded-full bg-blue-500/[0.04] blur-[120px]" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/40 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
              </span>
              Build. Support. Scale.
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            Digital services<br />
            <span className="gradient-text">built to ship</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            LaunchPulse Studio delivers development, design, and automation services with clear scope, fast turnaround, and production-grade quality. Browse the catalog, book a session, and track everything from your dashboard.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="/catalog" className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-purple-500/25 transition-all hover:shadow-purple-500/40 hover:brightness-110">
              Browse Catalog <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a href="#pricing" className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/20 px-8 py-3.5 text-sm font-medium text-muted-foreground backdrop-blur-sm transition-all hover:border-border/80 hover:text-foreground hover:bg-card/40">
              View Pricing
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="mx-auto mt-24 grid max-w-2xl grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold tracking-tight gradient-text">{stat.value}</div>
                <div className="mt-1.5 text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="relative px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="text-center">
            <motion.div variants={fadeUp} custom={0} className="mb-3 text-xs font-medium uppercase tracking-widest text-cyan-400">How It Works</motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl font-bold tracking-tight sm:text-4xl">Simple process, exceptional output</motion.h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger} className="mt-16 grid gap-8 md:grid-cols-3">
            {processSteps.map((step) => (
              <motion.div key={step.step} variants={item} className="relative text-center">
                <div className="absolute left-[calc(50%+40px)] top-8 hidden h-px w-[calc(100%-80px)] bg-gradient-to-r from-border/60 to-transparent md:block" />
                <div className="mx-auto mb-5 inline-flex size-16 items-center justify-center rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm">
                  <step.icon className="h-6 w-6 text-cyan-400" />
                </div>
                <div className="mb-2 text-xs font-bold uppercase tracking-widest text-purple-400">Step {step.step}</div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6"><div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" /></div>

      {/* ─── Services ─── */}
      <section id="services" className="relative px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="text-center">
            <motion.div variants={fadeUp} custom={0} className="mb-3 text-xs font-medium uppercase tracking-widest text-cyan-400">What We Do</motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl font-bold tracking-tight sm:text-4xl">Services built for builders</motion.h2>
            <motion.p variants={fadeUp} custom={2} className="mx-auto mt-4 max-w-xl text-muted-foreground">Everything from code to campaign — one catalog, one team, zero friction.</motion.p>
          </motion.div>
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <motion.div key={service.title} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} custom={i} className="gradient-border group relative rounded-2xl border border-border/40 bg-card/30 p-7 backdrop-blur-sm transition-all duration-300 hover:bg-card/60 hover:shadow-xl hover:shadow-purple-500/[0.04]">
                <div className={`mb-5 inline-flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${service.bgGradient}`}>
                  <service.icon className="h-5 w-5 text-foreground/80" />
                </div>
                <h3 className="text-base font-semibold">{service.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
                <div className="mt-5 flex items-center gap-1.5 text-xs font-medium text-cyan-400 opacity-0 transition-all duration-300 group-hover:opacity-100">
                  View in catalog <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section id="pricing" className="relative px-6 py-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-purple-500/[0.04] blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="text-center">
            <motion.div variants={fadeUp} custom={0} className="mb-3 text-xs font-medium uppercase tracking-widest text-purple-400">Pricing</motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl font-bold tracking-tight sm:text-4xl">Transparent, no surprises</motion.h2>
            <motion.p variants={fadeUp} custom={2} className="mx-auto mt-4 max-w-xl text-muted-foreground">Pick a tier that matches your scope. Upgrade or go custom anytime.</motion.p>
          </motion.div>
          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {pricingPlans.map((plan, i) => (
              <motion.div key={plan.name} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} custom={i} className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-300 ${plan.highlighted ? "border-cyan-500/30 bg-gradient-to-b from-cyan-500/[0.06] via-card/60 to-card/40 shadow-2xl shadow-cyan-500/[0.08]" : "border-border/40 bg-card/30 hover:border-border/70 hover:bg-card/50"}`}>
                {plan.highlighted && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-1 text-xs font-semibold text-white shadow-lg shadow-purple-500/25">Most Popular</div>}
                <div>
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{plan.description}</p>
                </div>
                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">/ {plan.period}</span>
                </div>
                <ul className="mt-8 flex-1 space-y-3.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />{f}
                    </li>
                  ))}
                </ul>
                <a href="/auth" className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all ${plan.highlighted ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:brightness-110" : "border border-border/50 bg-card/20 text-foreground hover:border-border/80 hover:bg-card/50"}`}>
                  Get Started <ArrowRight className="h-4 w-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6"><div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" /></div>

      {/* ─── Why Us ─── */}
      <section className="relative px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="text-center">
            <motion.div variants={fadeUp} custom={0} className="mb-3 text-xs font-medium uppercase tracking-widest text-cyan-400">Why Us</motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl font-bold tracking-tight sm:text-4xl">Built for people who ship</motion.h2>
          </motion.div>
          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Zap, title: "Fast Turnaround", desc: "Most projects delivered within 24 to 48 hours." },
              { icon: Shield, title: "Quality First", desc: "Every deliverable passes through our QA checklist." },
              { icon: Clock, title: "Clear Scope", desc: "Defined timelines and transparent pricing, always." },
              { icon: Headphones, title: "Ongoing Support", desc: "We stick around after delivery to make sure it works." },
            ].map((el, i) => (
              <motion.div key={el.title} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} custom={i} className="gradient-border rounded-2xl border border-border/40 bg-card/30 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:bg-card/50">
                <div className="mx-auto mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10">
                  <el.icon className="h-5 w-5 text-cyan-400" />
                </div>
                <h3 className="text-sm font-semibold">{el.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{el.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section id="testimonials" className="relative px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="text-center">
            <motion.div variants={fadeUp} custom={0} className="mb-3 text-xs font-medium uppercase tracking-widest text-purple-400">Testimonials</motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl font-bold tracking-tight sm:text-4xl">What clients say</motion.h2>
          </motion.div>
          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} custom={i} className="gradient-border rounded-2xl border border-border/40 bg-card/30 p-7 backdrop-blur-sm transition-all duration-300 hover:bg-card/50">
                <div className="mb-4 flex gap-0.5">{[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-yellow-500/80 text-yellow-500/80" />)}</div>
                <p className="text-sm leading-relaxed text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 border-t border-border/40 pt-4">
                  <div className="text-sm font-medium">{t.author}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{t.service}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section id="contact" className="relative px-6 py-28">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
            <motion.div variants={fadeUp} custom={0} className="relative overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-b from-card/50 to-card/20 px-8 py-16 backdrop-blur-sm sm:px-16">
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-purple-500/[0.06] blur-[80px]" />
              </div>
              <div className="relative z-10">
                <motion.h2 variants={fadeUp} custom={1} className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to ship something?</motion.h2>
                <motion.p variants={fadeUp} custom={2} className="mx-auto mt-4 max-w-md text-muted-foreground">Sign up, pick a service from the catalog, and book your first session. It takes less than two minutes.</motion.p>
                <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <a href="/auth" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-purple-500/25 transition-all hover:shadow-purple-500/40 hover:brightness-110">
                    <Terminal className="h-4 w-4" /> Create Account
                  </a>
                  <a href="/catalog" className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/20 px-8 py-3.5 text-sm font-medium text-muted-foreground backdrop-blur-sm transition-all hover:border-border/80 hover:text-foreground hover:bg-card/40">
                    Browse Catalog <ArrowRight className="h-4 w-4" />
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border/40 px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-7 w-7" />
            <span className="text-sm font-semibold">Launch<span className="gradient-text">Pulse</span><span className="text-xs font-normal text-muted-foreground ml-0.5">.studio</span></span>
          </div>
          <div className="flex gap-6">
            <a href="/catalog" className="text-xs text-muted-foreground transition-colors hover:text-foreground">Catalog</a>
            <a href="#pricing" className="text-xs text-muted-foreground transition-colors hover:text-foreground">Pricing</a>
            <a href="#testimonials" className="text-xs text-muted-foreground transition-colors hover:text-foreground">Reviews</a>
          </div>
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} LaunchPulse Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
