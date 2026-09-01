import { useParams, Link } from "react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Calendar, Clock, Send, MessageSquare, Star, Shield, Zap, Users, ArrowRight, Mail } from "lucide-react";
import logo from "@/assets/logo.svg";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { getServiceBySlug, getMessages, sendMessage, createBooking } from "@/lib/store";
import { useAuth } from "@/hooks/use-auth";

const DISCORD_URL = "https://discord.gg/2srHufQ8pj";

const categoryColors: Record<string, string> = {
  Development: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Design: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Automation: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  Marketing: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  Support: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
};

const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();

  const service = slug ? getServiceBySlug(slug) : undefined;
  const discussionMessages = slug ? getMessages(slug) : [];

  const [bookDate, setBookDate] = useState("");
  const [bookTime, setBookTime] = useState("");
  const [bookNotes, setBookNotes] = useState("");
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [, setMessages] = useState(discussionMessages);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState("");
  const [pendingAction, setPendingAction] = useState<"book" | "message" | null>(null);

  // Use email as userId for consistency across all pages
  const getUserId = () => user?.email || "anonymous-" + Date.now();

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const ensureEmail = (action: "book" | "message"): boolean => {
    if (!user?.email) {
      setPendingAction(action);
      setShowEmailPrompt(true);
      return false;
    }
    return true;
  };

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;
    if (!ensureEmail("book")) return;

    createBooking({
      userId: getUserId(),
      userEmail: user!.email!,
      userName: user!.name || user!.email!.split("@")[0],
      serviceId: service.slug,
      serviceName: service.name,
      date: bookDate,
      time: bookTime,
      status: "pending",
      notes: bookNotes || undefined,
    });

    setBookingSubmitted(true);
  };

  const handleEmailSubmit = () => {
    if (!isValidEmail(emailInput)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    // Save email to user
    const currentUser = JSON.parse(localStorage.getItem("launchpulse_user") || "{}");
    currentUser.email = emailInput;
    localStorage.setItem("launchpulse_user", JSON.stringify(currentUser));
    // Force page reload to pick up new email
    window.location.reload();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !slug) return;
    if (!ensureEmail("message")) return;

    sendMessage({
      userId: getUserId(),
      userEmail: user!.email!,
      userName: user!.name || user!.email!.split("@")[0],
      serviceId: slug,
      content: messageText.trim(),
    });

    setMessageText("");
    setMessages(getMessages(slug));
  };

  if (!service) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <div className="mb-4 flex size-16 items-center justify-center mx-auto rounded-2xl border border-border/40 bg-card/30">
            <span className="text-2xl">🔍</span>
          </div>
          <p className="text-lg font-medium">Service not found</p>
          <p className="mt-1 text-sm text-muted-foreground">This service may have been removed or the link is incorrect.</p>
          <Link to="/catalog" className="mt-4 inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300">
            <ArrowLeft className="h-4 w-4" /> Back to catalog
          </Link>
        </div>
      </div>
    );
  }

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
            <Link to="/catalog" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Catalog</Link>
            <Link to="/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Dashboard</Link>
          </div>
          <div className="hidden sm:block">
            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-purple-500/20 transition-all hover:shadow-purple-500/40 hover:brightness-110">
              Get a Quote <MessageSquare className="h-3.5 w-3.5" />
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
                <SheetClose asChild><Link to="/catalog" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground">Catalog</Link></SheetClose>
                <SheetClose asChild><Link to="/dashboard" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground">Dashboard</Link></SheetClose>
                <SheetClose asChild><a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground">Get a Quote</a></SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 pt-28 pb-20">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <Link to="/catalog" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to catalog
          </Link>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center gap-3 mb-4">
                <span className={`rounded-lg border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${categoryColors[service.category] ?? "bg-card/60 text-muted-foreground"}`}>
                  {service.category}
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, j) => <Star key={j} className="h-3 w-3 fill-yellow-500/60 text-yellow-500/60" />)}
                  <span className="ml-1 text-[10px] text-muted-foreground">5.0</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{service.name}</h1>
              <p className="mt-5 text-muted-foreground leading-relaxed text-lg">{service.longDescription}</p>
              
              {/* Demo notice */}
              <div className="mt-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
                <p className="text-xs text-yellow-400">
                  <strong>Demo/Consultation:</strong> This booking is for a free consultation where we&apos;ll explain all features, show demos, and discuss how this service can help your project. No payment required for the consultation.
                </p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-3 gap-4">
              {[
                { icon: Zap, label: "Fast Delivery", value: "24-48h" },
                { icon: Shield, label: "Revisions", value: "Included" },
                { icon: Users, label: "Support", value: "Post-launch" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-border/30 bg-card/20 p-4 text-center">
                  <stat.icon className="mx-auto mb-2 h-4 w-4 text-cyan-400" />
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="mt-0.5 text-sm font-semibold">{stat.value}</p>
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <h2 className="mb-5 text-lg font-semibold">What&apos;s included</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {service.features.map((f: string, idx: number) => (
                  <motion.div key={f} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + idx * 0.05 }}
                    className="flex items-center gap-3 rounded-xl border border-border/30 bg-card/20 px-4 py-3.5 transition-all hover:bg-card/40">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10">
                      <Check className="h-3.5 w-3.5 text-cyan-400" />
                    </div>
                    <span className="text-sm text-muted-foreground">{f}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Discussion */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold">
                <MessageSquare className="h-5 w-5 text-cyan-400" />
                Discussion
                {discussionMessages.length > 0 && <span className="ml-2 rounded-full bg-card/60 px-2 py-0.5 text-[10px] text-muted-foreground">{discussionMessages.length}</span>}
              </h2>
              <div className="space-y-3">
                {discussionMessages.length === 0 && (
                  <div className="rounded-2xl border border-border/30 bg-card/20 p-6 text-center">
                    <MessageSquare className="mx-auto mb-2 h-6 w-6 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">No messages yet. Start the conversation below.</p>
                  </div>
                )}
                {discussionMessages.map((msg) => (
                  <div key={msg._id} className="rounded-2xl border border-border/30 bg-card/20 p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 text-xs font-bold text-foreground/70">
                        {msg.userName?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{msg.userName || "You"}</span>
                          <span className="text-[10px] text-muted-foreground">{new Date(msg.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
                <input type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder={user?.email ? "Write a message..." : "Enter email first to send messages..."}
                  className="flex-1 rounded-xl border border-border/50 bg-card/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none backdrop-blur-sm transition-all focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20" />
                <button type="submit" disabled={!messageText.trim()} className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white transition-all hover:brightness-110 disabled:opacity-50">
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="sticky top-24 rounded-2xl border border-border/40 bg-card/30 p-6 backdrop-blur-sm space-y-6">
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-bold tracking-tight">₹{service.price.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">/ {service.priceUnit}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Custom scope available — discuss on Discord</p>
              </div>

              {bookingSubmitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-8 text-center">
                  <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-cyan-500/10">
                    <Calendar className="h-6 w-6 text-cyan-400" />
                  </div>
                  <p className="text-sm font-semibold">Booking submitted!</p>
                  <p className="mt-1 text-xs text-muted-foreground">We&apos;ll confirm your consultation within the hour.</p>
                  <Link to="/dashboard" className="mt-4 text-xs text-cyan-400 hover:text-cyan-300">View in dashboard →</Link>
                </motion.div>
              ) : (
                <form onSubmit={handleBook} className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="book-date" className="mb-1.5 block text-xs font-medium text-muted-foreground">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input id="book-date" type="date" required value={bookDate} onChange={(e) => setBookDate(e.target.value)}
                        className="w-full rounded-xl border border-border/50 bg-card/60 py-2.5 pl-9 pr-4 text-sm text-foreground outline-none transition-all focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="book-time" className="mb-1.5 block text-xs font-medium text-muted-foreground">Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <select id="book-time" required value={bookTime} onChange={(e) => setBookTime(e.target.value)}
                        className="w-full rounded-xl border border-border/50 bg-card/60 py-2.5 pl-9 pr-4 text-sm text-foreground outline-none transition-all focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20">
                        <option value="">Select a time</option>
                        {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="book-notes" className="mb-1.5 block text-xs font-medium text-muted-foreground">Project details (optional)</label>
                    <textarea id="book-notes" rows={3} value={bookNotes} onChange={(e) => setBookNotes(e.target.value)}
                      placeholder="Describe your project, goals, and any specific requirements..."
                      className="w-full rounded-xl border border-border/50 bg-card/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20" />
                  </div>
                  <button type="submit" disabled={!bookDate || !bookTime}
                    className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition-all hover:shadow-purple-500/40 hover:brightness-110 disabled:opacity-50">
                    <Calendar className="h-4 w-4" /> Book Free Consultation
                  </button>
                  {!user?.email && (
                    <p className="text-[10px] text-muted-foreground text-center">Email required for booking</p>
                  )}
                </form>
              )}

              <div className="space-y-3 border-t border-border/30 pt-5">
                <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-2 rounded-xl border border-border/50 bg-card/20 py-3 text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-card/40">
                  Get a Quote on Discord <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              <div className="space-y-3 border-t border-border/30 pt-5">
                {[
                  { icon: Zap, text: "24-48 hour turnaround" },
                  { icon: Shield, text: "Revisions included" },
                  { icon: MessageSquare, text: "Discord support" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <item.icon className="h-4 w-4 shrink-0 text-cyan-400" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Email Prompt Modal */}
      {showEmailPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-4 w-full max-w-md rounded-2xl border border-border/40 bg-background p-6 shadow-2xl"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-500/10">
                <Mail className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-semibold">Email Required</h3>
                <p className="text-xs text-muted-foreground">Enter your email to {pendingAction === "book" ? "book a session" : "send a message"}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Email Address</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => { setEmailInput(e.target.value); setEmailError(""); }}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-border/50 bg-card/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                  autoFocus
                />
                {emailError && <p className="mt-1 text-xs text-red-500">{emailError}</p>}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setShowEmailPrompt(false); setEmailError(""); setPendingAction(null); }}
                  className="flex-1 rounded-xl border border-border/50 bg-card/30 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-card/50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleEmailSubmit}
                  className="flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
                >
                  Continue
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
