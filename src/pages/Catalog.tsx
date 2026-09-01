import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, Loader2, Grid3X3, List, SlidersHorizontal, X, Tag, Sparkles } from "lucide-react";
import logo from "@/assets/logo.svg";
import { Link } from "react-router";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const DISCORD_URL = "https://discord.gg/2srHufQ8pj";

// Local fallback data in case Convex isn't connected yet
const FALLBACK_CATALOG = [
  { _id: "1", name: "Website Development", slug: "website-development", category: "Development", price: 2999, priceUnit: "one-time", description: "Custom, responsive websites built with modern tech stacks. From landing pages to full web applications.", features: ["Custom design & development", "Responsive across all devices", "Performance optimized", "SEO-ready structure", "30 days post-launch support"], createdAt: 1 },
  { _id: "2", name: "Discord Bot Development", slug: "discord-bot-development", category: "Development", price: 1999, priceUnit: "one-time", description: "Custom Discord bots, server setups, ticket systems, and automation solutions for communities.", features: ["Custom slash commands", "Ticket & moderation systems", "Auto-role & verification", "Dashboard & analytics", "Ongoing maintenance available"], createdAt: 2 },
  { _id: "3", name: "UI/UX Design", slug: "uiux-design", category: "Design", price: 2499, priceUnit: "one-time", description: "User interface and experience design that balances aesthetics with usability. Wireframes to high-fidelity prototypes.", features: ["User research & personas", "Wireframing & prototyping", "High-fidelity mockups", "Design system creation", "Developer handoff files"], createdAt: 3 },
  { _id: "4", name: "Brand Identity Package", slug: "brand-identity", category: "Design", price: 3499, priceUnit: "one-time", description: "Complete brand identity systems — logo, color palette, typography, and usage guidelines.", features: ["Logo (3 variants)", "Color palette & tokens", "Typography system", "Brand guidelines PDF", "Social media kit"], createdAt: 4 },
  { _id: "5", name: "Roblox Development", slug: "roblox-development", category: "Development", price: 4999, priceUnit: "one-time", description: "Game systems, scripts, UI design, and complete Roblox experiences from concept to publish.", features: ["Game mechanics & scripting", "Custom UI/UX design", "3D environment building", "Performance optimization", "Publishing support"], createdAt: 5 },
  { _id: "6", name: "Workflow Automation", slug: "workflow-automation", category: "Automation", price: 1499, priceUnit: "one-time", description: "Automate repetitive tasks with custom dashboards, bots, and integration workflows.", features: ["Custom automation flows", "Tool integrations", "Monitoring dashboards", "Error handling & alerts", "Documentation & training"], createdAt: 6 },
  { _id: "7", name: "Monthly Retainer", slug: "monthly-retainer", category: "Support", price: 9999, priceUnit: "per month", description: "Ongoing development and support partnership. Priority access, unlimited small tasks, and a dedicated point of contact.", features: ["Priority support channel", "Unlimited small tasks", "Dedicated project manager", "Weekly progress reports", "Preferential pricing on projects"], createdAt: 7 },
  { _id: "8", name: "Content & Marketing", slug: "content-marketing", category: "Marketing", price: 1999, priceUnit: "one-time", description: "Social media content, marketing strategies, and digital campaigns that drive real engagement.", features: ["Content strategy", "Social media graphics", "Copywriting & captions", "Campaign planning", "Performance analytics"], createdAt: 8 },
];

type Service = (typeof FALLBACK_CATALOG)[number];

const bgGradients: Record<string, string> = {
  Development: "from-cyan-500/20 to-blue-500/20",
  Design: "from-indigo-500/20 to-purple-500/20",
  Automation: "from-pink-500/20 to-rose-500/20",
  Marketing: "from-rose-500/20 to-cyan-500/20",
  Support: "from-purple-500/20 to-pink-500/20",
};

const categoryColors: Record<string, string> = {
  Development: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Design: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Automation: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  Marketing: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  Support: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
};

const ALL_CATEGORIES = [...new Set(FALLBACK_CATALOG.map((s) => s.category))].sort();

const fadeUp = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.4, delay: i * 0.05, ease: [0.25, 0.4, 0.25, 1] as const },
  }),
};

export default function Catalog() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high" | "name">("newest");
  const [seeding, setSeeding] = useState(false);
  const [useLocal, setUseLocal] = useState(false);

  // Try Convex first
  const convexServices = useQuery(api.services.list, {
    category: selectedCategory ?? undefined,
    search: search || undefined,
  });
  const seedMutation = useMutation(api.services.seed);

  // Auto-seed if catalog is empty
  useEffect(() => {
    if (convexServices !== undefined && convexServices.length === 0 && !seeding) {
      console.log("[Catalog] No services found, seeding database...");
      setSeeding(true);
      seedMutation().then((result) => {
        console.log("[Catalog] Seed result:", result);
        setSeeding(false);
      }).catch((err) => {
        console.error("[Catalog] Seed failed:", err);
        setUseLocal(true);
        setSeeding(false);
      });
    }
    // If Convex returns undefined (loading) after 3 seconds, fall back to local
    if (convexServices === undefined) {
      const timer = setTimeout(() => setUseLocal(true), 3000);
      return () => clearTimeout(timer);
    } else {
      setUseLocal(false);
    }
  }, [convexServices, seedMutation, seeding]);

  // Use Convex data if available, otherwise fallback
  const rawServices: Service[] = useLocal
    ? FALLBACK_CATALOG
    : convexServices !== undefined
      ? convexServices.map((s) => ({
          ...s,
          _id: s._id,
          features: s.features ?? [],
        })) as unknown as Service[]
      : [];

  const filteredServices = useMemo(() => {
    let result = [...rawServices];

    if (!useLocal) {
      // Convex already filters by category/search
      result = result.filter((s) => {
        const matchPrice = s.price >= priceRange[0] && s.price <= priceRange[1];
        return matchPrice;
      });
    } else {
      result = result.filter((s) => {
        const matchCategory = !selectedCategory || s.category === selectedCategory;
        const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase());
        const matchPrice = s.price >= priceRange[0] && s.price <= priceRange[1];
        return matchCategory && matchSearch && matchPrice;
      });
    }

    switch (sortBy) {
      case "price-low": result.sort((a, b) => a.price - b.price); break;
      case "price-high": result.sort((a, b) => b.price - a.price); break;
      case "name": result.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: result.sort((a, b) => b.createdAt - a.createdAt);
    }
    return result;
  }, [rawServices, search, selectedCategory, sortBy, priceRange, useLocal]);

  const activeFilterCount = (selectedCategory ? 1 : 0) + (priceRange[1] < 50000 ? 1 : 0) + (sortBy !== "newest" ? 1 : 0);

  const isLoading = !useLocal && convexServices === undefined;

  return (
    <div className="noise-overlay min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <img src={logo} alt="Logo" className="h-9 w-9" />
            <span className="text-lg font-bold tracking-tight">Launch<span className="gradient-text">Pulse</span><span className="text-xs font-normal text-muted-foreground ml-0.5">.studio</span></span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link to="/catalog" className="text-sm font-medium text-foreground">Catalog</Link>
            <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Home</Link>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <Link to="/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Dashboard</Link>
            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-purple-500/20 transition-all hover:shadow-purple-500/40 hover:brightness-110">Get a Quote</a>
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
                <SheetClose asChild><Link to="/catalog" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground bg-card/40">Catalog</Link></SheetClose>
                <SheetClose asChild><Link to="/" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground">Home</Link></SheetClose>
                <SheetClose asChild><Link to="/dashboard" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground">Dashboard</Link></SheetClose>
                <SheetClose asChild><a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground">Get a Quote</a></SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 pt-28 pb-20">
        {/* Header */}
        <div className="mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
            <Sparkles className="h-3 w-3 text-cyan-400" />
            {isLoading ? "Loading services..." : `${filteredServices.length} services available`}
            {useLocal && <span className="ml-1 text-[10px] text-yellow-500/60">(local)</span>}
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Service Catalog
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-3 max-w-2xl text-muted-foreground">
            Browse available services, compare pricing, and get a quote. Every service is delivered with clear scope and fast turnaround.
          </motion.p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="mb-4 h-8 w-8 animate-spin text-cyan-400" />
            <p className="text-sm text-muted-foreground">Connecting to database...</p>
          </div>
        )}

        {/* Search + View Toggle */}
        {!isLoading && (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search services by name, category, or keyword..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-border/50 bg-card/40 py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none backdrop-blur-sm transition-all focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                    showFilters || activeFilterCount > 0
                      ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
                      : "border-border/50 bg-card/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-1 flex size-5 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-white">{activeFilterCount}</span>
                  )}
                </button>
                <div className="flex items-center rounded-xl border border-border/50 bg-card/40 p-0.5">
                  <button onClick={() => setViewMode("grid")} className={`rounded-lg p-2 transition-all ${viewMode === "grid" ? "bg-card/60 text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button onClick={() => setViewMode("list")} className={`rounded-lg p-2 transition-all ${viewMode === "list" ? "bg-card/60 text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Advanced Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="rounded-2xl border border-border/40 bg-card/30 p-5 backdrop-blur-sm">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                      <div className="flex-1">
                        <label className="mb-2 block text-xs font-medium text-muted-foreground">Category</label>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setSelectedCategory(null)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all border ${
                              !selectedCategory ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-foreground ring-1 ring-cyan-500/20 border-transparent" : "text-muted-foreground hover:text-foreground border-transparent"
                            }`}
                          >
                            All
                          </button>
                          {ALL_CATEGORIES.map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all border ${
                                cat === selectedCategory ? `${categoryColors[cat] ?? "bg-card/60 text-foreground"} ring-1 ring-current/20` : "text-muted-foreground hover:text-foreground border-transparent"
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="w-full sm:w-48">
                        <label className="mb-2 block text-xs font-medium text-muted-foreground">Max Price: ₹{priceRange[1].toLocaleString()}</label>
                        <input type="range" min={0} max={50000} step={500} value={priceRange[1]} onChange={(e) => setPriceRange([0, Number(e.target.value)])} className="w-full accent-cyan-500" />
                        <div className="mt-1 flex justify-between text-[10px] text-muted-foreground"><span>₹0</span><span>₹50,000</span></div>
                      </div>
                      <div className="w-full sm:w-40">
                        <label className="mb-2 block text-xs font-medium text-muted-foreground">Sort by</label>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="w-full rounded-lg border border-border/50 bg-card/60 px-3 py-2 text-xs text-foreground outline-none focus:border-cyan-500/50">
                          <option value="newest">Newest first</option>
                          <option value="price-low">Price: Low to High</option>
                          <option value="price-high">Price: High to Low</option>
                          <option value="name">Name A-Z</option>
                        </select>
                      </div>
                    </div>
                    {activeFilterCount > 0 && (
                      <div className="mt-4 flex items-center gap-2 border-t border-border/30 pt-4">
                        <button onClick={() => { setSelectedCategory(null); setPriceRange([0, 50000]); setSortBy("newest"); }} className="text-xs text-cyan-400 hover:text-cyan-300">Clear all filters</button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active Filter Chips */}
            {(selectedCategory || search || sortBy !== "newest") && (
              <div className="mb-6 flex flex-wrap gap-2">
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-card/40 px-3 py-1 text-xs text-muted-foreground">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory(null)} className="text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>
                  </span>
                )}
                {search && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-card/40 px-3 py-1 text-xs text-muted-foreground">
                    &ldquo;{search}&rdquo;
                    <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>
                  </span>
                )}
              </div>
            )}

            {/* Results */}
            {filteredServices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="mb-4 flex size-16 items-center justify-center rounded-2xl border border-border/40 bg-card/30">
                  <Search className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium">No services found</p>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  {search ? `No results for "${search}". Try a different keyword.` : "Try adjusting your filters or search terms."}
                </p>
                {(search || selectedCategory) && (
                  <button onClick={() => { setSearch(""); setSelectedCategory(null); setPriceRange([0, 50000]); }} className="mt-4 text-sm text-cyan-400 hover:text-cyan-300">Clear all filters</button>
                )}
                {!useLocal && (
                  <button
                    onClick={() => { setSeeding(true); seedMutation().finally(() => setSeeding(false)); }}
                    disabled={seeding}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-5 py-2.5 text-sm font-medium text-cyan-400 transition-all hover:bg-cyan-500/20 disabled:opacity-50"
                  >
                    {seeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    {seeding ? "Seeding..." : "Seed Database"}
                  </button>
                )}
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredServices.map((service, i) => (
                  <motion.div key={service._id} initial="hidden" animate="visible" variants={fadeUp} custom={i}>
                    <Link
                      to={`/service/${service.slug}`}
                      className="gradient-border group flex h-full flex-col rounded-2xl border border-border/40 bg-card/30 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-card/60 hover:shadow-xl hover:shadow-purple-500/[0.04] hover:border-border/60"
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <div className={`inline-flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${bgGradients[service.category] ?? "from-cyan-500/15 to-purple-500/15"}`}>
                          <Tag className="h-4 w-4 text-foreground/70" />
                        </div>
                        <span className={`rounded-md border px-2 py-0.5 text-[10px] font-medium ${categoryColors[service.category] ?? "bg-card/60 text-muted-foreground"}`}>
                          {service.category}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold transition-colors group-hover:text-foreground">{service.name}</h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">{service.description}</p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {service.features.slice(0, 3).map((f) => (
                          <span key={f} className="rounded-md bg-card/50 px-2 py-0.5 text-[10px] text-muted-foreground">{f}</span>
                        ))}
                        {service.features.length > 3 && (
                          <span className="rounded-md bg-card/50 px-2 py-0.5 text-[10px] text-muted-foreground">+{service.features.length - 3} more</span>
                        )}
                      </div>
                      <div className="mt-5 flex items-center justify-between border-t border-border/30 pt-4">
                        <div>
                          <span className="text-xl font-bold tracking-tight">₹{service.price.toLocaleString()}</span>
                          <span className="ml-1 text-xs text-muted-foreground">/ {service.priceUnit}</span>
                        </div>
                        <span className="flex items-center gap-1 text-xs font-medium text-cyan-400 opacity-0 transition-all duration-300 group-hover:opacity-100">
                          View details <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredServices.map((service, i) => (
                  <motion.div key={service._id} initial="hidden" animate="visible" variants={fadeUp} custom={i}>
                    <Link
                      to={`/service/${service.slug}`}
                      className="gradient-border group flex items-center gap-6 rounded-2xl border border-border/40 bg-card/30 p-5 backdrop-blur-sm transition-all duration-300 hover:bg-card/60 hover:shadow-lg hover:shadow-purple-500/[0.03] hover:border-border/60"
                    >
                      <div className={`hidden size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br sm:inline-flex ${bgGradients[service.category] ?? "from-cyan-500/15 to-purple-500/15"}`}>
                        <Tag className="h-5 w-5 text-foreground/70" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold truncate">{service.name}</h3>
                          <span className={`hidden rounded-md border px-2 py-0.5 text-[10px] font-medium sm:inline-block ${categoryColors[service.category] ?? "bg-card/60 text-muted-foreground"}`}>
                            {service.category}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{service.description}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="text-lg font-bold">₹{service.price.toLocaleString()}</div>
                        <div className="text-[10px] text-muted-foreground">{service.priceUnit}</div>
                      </div>
                      <ArrowRight className="hidden h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:text-cyan-400 group-hover:translate-x-1 sm:block" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {filteredServices.length > 0 && (
              <div className="mt-8 text-center text-xs text-muted-foreground">
                Showing {filteredServices.length} of {rawServices.length} services
                {useLocal && " (from local data — connect Convex for persistent storage)"}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
