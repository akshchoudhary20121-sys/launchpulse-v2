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
} from "lucide-react";
import logo from "@/assets/logo.svg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.4, 0.25, 1] as const },
  }),
};

const services = [
  {
    icon: Globe,
    title: "Website Development",
    description: "Custom, responsive websites built with modern tech stacks. From landing pages to full web applications.",
    gradient: "from-cyan-500/20 to-blue-500/20",
  },
  {
    icon: Bot,
    title: "Discord & Bot Development",
    description: "Custom Discord bots, server setups, ticket systems, and automation solutions for communities.",
    gradient: "from-blue-500/20 to-indigo-500/20",
  },
  {
    icon: Palette,
    title: "Graphics & Branding",
    description: "Logos, brand identity, UI/UX design, and motion graphics that make your brand stand out.",
    gradient: "from-indigo-500/20 to-purple-500/20",
  },
  {
    icon: Code,
    title: "Roblox Development",
    description: "Game systems, scripts, UI design, and complete Roblox experiences from concept to publish.",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    icon: Cog,
    title: "Automations & Dashboards",
    description: "Workflow automations, custom dashboards, and tools that streamline your operations.",
    gradient: "from-pink-500/20 to-rose-500/20",
  },
  {
    icon: MessageSquare,
    title: "Content & Marketing",
    description: "Social media content, marketing strategies, and digital campaigns that drive growth.",
    gradient: "from-rose-500/20 to-cyan-500/20",
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
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <a href="/" className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-9 w-9" />
            <span className="text-lg font-bold tracking-tight">
              Nex<span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Dev</span>
            </span>
          </a>
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
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-purple-500/20 transition-all hover:shadow-purple-500/40 hover:brightness-110"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative flex min-h-screen items-center justify-center px-6 pt-16">
        {/* Background glow effects */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/8 blur-[120px]" />
          <div className="absolute right-1/4 top-1/2 h-[500px] w-[500px] rounded-full bg-purple-500/8 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur-sm">
              <Zap className="h-3.5 w-3.5 text-cyan-400" />
              Build. Support. Scale.
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl"
          >
            We build digital
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              solutions that scale
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
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
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-purple-500/40 hover:brightness-110"
            >
              View Pricing
              <ChevronRight className="h-4 w-4" />
            </a>
            <a
              href="#services"
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/30 px-8 py-3 text-sm font-medium text-muted-foreground backdrop-blur-sm transition-all hover:border-border hover:text-foreground"
            >
              Explore Services
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mx-auto mt-20 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

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
                className="group relative rounded-2xl border border-border/50 bg-card/40 p-7 backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-card/70 hover:shadow-lg hover:shadow-purple-500/5"
              >
                <div
                  className={`mb-5 inline-flex size-11 items-center justify-center rounded-xl bg-gradient-to-br ${service.gradient}`}
                >
                  <service.icon className="h-5 w-5 text-foreground/80" />
                </div>
                <h3 className="text-base font-semibold">{service.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
                <div className="mt-5 flex items-center gap-1 text-xs font-medium text-cyan-400 opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more <ArrowRight className="h-3 w-3" />
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
          <div className="absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-purple-500/5 blur-[100px]" />
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
                    ? "border-cyan-500/30 bg-gradient-to-b from-card/80 to-card/40 shadow-xl shadow-cyan-500/10"
                    : "border-border/50 bg-card/40 hover:border-border hover:bg-card/60"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                </div>
                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">/ {plan.period}</span>
                </div>
                <ul className="mt-8 flex-1 space-y-3">
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
                      : "border border-border/60 bg-card/30 text-foreground hover:border-border hover:bg-card/60"
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

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                className="rounded-2xl border border-border/50 bg-card/40 p-6 text-center backdrop-blur-sm"
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

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i}
                className="rounded-2xl border border-border/50 bg-card/40 p-7 backdrop-blur-sm"
              >
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-yellow-500/80 text-yellow-500/80" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 border-t border-border/50 pt-4">
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
              className="rounded-3xl border border-border/50 bg-gradient-to-b from-card/60 to-card/30 px-8 py-16 backdrop-blur-sm sm:px-16"
            >
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
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-purple-500/40 hover:brightness-110"
                >
                  <MessageSquare className="h-4 w-4" />
                  Contact on Discord
                </a>
                <a
                  href="mailto:hello@nexdev.com"
                  className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/30 px-8 py-3 text-sm font-medium text-muted-foreground backdrop-blur-sm transition-all hover:border-border hover:text-foreground"
                >
                  Email Us
                  <ArrowRight className="h-4 w-4" />
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border/50 px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-7 w-7" />
            <span className="text-sm font-semibold">
              Nex<span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Dev</span>
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
