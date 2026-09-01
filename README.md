# LaunchPulse.Studio

A modern service catalog and client portal built with React, Vite, Convex, and Supabase.

## Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Bun](https://bun.sh/) (recommended) or npm

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd launchpulse-studio
bun install
```

### 2. Set Up Convex (Database + Auth)

1. Go to [convex.dev](https://convex.dev) and create a free account
2. Create a new project
3. Copy your project URL from Settings → Deployment URL
4. Create a `.env` file in the project root:

```env
VITE_CONVEX_URL=<paste-your-convex-url-here>
```

5. Initialize Convex:
```bash
bun convex dev --once
```

This will deploy your schema and seed the database with sample services.

### 3. Set Up Supabase (Optional — for file storage)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings → API
4. Add these to your `.env` file:

```env
VITE_SUPABASE_URL=<paste-your-supabase-url-here>
VITE_SUPABASE_ANON_KEY=<paste-your-supabase-anon-key-here>
```

### 4. Start Development Server

```bash
bun dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
├── src/
│   ├── convex/           # Convex backend functions
│   │   ├── schema.ts     # Database schema
│   │   ├── services.ts   # Service catalog queries/mutations
│   │   ├── bookings.ts   # Booking management
│   │   └── messages.ts   # Discussion messages
│   ├── pages/            # React pages
│   │   ├── Landing.tsx   # Homepage
│   │   ├── Catalog.tsx   # Service catalog
│   │   ├── ServiceDetail.tsx  # Individual service page
│   │   ├── Dashboard.tsx # Client portal
│   │   └── Auth.tsx      # Authentication
│   ├── lib/
│   │   └── supabase.ts   # Supabase client (optional)
│   └── components/       # Reusable UI components
├── convex/               # Convex config
└── package.json
```

## Features

- **Landing Page** — Hero section, services overview, pricing, testimonials
- **Service Catalog** — Browse, filter, search services with grid/list views
- **Service Detail** — Full service info, booking form, discussion
- **Dashboard** — Client portal with bookings, messages, settings
- **Authentication** — Sign up/sign in with Convex Auth
- **Real-time** — Live updates via Convex subscriptions
- **Mobile Responsive** — Hamburger menu, responsive layouts
- **Dark Theme** — Minimalistic, advanced dark UI

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS
- **Backend:** Convex (database, auth, real-time)
- **Storage:** Supabase (optional, for file uploads)
- **UI Components:** shadcn/ui, Radix UI, Framer Motion
- **Icons:** Lucide React

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_CONVEX_URL` | Yes | Convex deployment URL |
| `VITE_SUPABASE_URL` | No | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | No | Supabase anonymous key |

## Deployment

### Build for Production

```bash
bun run build
```

The output will be in the `dist/` folder.

### Deploy to Vercel/Netlify

1. Push your code to GitHub
2. Connect your repo to Vercel/Netlify
3. Add environment variables in the dashboard
4. Deploy!

### Deploy Convex Separately

```bash
bun convex deploy
```

## Discord

Join our Discord for support: https://discord.gg/2srHufQ8pj

## License

MIT
