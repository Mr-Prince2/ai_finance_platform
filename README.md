### 🪙 Kuber — AI-Powered Personal Finance Platform
Kuber is a full-stack, enterprise-grade AI Finance Platform designed to help users track, analyze, and optimize their financial health in real time. Featuring glassmorphism design elements, zero-asset text animations, an AI-powered receipt scanner, robust rate-limiting security shields, and complex background automation loops, Kuber transforms standard expense tracking into an intelligent personal asset management experience.

## 🚀 Key Features
##  🖥️ Premium UI/UX & High Performance
# Modern Dark Theme:
A premium, low-contrast dark interface optimized for data-dense charting layouts using Tailwind CSS.

# Typographic Animations: 
Zero-asset custom CSS text effects (animate-logo-fade) inside a clean glassmorphic header, eliminating image caching locks and enhancing First Contentful Paint (FCP).

# Responsive Layout Grid:
A fluid layout grid wrapper using Tailwind breakpoints designed to effortlessly transition from mobile matrix scales to wide tablet/desktop monitors.

# Optimistic UI Updates:
Instant visual state updates via React 19's useOptimistic hook, keeping operations fast by bypassing server action roundtrips.

## 🤖 Intelligent AI Integrations (Google Gemini AI)
Smart Receipt Scanner: Upload receipt images directly to have the platform parse line items, suggest semantic category associations, structure timestamps, and calculate totals instantly.

# Monthly Financial Insights: 
Automated first-of-the-month background evaluation pipelines that read user patterns and write targeted, actionable financial guidance.

## 🛡️ Enterprise-Grade Security (Arcjet)
# Transactional Rate Limiting:
Advanced token-bucket controllers managing mutations across API networks to protect the server from automated high-frequency script attacks.

# Automated Bot Shield:
Core traffic filtering layers safeguarding platform pathways from malicious automated agents while safely allowing standard search engine and web crawlers.

## ⚙️ Background Event Architectures (Inngest)
# Automated Cron Scheduling:
Scheduled background operations checking operational metrics, managing budgets, and distributing monthly email digests natively.

# Throttled Event Loops:
Sophisticated event batching controls restricting execution queues to 10 instances per minute per user to keep multi-user processes stable.

## 🛠️ Core Tech Stack
# Frontend Framework:
Next.js (App Router, Turbopack Compilation Engine)

# UI Foundation:
React 19, Tailwind CSS, Shadcn UI Components, Lucide Icons, React Spinners

# Authentication & Profiles:
Clerk Auth Engine (Optimized with Custom Dark Theme Elements)

# Database & Layer Management:
Supabase (PostgreSQL), Prisma ORM (Relational Data Pipelines)

# AI Processing Engine:
Google Generative AI (Gemini 1.5 Flash Model Core)

# Application Security:
Arcjet Security Integration Shield

# Event & Task Infrastructure:
Inngest Event Pipeline Framework

# Email Layer Templates:
Resend API Core paired with React Email Components

# Data Visualization:
Recharts (Responsive Vector Area/Bar Graphs)

## ⚙️ Local Installation & Development
To spin up Kuber locally, ensure your machine has Node.js installed, then follow this step-by-step setup script:

# 1. Clone & Configuration
Clone the repository path and initialize your configuration layer:

```Bash
git clone https://github.com/Mr-Prince2/ai_finance_platform.git
cd ai_finance_platform
Create an .env or .env.local file in your root folder and supply your infrastructure tokens:
```
```
Code snippet
# Clerk Security Environment
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database Direct and Pooling Vectors
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Third Party AI Providers & Middleware Services
GEMINI_API_KEY=AIzaSy...
ARCJET_KEY=ajkey_...
RESEND_API_KEY=re_...
```

# 2. Install Core Dependencies
Install the explicit dependency packages matching your platform's React 19 and Next.js layers:

```Bash
npm install --legacy-peer-deps
```

# 3. Sync Your Database Schemas
Push your local structural configurations straight to your relational database instances via Prisma:

```Bash
npx prisma migrate dev --name init
```

# 4. Run the Dev Server
Launch your local Next.js environment running with native Turbopack compilation:

```Bash
npm run dev
```
Your user dashboard will load live at http://localhost:3000.

# 5. Launch the Local Background Inngest Engine
Open a separate terminal window to host your background event-driven micro-services locally:

```Bash
npx inngest-cli@latest dev -u http://localhost:3000/api/inngest
```

Access the background execution metrics and manual task invocation board at http://localhost:8288.

## 📦 Deployment
This project is fully optimized for single-click deployments on Vercel:

Link your GitHub repository to your Vercel Dashboard.

In the Build and Output Settings, append your legacy resolution installer rules into the install command field override:

```Bash
npm install --legacy-peer-deps
```
Set your custom project environment variables within Vercel's securely managed fields.

Add the official Inngest Integration extension through your Vercel Project Integration settings to allow sync engines to complete automatically.

---