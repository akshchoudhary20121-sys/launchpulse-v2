import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    category: v.optional(v.string()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let services = await ctx.db
      .query("services")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    if (args.category) {
      services = services.filter((s) => s.category === args.category);
    }

    if (args.search) {
      const q = args.search.toLowerCase();
      services = services.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
      );
    }

    return services.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const service = await ctx.db
      .query("services")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    return service;
  },
});

export const getById = query({
  args: { id: v.id("services") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const categories = query({
  handler: async (ctx) => {
    const services = await ctx.db
      .query("services")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();
    const cats = [...new Set(services.map((s) => s.category))];
    return cats.sort();
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("services").first();
    if (existing) return "already_seeded";

    const now = Date.now();
    const services = [
      {
        name: "Website Development",
        slug: "website-development",
        description: "Custom, responsive websites built with modern tech stacks. From landing pages to full web applications.",
        longDescription: "We build fast, responsive, and visually striking websites tailored to your brand. Whether you need a single-page landing site or a complex web application, our team delivers clean code, modern frameworks, and pixel-perfect design. Every project includes responsive layouts, performance optimization, and SEO-ready structure.",
        category: "Development",
        price: 2999,
        priceUnit: "one-time",
        features: ["Custom design & development", "Responsive across all devices", "Performance optimized", "SEO-ready structure", "30 days post-launch support"],
        status: "active" as const,
        createdAt: now,
      },
      {
        name: "Discord Bot Development",
        slug: "discord-bot-development",
        description: "Custom Discord bots, server setups, ticket systems, and automation solutions for communities.",
        longDescription: "From moderation bots to complex ticket systems and auto-role assignments, we craft Discord bots that run reliably at scale. Our bots are built with discord.js, feature intuitive slash commands, and come with full documentation. We also handle server setup, channel structure, and permission configurations.",
        category: "Development",
        price: 1999,
        priceUnit: "one-time",
        features: ["Custom slash commands", "Ticket & moderation systems", "Auto-role & verification", "Dashboard & analytics", "Ongoing maintenance available"],
        status: "active" as const,
        createdAt: now + 1,
      },
      {
        name: "UI/UX Design",
        slug: "uiux-design",
        description: "User interface and experience design that balances aesthetics with usability. Wireframes to high-fidelity prototypes.",
        longDescription: "Great design is invisible — it just works. We craft interfaces that feel intuitive from the first tap. Our process starts with research and wireframing, moves into high-fidelity mockups, and ends with interactive prototypes your developers can ship. Every design decision is backed by usability principles and your brand guidelines.",
        category: "Design",
        price: 2499,
        priceUnit: "one-time",
        features: ["User research & personas", "Wireframing & prototyping", "High-fidelity mockups", "Design system creation", "Developer handoff files"],
        status: "active" as const,
        createdAt: now + 2,
      },
      {
        name: "Brand Identity Package",
        slug: "brand-identity",
        description: "Complete brand identity systems — logo, color palette, typography, and usage guidelines.",
        longDescription: "Your brand is more than a logo. We build cohesive identity systems that communicate your values at every touchpoint. The package includes logo design (primary, secondary, and icon variants), a defined color palette with HEX/RGB values, typography selection, and a brand guidelines document your team can reference for years.",
        category: "Design",
        price: 3499,
        priceUnit: "one-time",
        features: ["Logo (3 variants)", "Color palette & tokens", "Typography system", "Brand guidelines PDF", "Social media kit"],
        status: "active" as const,
        createdAt: now + 3,
      },
      {
        name: "Roblox Development",
        slug: "roblox-development",
        description: "Game systems, scripts, UI design, and complete Roblox experiences from concept to publish.",
        longDescription: "We build Roblox experiences that players love. From game mechanics and UI systems to full world-building and scripting, our team handles every aspect of Roblox development. We work in Luau, follow Roblox best practices, and optimize for performance across all devices.",
        category: "Development",
        price: 4999,
        priceUnit: "one-time",
        features: ["Game mechanics & scripting", "Custom UI/UX design", "3D environment building", "Performance optimization", "Publishing support"],
        status: "active" as const,
        createdAt: now + 4,
      },
      {
        name: "Workflow Automation",
        slug: "workflow-automation",
        description: "Automate repetitive tasks with custom dashboards, bots, and integration workflows.",
        longDescription: "Stop doing the same thing every day. We build automation systems that connect your tools, eliminate manual work, and give you dashboards to monitor everything. From Discord webhook integrations to full pipeline automations, we make your operations run themselves.",
        category: "Automation",
        price: 1499,
        priceUnit: "one-time",
        features: ["Custom automation flows", "Tool integrations", "Monitoring dashboards", "Error handling & alerts", "Documentation & training"],
        status: "active" as const,
        createdAt: now + 5,
      },
      {
        name: "Monthly Retainer",
        slug: "monthly-retainer",
        description: "Ongoing development and support partnership. Priority access, unlimited small tasks, and a dedicated point of contact.",
        longDescription: "For teams that need continuous support without the overhead of hiring. Our monthly retainer gives you priority access to our team, unlimited small tasks (bug fixes, tweaks, updates), and a dedicated project manager. Larger projects are scoped separately with preferential pricing.",
        category: "Support",
        price: 9999,
        priceUnit: "per month",
        features: ["Priority support channel", "Unlimited small tasks", "Dedicated project manager", "Weekly progress reports", "Preferential pricing on projects"],
        status: "active" as const,
        createdAt: now + 6,
      },
      {
        name: "Content & Marketing",
        slug: "content-marketing",
        description: "Social media content, marketing strategies, and digital campaigns that drive real engagement.",
        longDescription: "We create content that stops the scroll. From social media graphics and copywriting to full campaign strategy, our marketing team builds narratives that connect with your audience. Every piece is designed to match your brand voice and drive measurable results.",
        category: "Marketing",
        price: 1999,
        priceUnit: "one-time",
        features: ["Content strategy", "Social media graphics", "Copywriting & captions", "Campaign planning", "Performance analytics"],
        status: "active" as const,
        createdAt: now + 7,
      },
    ];

    for (const svc of services) {
      await ctx.db.insert("services", svc);
    }
    return "seeded";
  },
});
