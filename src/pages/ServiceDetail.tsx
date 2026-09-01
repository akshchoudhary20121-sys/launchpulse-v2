import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, Link } from "react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Calendar, Clock, Send, Loader2, MessageSquare } from "lucide-react";
import logo from "@/assets/logo.svg";
import { useAuth } from "@/hooks/use-auth";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const DISCORD_URL = "https://discord.gg/yourserver";

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const service = useQuery(api.services.getBySlug, slug ? { slug } : "skip");
  const messages = useQuery(api.messages.listByService, service ? { serviceId: service._id } : "skip");
  const sendMessage = useMutation(api.messages.send);
  const createBooking = useMutation(api.bookings.create);

  const { user } = useAuth();
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);

  // Booking form state
  const [bookDate, setBookDate] = useState("");
  const [bookTime, setBookTime] = useState("");
  const [bookNotes, setBookNotes] = useState("");
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !service || !user) return;
    setSending(true);
    await sendMessage({ userId: user._id, serviceId: service._id, content: messageText.trim() });
    setMessageText("");
    setSending(false);
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service || !user || !bookDate || !bookTime) return;
    setBookingLoading(true);
    await createBooking({
      userId: user._id,
      serviceId: service._id,
      serviceName: service.name,
      date: bookDate,
      time: bookTime,
      notes: bookNotes || undefined,
    });
    setBookingSubmitted(true);
    setBookingLoading(false);
  };

  const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

  if (service === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (service === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <p className="text-lg font-medium">Service not found</p>
          <Link to="/catalog" className="mt-3 inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300">
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
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <img src={logo} alt="Logo" className="h-9 w-9" />
            <span className="text-lg font-bold tracking-tight">Launch<span className="gradient-text">Pulse</span><span className="text-xs font-normal text-muted-foreground ml-0.5">.studio</span></span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link to="/catalog" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Catalog</Link>
            <Link to="/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Dashboard</Link>
          </div>
          <div className="hidden sm:block">
            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-purple-500/20 transition-all hover:shadow-purple-500/40 hover:brightness-110">Get a Quote <MessageSquare className="h-4 w-4" /></a>
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
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 pt-28 pb-20">
        {/* Breadcrumb */}
        <Link to="/catalog" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to catalog
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="mb-3 inline-block rounded-md bg-card/60 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{service.category}</span>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{service.name}</h1>
              <p className="mt-4 text-muted-foreground leading-relaxed">{service.longDescription}</p>
            </motion.div>

            {/* Features */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-10">
              <h2 className="mb-4 text-lg font-semibold">What&apos;s included</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {service.features.map((f) => (
                  <div key={f} className="flex items-center gap-3 rounded-xl border border-border/30 bg-card/20 px-4 py-3">
                    <Check className="h-4 w-4 shrink-0 text-cyan-400" />
                    <span className="text-sm text-muted-foreground">{f}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Comments / Messages */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-12">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <MessageSquare className="h-5 w-5 text-cyan-400" />
                Discussion
              </h2>

              <div className="space-y-4">
                {messages && messages.length === 0 && (
                  <p className="rounded-xl border border-border/30 bg-card/20 p-4 text-sm text-muted-foreground">No messages yet. Start the conversation below.</p>
                )}
                {messages?.map((msg) => (
                  <div key={msg._id} className="rounded-xl border border-border/30 bg-card/20 p-4">
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <p className="mt-2 text-[10px] text-muted-foreground">{new Date(msg.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              {user ? (
                <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Write a message..."
                    className="flex-1 rounded-xl border border-border/50 bg-card/40 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                  />
                  <button type="submit" disabled={sending || !messageText.trim()} className="inline-flex size-10 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white transition-all hover:brightness-110 disabled:opacity-50">
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300">Get a quote on Discord <MessageSquare className="h-3 w-3" /></a>
              )}
            </motion.div>
          </div>

          {/* Sidebar — Booking */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="sticky top-24 rounded-2xl border border-border/40 bg-card/30 p-6 backdrop-blur-sm">
              <div className="mb-6">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold tracking-tight">₹{service.price.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">/ {service.priceUnit}</span>
                </div>
              </div>

              {user ? (
                bookingSubmitted ? (
                  <div className="flex flex-col items-center py-8 text-center">
                    <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-cyan-500/10">
                      <Calendar className="h-5 w-5 text-cyan-400" />
                    </div>
                    <p className="text-sm font-semibold">Booking submitted!</p>
                    <p className="mt-1 text-xs text-muted-foreground">We&apos;ll confirm your session within the hour.</p>
                  </div>
                ) : (
                  <form onSubmit={handleBook} className="flex flex-col gap-4">
                    <div>
                      <label htmlFor="book-date" className="mb-1.5 block text-xs font-medium text-muted-foreground">Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          id="book-date"
                          type="date"
                          required
                          value={bookDate}
                          onChange={(e) => setBookDate(e.target.value)}
                          className="w-full rounded-xl border border-border/50 bg-card/60 py-2.5 pl-9 pr-4 text-sm text-foreground outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="book-time" className="mb-1.5 block text-xs font-medium text-muted-foreground">Time</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <select
                          id="book-time"
                          required
                          value={bookTime}
                          onChange={(e) => setBookTime(e.target.value)}
                          className="w-full rounded-xl border border-border/50 bg-card/60 py-2.5 pl-9 pr-4 text-sm text-foreground outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                        >
                          <option value="">Select a time</option>
                          {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="book-notes" className="mb-1.5 block text-xs font-medium text-muted-foreground">Notes (optional)</label>
                      <textarea
                        id="book-notes"
                        rows={3}
                        value={bookNotes}
                        onChange={(e) => setBookNotes(e.target.value)}
                        placeholder="Any details about your project..."
                        className="w-full rounded-xl border border-border/50 bg-card/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={bookingLoading || !bookDate || !bookTime}
                      className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition-all hover:shadow-purple-500/40 hover:brightness-110 disabled:opacity-50"
                    >
                      {bookingLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Calendar className="h-4 w-4" /> Book Session</>}
                    </button>
                  </form>
                )
              ) : (
                <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition-all hover:shadow-purple-500/40 hover:brightness-110">
                  Get a Quote on Discord <MessageSquare className="h-4 w-4" />
                </a>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
