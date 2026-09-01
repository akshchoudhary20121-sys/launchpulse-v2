import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight, Filter, Loader2 } from "lucide-react";
import logo from "@/assets/logo.svg";
import { Link } from "react-router";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06 },
  }),
};

const bgGradients: Record<string, string> = {
  Development: "from-cyan-500/15 to-blue-500/15",
  Design: "from-indigo-500/15 to-purple-500/15",
  Automation: "from-pink-500/15 to-rose-500/15",
  Marketing: "from-rose-500/15 to-cyan-500/15",
  Support: "from-purple-500/15 to-pink-500/15",
};

export default function Catalog() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categories = useQuery(api.services.categories);
  const services = useQuery(api.services.list, {
    category: selectedCategory ?? undefined,
    search: search || undefined,
  });

  return (
    <div className="noise-overlay min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <img src={logo} alt="Logo" className="h-9 w-9" />
            <span className="text-lg font-bold tracking-tight">Launch<span className="gradient-text">Pulse</span><span className="text-xs font-normal text-muted-foreground ml-0.5">.studio</span></span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link to="/catalog" className="text-sm font-medium text-foreground">Catalog</Link>
            <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Home</Link>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <Link to="/auth" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Sign in</Link>
            <Link to="/auth" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-purple-500/20 transition-all hover:shadow-purple-500/40 hover:brightness-110">Dashboard <ArrowRight className="h-4 w-4" /></Link>
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
                <SheetClose asChild><Link to="/auth" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground">Sign in</Link></SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 pt-28 pb-20">
        {/* Header */}
        <div className="mb-10">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold tracking-tight sm:text-4xl">Service Catalog</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-2 text-muted-foreground">Browse available services, check pricing, and book a session.</motion.p>
        </div>

        {/* Search + Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border/50 bg-card/40 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none backdrop-blur-sm transition-colors focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${!selectedCategory ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              All
            </button>
            {categories?.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${cat === selectedCategory ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results */}
        {services === undefined ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : services.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-medium">No services found</p>
            <p className="mt-1 text-sm text-muted-foreground">Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <motion.div key={service._id} initial="hidden" animate="visible" variants={fadeUp} custom={i}>
                <Link
                  to={`/service/${service.slug}`}
                  className="gradient-border group flex h-full flex-col rounded-2xl border border-border/40 bg-card/30 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-card/60 hover:shadow-xl hover:shadow-purple-500/[0.04]"
                >
                  <div className={`mb-4 inline-flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${bgGradients[service.category] ?? "from-cyan-500/15 to-purple-500/15"}`}>
                    <span className="text-xs font-bold text-foreground/70">{service.category.slice(0, 2).toUpperCase()}</span>
                  </div>
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="text-base font-semibold">{service.name}</h3>
                  </div>
                  <span className="mb-3 inline-block w-fit rounded-md bg-card/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{service.category}</span>
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">{service.description}</p>
                  <div className="flex items-center justify-between border-t border-border/30 pt-4">
                    <div>
                      <span className="text-lg font-bold">₹{service.price.toLocaleString()}</span>
                      <span className="ml-1 text-xs text-muted-foreground">/ {service.priceUnit}</span>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-medium text-cyan-400 opacity-0 transition-all duration-300 group-hover:opacity-100">
                      View <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
