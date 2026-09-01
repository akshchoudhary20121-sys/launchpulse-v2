// Simple localStorage-based data store with cross-tab sync
// No database needed — everything saves in the browser

const SERVICES_KEY = "launchpulse_services";
const BOOKINGS_KEY = "launchpulse_bookings";
const MESSAGES_KEY = "launchpulse_messages";
const REPLIES_KEY = "launchpulse_replies";
const ADMIN_KEY = "launchpulse_admin";

// ─── Custom Event System for Same-Tab Updates ───
type StorageEventHandler = () => void;
const listeners: Map<string, Set<StorageEventHandler>> = new Map();

function emitChange(key: string): void {
  const keyListeners = listeners.get(key);
  if (keyListeners) {
    keyListeners.forEach((fn) => fn());
  }
}

export function onStorageChange(key: string, callback: StorageEventHandler): () => void {
  if (!listeners.has(key)) {
    listeners.set(key, new Set());
  }
  listeners.get(key)!.add(callback);
  return () => {
    listeners.get(key)?.delete(callback);
  };
}

// Listen for storage events from other tabs
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key) {
      emitChange(e.key);
    }
  });
}

// ─── Types ───
export interface Service {
  _id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  priceUnit: string;
  description: string;
  longDescription: string;
  features: string[];
  status: "active" | "draft" | "archived";
  createdAt: number;
}

export interface Booking {
  _id: string;
  userId: string;
  userEmail: string;
  userName: string;
  serviceName: string;
  serviceId: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  createdAt: number;
}

export interface Message {
  _id: string;
  userId: string;
  userEmail: string;
  userName: string;
  serviceId: string;
  content: string;
  createdAt: number;
}

export interface Reply {
  _id: string;
  messageId: string;
  sender: "admin" | "user";
  content: string;
  createdAt: number;
}

// ─── Default Services ───
const DEFAULT_SERVICES: Omit<Service, "_id" | "createdAt">[] = [
  {
    name: "Website Development",
    slug: "website-development",
    category: "Development",
    price: 2999,
    priceUnit: "one-time",
    description: "Custom, responsive websites built with modern tech stacks. From landing pages to full web applications.",
    longDescription: "We build fast, responsive, and visually striking websites tailored to your brand. Whether you need a single-page landing site or a complex web application, our team delivers clean code, modern frameworks, and pixel-perfect design. Every project includes responsive layouts, performance optimization, and SEO-ready structure.",
    features: ["Custom design & development", "Responsive across all devices", "Performance optimized", "SEO-ready structure", "30 days post-launch support"],
    status: "active",
  },
  {
    name: "Discord Bot Development",
    slug: "discord-bot-development",
    category: "Development",
    price: 1999,
    priceUnit: "one-time",
    description: "Custom Discord bots, server setups, ticket systems, and automation solutions for communities.",
    longDescription: "From moderation bots to complex ticket systems and auto-role assignments, we craft Discord bots that run reliably at scale. Our bots are built with discord.js, feature intuitive slash commands, and come with full documentation.",
    features: ["Custom slash commands", "Ticket & moderation systems", "Auto-role & verification", "Dashboard & analytics", "Ongoing maintenance available"],
    status: "active",
  },
  {
    name: "UI/UX Design",
    slug: "uiux-design",
    category: "Design",
    price: 2499,
    priceUnit: "one-time",
    description: "User interface and experience design that balances aesthetics with usability. Wireframes to high-fidelity prototypes.",
    longDescription: "Great design is invisible — it just works. We craft interfaces that feel intuitive from the first tap. Our process starts with research and wireframing, moves into high-fidelity mockups, and ends with interactive prototypes your developers can ship.",
    features: ["User research & personas", "Wireframing & prototyping", "High-fidelity mockups", "Design system creation", "Developer handoff files"],
    status: "active",
  },
  {
    name: "Brand Identity Package",
    slug: "brand-identity",
    category: "Design",
    price: 3499,
    priceUnit: "one-time",
    description: "Complete brand identity systems — logo, color palette, typography, and usage guidelines.",
    longDescription: "Your brand is more than a logo. We build cohesive identity systems that communicate your values at every touchpoint. The package includes logo design, color palette, typography, and a brand guidelines document.",
    features: ["Logo (3 variants)", "Color palette & tokens", "Typography system", "Brand guidelines PDF", "Social media kit"],
    status: "active",
  },
  {
    name: "Roblox Development",
    slug: "roblox-development",
    category: "Development",
    price: 4999,
    priceUnit: "one-time",
    description: "Game systems, scripts, UI design, and complete Roblox experiences from concept to publish.",
    longDescription: "We build Roblox experiences that players love. From game mechanics and UI systems to full world-building and scripting, our team handles every aspect of Roblox development.",
    features: ["Game mechanics & scripting", "Custom UI/UX design", "3D environment building", "Performance optimization", "Publishing support"],
    status: "active",
  },
  {
    name: "Workflow Automation",
    slug: "workflow-automation",
    category: "Automation",
    price: 1499,
    priceUnit: "one-time",
    description: "Automate repetitive tasks with custom dashboards, bots, and integration workflows.",
    longDescription: "Stop doing the same thing every day. We build automation systems that connect your tools, eliminate manual work, and give you dashboards to monitor everything.",
    features: ["Custom automation flows", "Tool integrations", "Monitoring dashboards", "Error handling & alerts", "Documentation & training"],
    status: "active",
  },
  {
    name: "Monthly Retainer",
    slug: "monthly-retainer",
    category: "Support",
    price: 9999,
    priceUnit: "per month",
    description: "Ongoing development and support partnership. Priority access, unlimited small tasks, and a dedicated point of contact.",
    longDescription: "For teams that need continuous support without the overhead of hiring. Our monthly retainer gives you priority access, unlimited small tasks, and a dedicated project manager.",
    features: ["Priority support channel", "Unlimited small tasks", "Dedicated project manager", "Weekly progress reports", "Preferential pricing on projects"],
    status: "active",
  },
  {
    name: "Content & Marketing",
    slug: "content-marketing",
    category: "Marketing",
    price: 1999,
    priceUnit: "one-time",
    description: "Social media content, marketing strategies, and digital campaigns that drive real engagement.",
    longDescription: "We create content that stops the scroll. From social media graphics and copywriting to full campaign strategy, our marketing team builds narratives that connect with your audience.",
    features: ["Content strategy", "Social media graphics", "Copywriting & captions", "Campaign planning", "Performance analytics"],
    status: "active",
  },
];

// ─── Helper Functions ───
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored === null) {
      return defaultValue;
    }
    return JSON.parse(stored);
  } catch (e) {
    console.error(`[Store] Error reading ${key}:`, e);
    return defaultValue;
  }
}

function setToStorage<T>(key: string, value: T): void {
  try {
    const jsonValue = JSON.stringify(value);
    localStorage.setItem(key, jsonValue);
    console.log(`[Store] Saved to ${key}:`, value);
    // Emit change event for same-tab listeners
    emitChange(key);
  } catch (e) {
    console.error(`[Store] Error saving ${key}:`, e);
  }
}

// ─── Admin ───
export const ADMIN_EMAIL = "launchpulsesite@gmail.com";

export function isAdmin(): boolean {
  return getFromStorage<boolean>(ADMIN_KEY, false);
}

export function setAdmin(isAdminUser: boolean): void {
  setToStorage(ADMIN_KEY, isAdminUser);
}

export function isAdminEmail(email: string): boolean {
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

// ─── Services ───
export function getServices(): Service[] {
  let services = getFromStorage<Service[]>(SERVICES_KEY, []);

  // Seed default services if empty
  if (services.length === 0) {
    console.log("[Store] Seeding default services...");
    services = DEFAULT_SERVICES.map((s) => ({
      ...s,
      _id: generateId(),
      createdAt: Date.now() + Math.random() * 1000,
    }));
    setToStorage(SERVICES_KEY, services);
  }

  return services;
}

export function getServiceBySlug(slug: string): Service | undefined {
  return getServices().find((s) => s.slug === slug);
}

export function searchServices(query: string, category?: string): Service[] {
  let services = getServices();

  if (category) {
    services = services.filter((s) => s.category === category);
  }

  if (query) {
    const q = query.toLowerCase();
    services = services.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
    );
  }

  return services.sort((a, b) => b.createdAt - a.createdAt);
}

// ─── Bookings ───
export function getBookings(userId?: string): Booking[] {
  const bookings = getFromStorage<Booking[]>(BOOKINGS_KEY, []);
  console.log(`[Store] getBookings(${userId || "all"}):`, bookings.length, "bookings");
  if (userId) {
    return bookings.filter((b) => b.userId === userId);
  }
  return bookings.sort((a, b) => b.createdAt - a.createdAt);
}

export function getAllBookings(): Booking[] {
  const bookings = getFromStorage<Booking[]>(BOOKINGS_KEY, []);
  console.log("[Store] getAllBookings:", bookings.length, "bookings");
  return bookings.sort((a, b) => b.createdAt - a.createdAt);
}

export function createBooking(booking: Omit<Booking, "_id" | "createdAt">): Booking {
  console.log("[Store] Creating booking:", booking);
  const bookings = getFromStorage<Booking[]>(BOOKINGS_KEY, []);
  const newBooking: Booking = {
    ...booking,
    _id: generateId(),
    createdAt: Date.now(),
  };
  bookings.push(newBooking);
  setToStorage(BOOKINGS_KEY, bookings);
  console.log("[Store] Booking created. Total bookings:", bookings.length);
  return newBooking;
}

export function updateBookingStatus(bookingId: string, status: Booking["status"]): void {
  console.log("[Store] Updating booking status:", bookingId, status);
  const bookings = getFromStorage<Booking[]>(BOOKINGS_KEY, []);
  const updated = bookings.map((b) =>
    b._id === bookingId ? { ...b, status } : b
  );
  setToStorage(BOOKINGS_KEY, updated);
}

export function cancelBooking(bookingId: string): void {
  updateBookingStatus(bookingId, "cancelled");
}

// ─── Messages ───
export function getMessages(serviceId?: string): Message[] {
  const messages = getFromStorage<Message[]>(MESSAGES_KEY, []);
  console.log(`[Store] getMessages(${serviceId || "all"}):`, messages.length, "messages");
  if (serviceId) {
    return messages.filter((m) => m.serviceId === serviceId);
  }
  return messages.sort((a, b) => b.createdAt - a.createdAt);
}

export function getAllMessages(): Message[] {
  const messages = getFromStorage<Message[]>(MESSAGES_KEY, []);
  console.log("[Store] getAllMessages:", messages.length, "messages");
  return messages.sort((a, b) => b.createdAt - a.createdAt);
}

export function sendMessage(message: Omit<Message, "_id" | "createdAt">): Message {
  console.log("[Store] Sending message:", message);
  const messages = getFromStorage<Message[]>(MESSAGES_KEY, []);
  const newMessage: Message = {
    ...message,
    _id: generateId(),
    createdAt: Date.now(),
  };
  messages.push(newMessage);
  setToStorage(MESSAGES_KEY, messages);
  console.log("[Store] Message sent. Total messages:", messages.length);
  return newMessage;
}

// ─── Replies ───
export function getReplies(messageId: string): Reply[] {
  const replies = getFromStorage<Reply[]>(REPLIES_KEY, []);
  return replies.filter((r) => r.messageId === messageId).sort((a, b) => a.createdAt - b.createdAt);
}

export function sendReply(messageId: string, sender: "admin" | "user", content: string): Reply {
  console.log("[Store] Sending reply:", messageId, sender, content);
  const replies = getFromStorage<Reply[]>(REPLIES_KEY, []);
  const newReply: Reply = {
    _id: generateId(),
    messageId,
    sender,
    content,
    createdAt: Date.now(),
  };
  replies.push(newReply);
  setToStorage(REPLIES_KEY, replies);
  return newReply;
}

export function getAllReplies(): Reply[] {
  return getFromStorage<Reply[]>(REPLIES_KEY, []).sort((a, b) => a.createdAt - b.createdAt);
}

// ─── Activity Feed (for admin) ───
export interface Activity {
  id: string;
  type: "booking" | "message" | "reply";
  description: string;
  userEmail: string;
  createdAt: number;
}

export function getActivityFeed(): Activity[] {
  const bookings = getAllBookings();
  const messages = getAllMessages();
  const replies = getAllReplies();

  const activities: Activity[] = [];

  bookings.forEach((b) => {
    activities.push({
      id: `booking-${b._id}`,
      type: "booking",
      description: `New booking: ${b.serviceName} (${b.status})`,
      userEmail: b.userEmail,
      createdAt: b.createdAt,
    });
  });

  messages.forEach((m) => {
    activities.push({
      id: `message-${m._id}`,
      type: "message",
      description: `New message on service: ${m.serviceId}`,
      userEmail: m.userEmail,
      createdAt: m.createdAt,
    });
  });

  replies.forEach((r) => {
    activities.push({
      id: `reply-${r._id}`,
      type: "reply",
      description: `Reply to message: ${r.content.slice(0, 50)}...`,
      userEmail: r.sender === "admin" ? ADMIN_EMAIL : "user",
      createdAt: r.createdAt,
    });
  });

  return activities.sort((a, b) => b.createdAt - a.createdAt);
}

// ─── Debug: Get all storage data ───
export function debugStorage(): void {
  console.log("[Store Debug] === All Storage Data ===");
  console.log("Services:", getFromStorage(SERVICES_KEY, []));
  console.log("Bookings:", getFromStorage(BOOKINGS_KEY, []));
  console.log("Messages:", getFromStorage(MESSAGES_KEY, []));
  console.log("Replies:", getFromStorage(REPLIES_KEY, []));
  console.log("[Store Debug] =========================");
}

// ─── Clear Data ───
export function clearAllData(): void {
  localStorage.removeItem(SERVICES_KEY);
  localStorage.removeItem(BOOKINGS_KEY);
  localStorage.removeItem(MESSAGES_KEY);
  localStorage.removeItem(REPLIES_KEY);
}
