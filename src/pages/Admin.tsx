import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router";
import {
  LayoutDashboard, Calendar, MessageSquare, Activity as ActivityIcon,
  CheckCircle, XCircle, Clock, Send, LogOut, IndianRupee, Users,
  TrendingUp, RefreshCw, Eye, Zap, Star, ArrowUpRight,
} from "lucide-react";
import logo from "@/assets/logo.svg";
import { useAuth } from "@/hooks/use-auth";
import {
  getAllBookings,
  getAllMessages,
  updateBookingStatus,
  sendMessage,
  getActivityFeed,
  isAdminEmail,
  setAdmin,
  getServices,
  onStorageChange,
  ADMIN_EMAIL,
  type Booking,
  type Message,
  type Activity as ActivityFeedItem,
} from "@/lib/store";

type Tab = "overview" | "bookings" | "messages" | "activity" | "customers";

const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "customers", label: "Customers", icon: Users },
  { id: "activity", label: "Activity", icon: ActivityIcon },
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

export default function Admin() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activities, setActivities] = useState<ActivityFeedItem[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState("");
  const [threadMessages, setThreadMessages] = useState<Message[]>([]);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const threadEndRef = useRef<HTMLDivElement>(null);

  const isUserAdmin = user?.email ? isAdminEmail(user.email) : false;

  const refreshData = useCallback(() => {
    setBookings(getAllBookings());
    setMessages(getAllMessages());
    setActivities(getActivityFeed());
    setLastRefresh(new Date());
  }, []);

  // Auto-refresh every 2 seconds + listen for storage changes
  useEffect(() => {
    if (!isUserAdmin) return;
    refreshData();
    const interval = setInterval(refreshData, 2000);
    const unsubBookings = onStorageChange("launchpulse_bookings", refreshData);
    const unsubMessages = onStorageChange("launchpulse_messages", refreshData);
    const unsubReplies = onStorageChange("launchpulse_replies", refreshData);
    return () => {
      clearInterval(interval);
      unsubBookings();
      unsubMessages();
      unsubReplies();
    };
  }, [isUserAdmin, refreshData]);

  // Load thread messages when a message is selected
  useEffect(() => {
    if (!selectedMessage) {
      setThreadMessages([]);
      return;
    }
    // Get ALL messages for this service+user combo (thread)
    const allMsgs = getAllMessages();
    const thread = allMsgs.filter(
      (m) =>
        m.serviceId === selectedMessage.serviceId &&
        m.userEmail === selectedMessage.userEmail
    );
    setThreadMessages(thread);
    // Auto-scroll to bottom
    setTimeout(() => {
      threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [selectedMessage, messages]);

  // Redirect if not admin
  useEffect(() => {
    if (!isUserAdmin && user) {
      navigate("/dashboard");
    }
  }, [isUserAdmin, user, navigate]);

  // Set admin flag
  useEffect(() => {
    if (isUserAdmin) {
      setAdmin(true);
      refreshData();
    }
  }, [isUserAdmin, refreshData]);

  const handleLogout = async () => {
    setAdmin(false);
    await signOut();
    navigate("/");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleStatusChange = (bookingId: string, newStatus: Booking["status"]) => {
    updateBookingStatus(bookingId, newStatus);
    refreshData();
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedMessage) return;

    // Send as a regular message so customer sees it everywhere
    sendMessage({
      userId: selectedMessage.userEmail,
      userEmail: ADMIN_EMAIL,
      userName: "LaunchPulse Admin",
      serviceId: selectedMessage.serviceId,
      content: replyText.trim(),
    });

    setReplyText("");
    refreshData();
  };

  // Calculate stats
  const totalRevenue = bookings
    .filter((b) => b.status === "completed" || b.status === "confirmed")
    .reduce((sum, b) => {
      const service = getServices().find((s) => s.slug === b.serviceId);
      return sum + (service?.price || 0);
    }, 0);

  const uniqueCustomers = new Set(bookings.map((b) => b.userEmail)).size;
  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
  const completedBookings = bookings.filter((b) => b.status === "completed");

  // Group messages into conversations (unique user+service combos)
  const conversations = messages.reduce((acc, msg) => {
    const key = `${msg.userEmail}::${msg.serviceId}`;
    if (!acc[key]) {
      acc[key] = {
        userEmail: msg.userEmail,
        userName: msg.userName,
        serviceId: msg.serviceId,
        latestMessage: msg,
        count: 0,
      };
    }
    acc[key].count++;
    if (msg.createdAt > acc[key].latestMessage.createdAt) {
      acc[key].latestMessage = msg;
    }
    return acc;
  }, {} as Record<string, { userEmail: string; userName: string; serviceId: string; latestMessage: Message; count: number }>);

  const conversationList = Object.values(conversations).sort(
    (a, b) => b.latestMessage.createdAt - a.latestMessage.createdAt
  );

  if (!isUserAdmin) {
    return (
      <div className="noise-overlay min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="noise-overlay min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-8 w-8" />
            <span className="text-lg font-bold tracking-tight">Admin</span>
            <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-[10px] font-medium text-purple-400">Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="size-2 rounded-full bg-green-500 animate-pulse" />
              Live
            </div>
            <button onClick={handleRefresh} className={`inline-flex items-center gap-2 rounded-lg border border-border/50 bg-card/30 px-3 py-1.5 text-xs text-muted-foreground transition-all hover:text-foreground hover:bg-card/50 ${isRefreshing ? "animate-spin" : ""}`}>
              <RefreshCw className="h-3 w-3" /> Refresh
            </button>
            <Link to="/catalog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              View Site
            </Link>
            <span className="text-xs text-muted-foreground">{user?.email}</span>
            <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/30 px-4 py-2 text-sm text-muted-foreground transition-all hover:text-foreground hover:bg-card/50">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 pt-28 pb-20">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage bookings, messages, and customer activity • Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/catalog" className="inline-flex items-center gap-2 rounded-xl border border-border/50 bg-card/30 px-4 py-2 text-sm text-muted-foreground transition-all hover:text-foreground hover:bg-card/50">
              <Eye className="h-4 w-4" /> View Site
            </Link>
            <Link to="/" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-2 text-sm font-medium text-white transition-all hover:brightness-110">
              <Zap className="h-4 w-4" /> Quick Actions
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border border-border/40 bg-card/30 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Total Revenue</p>
              <IndianRupee className="h-4 w-4 text-green-400" />
            </div>
            <p className="mt-1 text-2xl font-bold text-green-400">₹{totalRevenue.toLocaleString()}</p>
            <p className="mt-1 text-[10px] text-muted-foreground">From {completedBookings.length + confirmedBookings.length} orders</p>
          </div>
          <div className="rounded-2xl border border-border/40 bg-card/30 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Total Bookings</p>
              <Calendar className="h-4 w-4 text-cyan-400" />
            </div>
            <p className="mt-1 text-2xl font-bold gradient-text">{bookings.length}</p>
            <p className="mt-1 text-[10px] text-muted-foreground">{pendingBookings.length} pending</p>
          </div>
          <div className="rounded-2xl border border-border/40 bg-card/30 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Customers</p>
              <Users className="h-4 w-4 text-purple-400" />
            </div>
            <p className="mt-1 text-2xl font-bold gradient-text">{uniqueCustomers}</p>
            <p className="mt-1 text-[10px] text-muted-foreground">Unique emails</p>
          </div>
          <div className="rounded-2xl border border-border/40 bg-card/30 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Messages</p>
              <MessageSquare className="h-4 w-4 text-pink-400" />
            </div>
            <p className="mt-1 text-2xl font-bold gradient-text">{messages.length}</p>
            <p className="mt-1 text-[10px] text-muted-foreground">Active conversations</p>
          </div>
          <div className="rounded-2xl border border-border/40 bg-card/30 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Conversion</p>
              <TrendingUp className="h-4 w-4 text-yellow-400" />
            </div>
            <p className="mt-1 text-2xl font-bold text-yellow-400">
              {bookings.length > 0 ? Math.round((completedBookings.length / bookings.length) * 100) : 0}%
            </p>
            <p className="mt-1 text-[10px] text-muted-foreground">Completion rate</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-1 rounded-xl border border-border/40 bg-card/20 p-1">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                activeTab === tab.id ? "bg-card/60 text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}>
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.id === "bookings" && bookings.length > 0 && (
                <span className="ml-1 rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-medium text-cyan-400">{bookings.length}</span>
              )}
              {tab.id === "messages" && conversationList.length > 0 && (
                <span className="ml-1 rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-medium text-purple-400">{conversationList.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>

            {/* Overview */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <Link to="/catalog" className="gradient-border group flex items-center gap-4 rounded-2xl border border-border/40 bg-card/30 p-5 backdrop-blur-sm transition-all hover:bg-card/50">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                      <Eye className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">View Catalog</p>
                      <p className="text-xs text-muted-foreground">See what customers see</p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all group-hover:text-cyan-400" />
                  </Link>
                  <div className="rounded-2xl border border-border/40 bg-card/30 p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-yellow-500/10">
                        <Clock className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div>
                        <p className="font-semibold">Pending Actions</p>
                        <p className="text-xs text-muted-foreground">{pendingBookings.length} bookings need attention</p>
                      </div>
                    </div>
                    {pendingBookings.length > 0 && (
                      <button onClick={() => setActiveTab("bookings")} className="w-full rounded-lg bg-yellow-500/10 px-3 py-2 text-xs font-medium text-yellow-400 transition-all hover:bg-yellow-500/20">
                        Review Now →
                      </button>
                    )}
                  </div>
                  <div className="rounded-2xl border border-border/40 bg-card/30 p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-purple-500/10">
                        <MessageSquare className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="font-semibold">Unread Messages</p>
                        <p className="text-xs text-muted-foreground">{conversationList.length} conversations</p>
                      </div>
                    </div>
                    {conversationList.length > 0 && (
                      <button onClick={() => setActiveTab("messages")} className="w-full rounded-lg bg-purple-500/10 px-3 py-2 text-xs font-medium text-purple-400 transition-all hover:bg-purple-500/20">
                        View Messages →
                      </button>
                    )}
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Recent Activity</h2>
                    <button onClick={() => setActiveTab("activity")} className="text-xs text-cyan-400 hover:text-cyan-300">View all →</button>
                  </div>
                  {activities.length === 0 ? (
                    <div className="rounded-2xl border border-border/40 bg-card/30 p-8 text-center">
                      <ActivityIcon className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                      <p className="text-sm font-medium">No activity yet</p>
                      <p className="mt-1 text-xs text-muted-foreground">Activity will appear here when customers book or message.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activities.slice(0, 5).map((activity) => (
                        <div key={activity.id} className="flex items-center gap-4 rounded-2xl border border-border/40 bg-card/30 p-4 transition-all hover:bg-card/40">
                          <div className={`flex size-10 items-center justify-center rounded-xl ${
                            activity.type === "booking" ? "bg-cyan-500/10" :
                            activity.type === "message" ? "bg-purple-500/10" : "bg-green-500/10"
                          }`}>
                            {activity.type === "booking" ? <Calendar className="h-5 w-5 text-cyan-400" /> :
                             activity.type === "message" ? <MessageSquare className="h-5 w-5 text-purple-400" /> :
                             <Send className="h-5 w-5 text-green-400" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{activity.description}</p>
                            <p className="text-xs text-muted-foreground">{activity.userEmail} • {new Date(activity.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Top Services */}
                <div>
                  <h2 className="mb-4 text-lg font-semibold">Top Services</h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {getServices().slice(0, 4).map((service) => {
                      const serviceBookings = bookings.filter((b) => b.serviceId === service.slug);
                      return (
                        <div key={service._id} className="rounded-2xl border border-border/40 bg-card/30 p-4 transition-all hover:bg-card/40">
                          <div className="flex items-center gap-3 mb-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <p className="text-sm font-medium truncate">{service.name}</p>
                          </div>
                          <p className="text-2xl font-bold gradient-text">{serviceBookings.length}</p>
                          <p className="text-[10px] text-muted-foreground">bookings</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Bookings */}
            {activeTab === "bookings" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">All Bookings</h2>
                  <span className="text-xs text-muted-foreground">
                    {pendingBookings.length} pending • {confirmedBookings.length} confirmed • {completedBookings.length} completed
                  </span>
                </div>
                {bookings.length === 0 ? (
                  <div className="rounded-2xl border border-border/40 bg-card/30 p-12 text-center">
                    <Calendar className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">No bookings yet</p>
                    <p className="mt-1 text-xs text-muted-foreground">Bookings will appear here when customers book services.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookings.map((booking) => {
                      const StatusIcon = statusIcons[booking.status] ?? Clock;
                      const service = getServices().find((s) => s.slug === booking.serviceId);
                      return (
                        <div key={booking._id} className="rounded-2xl border border-border/40 bg-card/30 p-5 transition-all hover:bg-card/40">
                          <div className="flex items-start gap-4">
                            <div className={`flex size-10 items-center justify-center rounded-xl ${statusColors[booking.status]}`}>
                              <StatusIcon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium">{booking.serviceName}</p>
                                <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium uppercase ${statusColors[booking.status]}`}>
                                  {booking.status}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {booking.userEmail} • {booking.date} at {booking.time}
                              </p>
                              {booking.notes && (
                                <p className="mt-2 text-xs text-muted-foreground bg-card/50 rounded-lg p-2">{booking.notes}</p>
                              )}
                              {service && (
                                <p className="mt-1 text-xs text-cyan-400">₹{service.price.toLocaleString()} • {service.priceUnit}</p>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <select
                                value={booking.status}
                                onChange={(e) => handleStatusChange(booking._id, e.target.value as Booking["status"])}
                                className="rounded-lg border border-border/50 bg-card/60 px-2 py-1 text-xs text-foreground outline-none focus:border-cyan-500/50"
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirm</option>
                                <option value="completed">Complete</option>
                                <option value="cancelled">Cancel</option>
                              </select>
                              <span className="text-[10px] text-muted-foreground">
                                {new Date(booking.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Messages - Threaded Chat */}
            {activeTab === "messages" && (
              <div className="grid gap-6 lg:grid-cols-[360px_1fr] min-h-[600px]">
                {/* Conversation list */}
                <div className="overflow-y-auto max-h-[600px]">
                  <h2 className="mb-4 text-lg font-semibold">Conversations</h2>
                  {conversationList.length === 0 ? (
                    <div className="rounded-2xl border border-border/40 bg-card/30 p-12 text-center">
                      <MessageSquare className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                      <p className="text-sm font-medium">No messages yet</p>
                      <p className="mt-1 text-xs text-muted-foreground">Messages will appear when customers send them.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {conversationList.map((conv) => {
                        const service = getServices().find((s) => s.slug === conv.serviceId);
                        const isSelected = selectedMessage?.userEmail === conv.userEmail && selectedMessage?.serviceId === conv.serviceId;
                        return (
                          <button key={`${conv.userEmail}::${conv.serviceId}`}
                            onClick={() => setSelectedMessage(conv.latestMessage)}
                            className={`w-full text-left rounded-2xl border p-4 transition-all hover:bg-card/40 ${
                              isSelected ? "border-cyan-500/50 bg-card/40" : "border-border/40 bg-card/30"
                            }`}>
                            <div className="flex items-start gap-3">
                              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 text-xs font-bold text-foreground/70">
                                {conv.userName?.charAt(0).toUpperCase() || "U"}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium truncate">{conv.userName || "User"}</p>
                                  <span className="text-[10px] text-muted-foreground">{new Date(conv.latestMessage.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-xs text-muted-foreground truncate">{conv.userEmail} • {service?.name || conv.serviceId}</p>
                                <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{conv.latestMessage.content}</p>
                              </div>
                              <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-medium text-purple-400">
                                {conv.count}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Chat thread */}
                <div className="rounded-2xl border border-border/40 bg-card/30 p-6 flex flex-col">
                  {selectedMessage ? (
                    <>
                      {/* Header */}
                      <div className="mb-4 pb-4 border-b border-border/30">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 text-sm font-bold text-foreground/70">
                            {selectedMessage.userName?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="font-medium">{selectedMessage.userName || "User"}</p>
                            <p className="text-xs text-muted-foreground">{selectedMessage.userEmail}</p>
                          </div>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">Service: {selectedMessage.serviceId}</p>
                      </div>

                      {/* Thread messages */}
                      <div className="flex-1 overflow-y-auto space-y-3 mb-4 min-h-0">
                        {threadMessages.length === 0 && (
                          <p className="text-xs text-muted-foreground text-center py-4">No messages in this thread.</p>
                        )}
                        {threadMessages.map((msg) => {
                          const isAdmin = msg.userEmail === ADMIN_EMAIL;
                          return (
                            <div key={msg._id} className={`rounded-xl p-3 max-w-[85%] ${
                              isAdmin ? "bg-cyan-500/10 ml-auto" : "bg-card/50"
                            }`}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] font-medium ${isAdmin ? "text-cyan-400" : "text-muted-foreground"}`}>
                                  {isAdmin ? "Admin" : msg.userName || "User"}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  {new Date(msg.createdAt).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm">{msg.content}</p>
                            </div>
                          );
                        })}
                        <div ref={threadEndRef} />
                      </div>

                      {/* Reply input */}
                      <form onSubmit={handleSendReply} className="flex gap-2 border-t border-border/30 pt-4">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type your reply..."
                          className="flex-1 rounded-xl border border-border/50 bg-card/40 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                        />
                        <button
                          type="submit"
                          disabled={!replyText.trim()}
                          className="inline-flex size-10 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white transition-all hover:brightness-110 disabled:opacity-50"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                      <MessageSquare className="mb-3 h-8 w-8 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">Select a conversation to view and reply</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Customers */}
            {activeTab === "customers" && (
              <div>
                <h2 className="mb-4 text-lg font-semibold">Customer List</h2>
                {bookings.length === 0 ? (
                  <div className="rounded-2xl border border-border/40 bg-card/30 p-12 text-center">
                    <Users className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">No customers yet</p>
                    <p className="mt-1 text-xs text-muted-foreground">Customer data will appear here when they book services.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {Array.from(new Set(bookings.map((b) => b.userEmail))).map((email) => {
                      const customerBookings = bookings.filter((b) => b.userEmail === email);
                      const customerName = customerBookings[0]?.userName || email.split("@")[0];
                      const totalSpent = customerBookings.reduce((sum, b) => {
                        const service = getServices().find((s) => s.slug === b.serviceId);
                        return sum + (service?.price || 0);
                      }, 0);
                      return (
                        <div key={email} className="rounded-2xl border border-border/40 bg-card/30 p-5 transition-all hover:bg-card/40">
                          <div className="flex items-center gap-4">
                            <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 text-lg font-bold text-foreground/70">
                              {customerName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium">{customerName}</p>
                              <p className="text-sm text-muted-foreground">{email}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold gradient-text">₹{totalSpent.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">{customerBookings.length} bookings</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Activity */}
            {activeTab === "activity" && (
              <div>
                <h2 className="mb-4 text-lg font-semibold">Activity Feed</h2>
                {activities.length === 0 ? (
                  <div className="rounded-2xl border border-border/40 bg-card/30 p-12 text-center">
                    <ActivityIcon className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">No activity yet</p>
                    <p className="mt-1 text-xs text-muted-foreground">All customer activity will be tracked here.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4 rounded-2xl border border-border/40 bg-card/30 p-4 transition-all hover:bg-card/40">
                        <div className={`flex size-10 items-center justify-center rounded-xl ${
                          activity.type === "booking" ? "bg-cyan-500/10" :
                          activity.type === "message" ? "bg-purple-500/10" : "bg-green-500/10"
                        }`}>
                          {activity.type === "booking" ? <Calendar className="h-5 w-5 text-cyan-400" /> :
                           activity.type === "message" ? <MessageSquare className="h-5 w-5 text-purple-400" /> :
                           <Send className="h-5 w-5 text-green-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">{activity.userEmail}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(activity.createdAt).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
