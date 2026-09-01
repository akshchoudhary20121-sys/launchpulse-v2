import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  LogOut,
  Globe,
  Bot,
  Palette,
  Code,
  Cog,
  MessageSquare,
  ArrowRight,
  Send,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import logo from "@/assets/logo.svg";

const quickServices = [
  { icon: Globe, name: "Website Development", tagline: "Custom responsive sites" },
  { icon: Bot, name: "Discord & Bot Dev", tagline: "Bots, servers & automation" },
  { icon: Palette, name: "Graphics & Branding", tagline: "Logos, UI/UX & identity" },
  { icon: Code, name: "Roblox Development", tagline: "Games, scripts & UI" },
  { icon: Cog, name: "Automations", tagline: "Dashboards & workflows" },
  { icon: MessageSquare, name: "Content & Marketing", tagline: "Social & digital campaigns" },
];

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Logo" className="h-10 w-10" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Client Dashboard
              </p>
              <h1 className="mt-0.5 text-2xl font-bold tracking-tight">
                Welcome{user?.name ? `, ${user.name}` : ""}
              </h1>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer gap-2 self-start"
            onClick={handleSignOut}
          >
            <LogOut className="size-4" />
            Sign out
          </Button>
        </header>

        {/* Quick Services */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Our Services</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {quickServices.map((s) => (
              <Card key={s.name} className="border-border/50 bg-card/40 shadow-none backdrop-blur-sm">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10">
                    <s.icon className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.tagline}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact / Inquiry Form */}
        <Card className="border-border/50 bg-card/40 shadow-none backdrop-blur-sm">
          <CardHeader>
            <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10">
              <Send className="size-5 text-cyan-400" />
            </div>
            <CardTitle className="text-lg">Start a Project</CardTitle>
            <p className="text-sm text-muted-foreground">
              Tell us about your project and we'll get back to you within 24 hours.
            </p>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-cyan-500/10">
                  <ArrowRight className="h-5 w-5 text-cyan-400" />
                </div>
                <h3 className="text-base font-semibold">Inquiry submitted!</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  We'll reach out to you soon. Check your Discord or email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="project-type" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Service Type
                    </label>
                    <select
                      id="project-type"
                      className="w-full rounded-xl border border-border/50 bg-card/60 px-4 py-2.5 text-sm text-foreground outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                    >
                      <option value="">Select a service</option>
                      {quickServices.map((s) => (
                        <option key={s.name} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="budget" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Budget Range
                    </label>
                    <select
                      id="budget"
                      className="w-full rounded-xl border border-border/50 bg-card/60 px-4 py-2.5 text-sm text-foreground outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                    >
                      <option value="">Select budget</option>
                      <option value="starter">Under ₹1,000</option>
                      <option value="pro">₹1,000 – ₹5,000</option>
                      <option value="enterprise">₹5,000+</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="description" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Project Description
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    placeholder="Tell us about your project, timeline, and any specific requirements..."
                    className="w-full rounded-xl border border-border/50 bg-card/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full cursor-pointer gap-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-purple-500/20 hover:brightness-110 sm:w-auto sm:self-start"
                >
                  <Send className="h-4 w-4" />
                  Submit Inquiry
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
