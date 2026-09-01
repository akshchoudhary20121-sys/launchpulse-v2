import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, LogOut, Calendar, MessageSquare, Settings,
  Clock, CheckCircle, XCircle, Package, ArrowRight, Loader2,
} from "lucide-react";
import logo from "@/assets/logo.svg";
import { Link } from "react-router";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const DISCORD_URL = "https://discord.gg/2srHufQ8pj";

type Tab = "overview" | "bookings" | "messages" | "settings";

const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "settings", label: "Settings", icon: Settings },
];

const statusColors: Record<string, string> = {
  pending: "text-yellow-400 bg-yellow-400/10",
  confirmed: "text-cyan-400 bg-cyan-400/10",
  completed: "text-green-400 bg-green-400/10",
  cancelled: "text-red-400 bg-red-400/10",
};

const statusIcons: Record<string, typeof Clock> = {
  pending: Clock,
  confirmed: CheckCircle,
  completed: CheckCircle,
  cancelled: XCircle,
};

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [useLocal, setUseLocal] = useState(false);

  // Convex queries
  const bookings = useQuery(api.bookings.listByUser, user ? { userId: user._id } : "skip");
  const messages = useQuery(api.messages.listByUser, user ? { userId: user._id } : "skip");
  const cancelBooking = useMutation(api.bookings.cancel);

  // Fallback to local after timeout
  useEffect(() => {
    if (bookings === undefined && user) {
      const timer = setTimeout(() => setUseLocal(true), 3000);
      return () => clearTimeout(timer);
    } else if (bookings !== undefined) {
      setUseLocal(false);
    }
  }, [bookings, user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelBooking({ id: id as never });
    } catch (err) {
      console.error("Cancel failed:", err);
    }
  };

  const safeBookings = bookings ?? [];
  const safeMessages = messages ?? [];
  const pendingBookings = safeBookings.filter((b) => b.status === "pending");
  const confirmedBookings = safeBookings.filter((b) => b.status === "confirmed");
  const completedBookings = safeBookings.filter((b) => b.status === "completed");

  const isLoading = !useLocal && bookings === undefined && !!user;

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
            <Link to="/catalog" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Catalog</Link>
            <Link to="/dashboard" className="text-sm font-medium text-foreground">Dashboard</Link>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-purple-500/20 transition-all hover:shadow-purple-500/40 hover:brightness-110">
              Get a Quote
            </a>
            <button onClick={handleSignOut} className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/30 px-4 py-2 text-sm text-muted-foreground transition-all hover:text-foreground hover:bg-card/50">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
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
                <SheetClose asChild><Link to="/catalog" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground">Catalog</Link></SheetClose>
                <SheetClose asChild><Link to="/dashboard" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground bg-card/40">Dashboard</Link></SheetClose>
                <SheetClose asChild>
                  <button onClick={handleSignOut} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground text-left">
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 pt-28 pb-20">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-cyan-400">
              Dashboard {!useLocal && <span className="text-green-500/60">● Connected to database</span>}
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">Welcome back{user?.name ? `, ${user.name}` : ""}</h1>
          </div>
          <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-purple-500/20 transition-all hover:shadow-purple-500/40 hover:brightness-110">
            Get a Quote <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-1 rounded-xl border border-border/40 bg-card/20 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-card/60 text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="mb-4 h-8 w-8 animate-spin text-cyan-400" />
            <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
          </div>
        )}

        {/* Tab content */}
        {!isLoading && (
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Stats */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-border/40 bg-card/30 p-5">
                      <p className="text-xs text-muted-foreground">Pending Bookings</p>
                      <p className="mt-1 text-2xl font-bold gradient-text">{pendingBookings.length}</p>
                    </div>
                    <div className="rounded-2xl border border-border/40 bg-card/30 p-5">
                      <p className="text-xs text-muted-foreground">Confirmed</p>
                      <p className="mt-1 text-2xl font-bold gradient-text">{confirmedBookings.length}</p>
                    </div>
                    <div className="rounded-2xl border border-border/40 bg-card/30 p-5">
                      <p className="text-xs text-muted-foreground">Completed</p>
                      <p className="mt-1 text-2xl font-bold gradient-text">{completedBookings.length}</p>
                    </div>
                    <div className="rounded-2xl border border-border/40 bg-card/30 p-5">
                      <p className="text-xs text-muted-foreground">Messages</p>
                      <p className="mt-1 text-2xl font-bold gradient-text">{safeMessages.length}</p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Link to="/catalog" className="gradient-border group flex items-center gap-4 rounded-2xl border border-border/40 bg-card/30 p-5 backdrop-blur-sm transition-all hover:bg-card/50">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                        <Package className="h-5 w-5 text-cyan-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">Browse Catalog</p>
                        <p className="text-xs text-muted-foreground">Explore all available services</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:text-cyan-400 group-hover:translate-x-1" />
                    </Link>
                    <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="gradient-border group flex items-center gap-4 rounded-2xl border border-border/40 bg-card/30 p-5 backdrop-blur-sm transition-all hover:bg-card/50">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                        <MessageSquare className="h-5 w-5 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">Get a Quote</p>
                        <p className="text-xs text-muted-foreground">Chat with us on Discord</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:text-purple-400 group-hover:translate-x-1" />
                    </a>
                  </div>

                  {/* Recent Bookings */}
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-lg font-semibold">Recent Bookings</h2>
                      {safeBookings.length > 0 && (
                        <button onClick={() => setActiveTab("bookings")} className="text-xs text-cyan-400 hover:text-cyan-300">View all →</button>
                      )}
                    </div>
                    {safeBookings.length === 0 ? (
                      <div className="rounded-2xl border border-border/40 bg-card/30 p-8 text-center">
                        <Package className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                        <p className="text-sm font-medium">No bookings yet</p>
                        <p className="mt-1 text-xs text-muted-foreground">Browse the catalog to book your first session.</p>
                        <Link to="/catalog" className="mt-4 inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300">
                          Browse Catalog <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {safeBookings.slice(0, 5).map((b) => {
                          const StatusIcon = statusIcons[b.status] ?? Clock;
                          return (
                            <div key={b._id} className="flex items-center gap-4 rounded-2xl border border-border/40 bg-card/30 p-4 transition-all hover:bg-card/40">
                              <div className={`flex size-9 items-center justify-center rounded-lg ${statusColors[b.status]}`}>
                                <StatusIcon className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{b.serviceName}</p>
                                <p className="text-xs text-muted-foreground">{b.date} at {b.time}</p>
                              </div>
                              <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium uppercase ${statusColors[b.status]}`}>{b.status}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "bookings" && (
                <div>
                  <h2 className="mb-4 text-lg font-semibold">Your Bookings</h2>
                  {safeBookings.length === 0 ? (
                    <div className="rounded-2xl border border-border/40 bg-card/30 p-12 text-center">
                      <Calendar className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                      <p className="text-sm font-medium">No bookings yet</p>
                      <p className="mt-1 text-xs text-muted-foreground">Pick a service from the catalog and schedule a session.</p>
                      <Link to="/catalog" className="mt-4 inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300">Browse Catalog <ArrowRight className="h-3 w-3" /></Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {safeBookings.map((b) => {
                        const StatusIcon = statusIcons[b.status] ?? Clock;
                        return (
                          <div key={b._id} className="flex items-center gap-4 rounded-2xl border border-border/40 bg-card/30 p-5 transition-all hover:bg-card/40">
                            <div className={`flex size-10 items-center justify-center rounded-xl ${statusColors[b.status]}`}>
                              <StatusIcon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium">{b.serviceName}</p>
                              <p className="text-sm text-muted-foreground">{b.date} at {b.time}</p>
                              {b.notes && <p className="mt-1 text-xs text-muted-foreground truncate">{b.notes}</p>}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`rounded-md px-2.5 py-1 text-[10px] font-medium uppercase ${statusColors[b.status]}`}>{b.status}</span>
                              {b.status === "pending" && (
                                <button onClick={() => handleCancel(b._id)} className="text-xs text-red-400 hover:text-red-300">Cancel</button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "messages" && (
                <div>
                  <h2 className="mb-4 text-lg font-semibold">Your Messages</h2>
                  {safeMessages.length === 0 ? (
                    <div className="rounded-2xl border border-border/40 bg-card/30 p-12 text-center">
                      <MessageSquare className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                      <p className="text-sm font-medium">No messages yet</p>
                      <p className="mt-1 text-xs text-muted-foreground">Start a discussion on any service page.</p>
                      <Link to="/catalog" className="mt-4 inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300">Browse Catalog <ArrowRight className="h-3 w-3" /></Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {safeMessages.map((m) => (
                        <div key={m._id} className="rounded-2xl border border-border/40 bg-card/30 p-5 transition-all hover:bg-card/40">
                          <div className="flex items-start gap-3">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 text-xs font-bold text-foreground/70">Y</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">You</span>
                                <span className="text-[10px] text-muted-foreground">{new Date(m.createdAt).toLocaleString()}</span>
                              </div>
                              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{m.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "settings" && (
                <div>
                  <h2 className="mb-4 text-lg font-semibold">Account Settings</h2>
                  <div className="rounded-2xl border border-border/40 bg-card/30 p-6 space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Name</label>
                      <p className="text-sm">{user?.name || "Not set"}</p>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</label>
                      <p className="text-sm">{user?.email || "Not set"}</p>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Account Type</label>
                      <p className="text-sm capitalize">{user?.isAnonymous ? "Guest" : "Registered"}</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button onClick={handleSignOut} className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20">
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
