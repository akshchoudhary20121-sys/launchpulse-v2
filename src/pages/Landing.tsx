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
  Menu,
} from "lucide-react";
import logo from "@/assets/logo.svg";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const services = [
  {
    icon: Globe,
    title: "Website Development",
    description: "Custom, responsive websites built with modern tech stacks. From landing pages to full web applications.",
    gradient: "from-cyan-500 to-blue-500",
    bgGradient: "from-cyan-500/15 to-blue-500/15",
  },
  {
    icon: Bot,
    title: "Discord & Bot Development",
    description: "Custom Discord bots, server setups, ticket systems, and automation solutions for communities.",
    gradient: "from-blue-500 to-indigo-500",
    bgGradient: "from-blue-500/15 to-indigo-500/15",
  },
  {
    icon: Palette,
    title: "Graphics & Branding",
    description: "Logos, brand identity, UI/UX design, and motion graphics that make your brand stand out.",
    gradient: "from-indigo-500 to-purple-500",
    bgGradient: "from-indigo-500/15 to-purple-500/15",
  },
  {
    icon: Code,
    title: "Roblox Development",
    description: "Game systems, scripts, UI design, and complete Roblox experiences from concept to publish.",
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-500/15 to-pink-500/15",
  },
  {
    icon: Cog,
    title: "Automations & Dashboards",
    description: "Workflow automations, custom dashboards, and tools that streamline your operations.",
    gradient: "from-pink-500 to-rose-500",
    bgGradient: "from-pink-500/15 to-rose-500/15",
  },
  {
    icon: MessageSquare,
    title: "Content & Marketing",
    description: "Social media content, marketing strategies, and digital campaigns that drive growth.",
    gradient: "from-rose-500 to-cyan-500",
    bgGradient: "from-rose-500/15 to-cyan-500/15",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Tell us your vision",
    description: "Share your idea on Discord or email. We'll ask the right questions to understand your scope.",
    icon: Send,
  },
  {
    step: "02",
    title: "We scope & plan",
    description: "Clear timeline, transparent pricing, and a defined deliverable — no surprises.",
    icon: Layers,
  },
  {
    step: "03",
    title: "We build & deliver",
    description: "Fast turnaround with revisions included. You review, we refine until it's perfect.",
    icon: Zap,
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "₹499",
    period: "one-time",
    description: "Perfect for quick projects and single deliverables.",
    features: [
      "Single service delivery",
      "Up to 2 revisions",
      "Discord support",
      "48h turnaround",
      "Source files included",
    ],
    highlighted: false,
  },
  {
    name: "Professional",
    price: "₹1,999",
    period: "one-time",
    description: "Best for complex projects needing multiple revisions.",
    features: [
      "Multi-service package",
      "Up to 5 revisions",
      "Priority Discord support",
      "24h turnaround",
      "Source files included",
      "Post-delivery support",
      "Custom scope available",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "₹4,999",
    period: "per month",
    description: "Ongoing partnership for teams that need continuous support.",
    features: [
      "Unlimited services",
      "Unlimited revisions",
      "Direct priority support",
      "Same-day turnaround",
      "Source files included",
      "30-day post-delivery support",
      "Custom scope & SLA",
      "Dedicated project manager",
    ],
    highlighted: false,
  },
];

const testimonials = [
  {
    quote: "Clean work, clear scope, and delivered on time. Exactly what I needed for my Discord community.",
    author: "Client Name",
    service: "Discord Bot Development",
  },
  {
    quote: "The website they built for us was fast, modern, and exactly matched our brand vision. Highly recommend.",
    author: "Client Name",
    service: "Website Development",
  },
  {
    quote: "Professional from start to finish. The branding package gave our project a complete identity.",
    author: "Client Name",
    service: "Graphics & Branding",
  },
];

const stats = [
  { value: "200+", label: "Projects Delivered" },
  { value: "150+", label: "Happy Clients" },
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
              Nex<span className="gradient-text">Dev</span>
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden items-center gap-8 md:flex">
            <a href="#services" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Services
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Pricing
            </a>
            <a href="#testimonials" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Reviews
            </a>
          </div>

          {/* Desktop CTA */}
          <a
            href="#contact"
            className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-purple-500/20 transition-all hover:shadow-purple-500/40 hover:brightness-110 sm:inline-flex"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </a>

          {/* Mobile hamburger */}
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                className="inline-flex size-10 items-center justify-center rounded-xl border border-border/50 bg-card/30 text-muted-foreground transition-colors hover:text-foreground md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-72 border-border/40 bg-background/95 backdrop-blur-2xl"
            >
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex flex-col gap-1 pt-12">
                <SheetClose asChild>
                  <a
                    href="#services"
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-card/60 hover:text-foreground"
                  >
                    <Globe className="h-4 w-4" />
                    Services
                  </a>
                </SheetClose>
                <SheetClose asChild>
                  <a
                    href="#pricing"
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-card/60 hover:text-foreground"
                  >
                    <Layers className="h-4 w-4" />
                    Pricing
                  </a>
                </SheetClose>
                <SheetClose asChild>
                  <a
                    href="#testimonials"
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-card/60 hover:text-foreground"
                  >
                    <Star className="h-4 w-4" />
                    Reviews
                  </a>
                </SheetClose>
                <SheetClose asChild>
                  <a
                    href="#contact"
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-card/60 hover:text-foreground"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Contact
                  </a>
                </SheetClose>
              </div>
              <div className="mt-auto px-4 pb-6">
                <SheetClose asChild>
                  <a
                    href="#contact"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition-all hover:brightness-110"
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative flex min-h-screen items-center justify-center px-6 pt-16">
        {/* Background glow effects */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-[20%] h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/[0.07] blur-[150px]" />
          <div className="absolute right-[15%] top-[40%] h-[500px] w-[500px] rounded-full bg-purple-500/[0.06] blur-[130px]" />
          <div className="absolute left-[10%] top-[60%] h-[400px] w-[400px] rounded-full bg-blue-500/[0.04] blur-[120px]" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
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

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
          >
            We build digital
            <br />
            <span className="gradient-text">
              solutions that scale
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground"
          >
            From Discord bots and websites to branding and automations — we deliver
            polished digital products with clear scope, fast turnaround, and premium quality.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <a
              href="#pricing"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-purple-500/25 transition-all hover:shadow-purple-500/40 hover:brightness-110"
            >
              View Pricing
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#services"
              className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/20 px-8 py-3.5 text-sm font-medium text-muted-foreground backdrop-blur-sm transition-all hover:border-border/80 hover:text-foreground hover:bg-card/40"
            >
              Explore Services
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mx-auto mt-24 grid max-w-2xl grid-cols-2 gap-8 sm:grid-cols-4"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold tracking-tight gradient-text">
                  {stat.value}
                </div>
                <div className="mt-1.5 text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="relative px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center"
          >
            <motion.div variants={fadeUp} custom={0} className="mb-3 text-xs font-medium uppercase tracking-widest text-cyan-400">
              How It Works
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl font-bold tracking-tight sm:text-4xl">
              Simple process, exceptional results
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="mt-16 grid gap-8 md:grid-cols-3"
          >
            {processSteps.map((step) => (
              <motion.div key={step.step} variants={item} className="relative text-center">
                {/* Connector line */}
                <div className="absolute left-[calc(50%+40px)] top-8 hidden h-px w-[calc(100%-80px)] bg-gradient-to-r from-border/60 to-transparent md:block" />
                <div className="mx-auto mb-5 inline-flex size-16 items-center justify-center rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm">
                  <step.icon className="h-6 w-6 text-cyan-400" />
                </div>
                <div className="mb-2 text-xs font-bold uppercase tracking-widest text-purple-400">
                  Step {step.step}
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Divider ─── */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
      </div>

      {/* ─── Services ─── */}
      <section id="services" className="relative px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center"
          >
            <motion.div variants={fadeUp} custom={0} className="mb-3 text-xs font-medium uppercase tracking-widest text-cyan-400">
              What We Do
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl font-bold tracking-tight sm:text-4xl">
              Services built for your vision
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="mx-auto mt-4 max-w-xl text-muted-foreground">
              We handle everything from design to deployment, so you can focus on what matters most.
            </motion.p>
          </motion.div>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i}
                className="gradient-border group relative rounded-2xl border border-border/40 bg-card/30 p-7 backdrop-blur-sm transition-all duration-300 hover:bg-card/60 hover:shadow-xl hover:shadow-purple-500/[0.04]"
              >
                <div
                  className={`mb-5 inline-flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${service.bgGradient}`}
                >
                  <service.icon className="h-5 w-5 text-foreground/80" />
                </div>
                <h3 className="text-base font-semibold">{service.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
                <div className="mt-5 flex items-center gap-1.5 text-xs font-medium text-cyan-400 opacity-0 transition-all duration-300 group-hover:opacity-100">
                  Learn more <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section id="pricing" className="relative px-6 py-28">
        {/* Background accent */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-purple-500/[0.04] blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center"
          >
            <motion.div variants={fadeUp} custom={0} className="mb-3 text-xs font-medium uppercase tracking-widest text-purple-400">
              Pricing
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl font-bold tracking-tight sm:text-4xl">
              Simple, transparent pricing
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="mx-auto mt-4 max-w-xl text-muted-foreground">
              No hidden fees. Choose the plan that fits your project scope.
            </motion.p>
          </motion.div>

          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i}
                className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-300 ${
                  plan.highlighted
                    ? "border-cyan-500/30 bg-gradient-to-b from-cyan-500/[0.06] via-card/60 to-card/40 shadow-2xl shadow-cyan-500/[0.08]"
                    : "border-border/40 bg-card/30 hover:border-border/70 hover:bg-card/50"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-1 text-xs font-semibold text-white shadow-lg shadow-purple-500/25">
                    Most Popular
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{plan.description}</p>
                </div>
                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">/ {plan.period}</span>
                </div>
                <ul className="mt-8 flex-1 space-y-3.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:brightness-110"
                      : "border border-border/50 bg-card/20 text-foreground hover:border-border/80 hover:bg-card/50"
                  }`}
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Divider ─── */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
      </div>

      {/* ─── Why Choose Us ─── */}
      <section className="relative px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center"
          >
            <motion.div variants={fadeUp} custom={0} className="mb-3 text-xs font-medium uppercase tracking-widest text-cyan-400">
              Why Us
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl font-bold tracking-tight sm:text-4xl">
              Built different, designed to stand out
            </motion.h2>
          </motion.div>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Zap, title: "Fast Delivery", desc: "Most projects completed within 24-48 hours." },
              { icon: Shield, title: "Quality Assured", desc: "Every deliverable goes through our quality check." },
              { icon: Clock, title: "Clear Scope", desc: "Transparent communication from start to finish." },
              { icon: Headphones, title: "Ongoing Support", desc: "We're available even after project delivery." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i}
                className="gradient-border rounded-2xl border border-border/40 bg-card/30 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:bg-card/50"
              >
                <div className="mx-auto mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10">
                  <item.icon className="h-5 w-5 text-cyan-400" />
                </div>
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section id="testimonials" className="relative px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center"
          >
            <motion.div variants={fadeUp} custom={0} className="mb-3 text-xs font-medium uppercase tracking-widest text-purple-400">
              Testimonials
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl font-bold tracking-tight sm:text-4xl">
              What our clients say
            </motion.h2>
          </motion.div>

          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i}
                className="gradient-border rounded-2xl border border-border/40 bg-card/30 p-7 backdrop-blur-sm transition-all duration-300 hover:bg-card/50"
              >
                <div className="mb-4 flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-yellow-500/80 text-yellow-500/80" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{t.quote}&rdquo;
                </p>
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
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              variants={fadeUp}
              custom={0}
              className="relative overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-b from-card/50 to-card/20 px-8 py-16 backdrop-blur-sm sm:px-16"
            >
              {/* CTA background glow */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-purple-500/[0.06] blur-[80px]" />
              </div>
              <div className="relative z-10">
                <motion.h2 variants={fadeUp} custom={1} className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Ready to start your project?
                </motion.h2>
                <motion.p variants={fadeUp} custom={2} className="mx-auto mt-4 max-w-md text-muted-foreground">
                  Let's discuss your vision. We'll scope it out, give you a clear timeline, and deliver exactly what you need.
                </motion.p>
                <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <a
                    href="https://discord.gg/yourserver"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-purple-500/25 transition-all hover:shadow-purple-500/40 hover:brightness-110"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Contact on Discord
                  </a>
                  <a
                    href="mailto:hello@nexdev.com"
                    className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/20 px-8 py-3.5 text-sm font-medium text-muted-foreground backdrop-blur-sm transition-all hover:border-border/80 hover:text-foreground hover:bg-card/40"
                  >
                    Email Us
                    <ArrowRight className="h-4 w-4" />
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
            <span className="text-sm font-semibold">
              Nex<span className="gradient-text">Dev</span>
            </span>
          </div>
          <div className="flex gap-6">
            <a href="#services" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
              Services
            </a>
            <a href="#pricing" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
              Pricing
            </a>
            <a href="#testimonials" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
              Reviews
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} NexDev. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
