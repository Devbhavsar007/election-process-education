# 🗳️ CivicVerse

### AI-Powered Election Learning & Voter Empowerment Platform

**Google Solution Challenge 2026 · Civic Tech & Digital Democracy Track**

[🌐 Live Demo](https://civicverse-client-784946024453.us-central1.run.app) · [⚡ API Health](https://civicverse-server-784946024453.us-central1.run.app/api/health) · [📖 Documentation](#architecture)

---

## About

CivicVerse is a full-stack, AI-powered election education platform designed to empower **950M+ Indian voters** with personalized civic knowledge. It combines dual AI providers (Mistral + Gemini), multilingual support across **22 Scheduled Languages of India**, and ECI-compliant voter preparation tools — all wrapped in a premium dark-mode interface.

> **Built for the world's largest democracy.** Every feature is designed around real voter needs — from first-time 18-year-old voters in rural Assam to seasoned citizens in metropolitan constituencies.

---

## The Problem

India conducts the largest democratic exercise on Earth. Yet:
- **~300M eligible voters** don't participate in each general election
- Voter education materials are scattered across dozens of government portals in varying languages
- First-time voters have no single, unified resource to learn the entire voting process
- Misinformation about voting procedures spreads faster than accurate ECI guidelines

CivicVerse solves this by providing a **single, AI-powered platform** that meets voters where they are — in their language, at their knowledge level, with real-time guidance.

---

## What's Actually Built

Concrete features. No imaginary services. Everything listed below runs in production on Google Cloud Run.

### 🤖 AI Engine (4-Tier Fallback Pipeline)

```
User Query → Cache (SHA-256) → Mistral Large → Gemini 2.0 Flash → Hardcoded ECI Fallback
```

Every AI request goes through a resilient pipeline:
1. **In-memory cache** — SHA-256 hashed prompts with 10-min TTL (500 entry max)
2. **Mistral Large** — Primary provider for election-specific queries
3. **Gemini 2.0 Flash** — Secondary provider with key rotation support
4. **Hardcoded fallback** — ECI-accurate responses for core topics (voting rights, NOTA, EVM)

If `MISTRAL_API_KEY` or `GEMINI_API_KEY` is missing, each tier degrades gracefully — the platform is **always-on**.

### 🔐 Authentication
- **Firebase Authentication** — Google Sign-In via popup with ID token verification
- **Firebase Admin SDK** — Server-side token verification for every protected route
- **JWT sessions** — 7-day tokens with `bcrypt` (12 rounds) password hashing
- **Profile completion flow** — New Google users are routed to complete their voter profile (state, constituency, language)

### 🌐 Multilingual Support (22 Languages)
Full support for all Scheduled Languages of India:

| | | | |
|---|---|---|---|
| English | हिन्दी (Hindi) | বাংলা (Bengali) | தமிழ் (Tamil) |
| తెలుగు (Telugu) | मराठी (Marathi) | ગુજરાતી (Gujarati) | ಕನ್ನಡ (Kannada) |
| മലയാളം (Malayalam) | ਪੰਜਾਬੀ (Punjabi) | ଓଡ଼ିଆ (Odia) | অসমীয়া (Assamese) |
| اردو (Urdu) | سنڌي (Sindhi) | नेपाली (Nepali) | कॉशुर (Kashmiri) |
| संस्कृत (Sanskrit) | मैथिली (Maithili) | कोंकणी (Konkani) | डोगरी (Dogri) |
| भोजपुरी (Bhojpuri) | মৈতৈলোন্ (Manipuri) | | |

### 📊 15 Interactive Features

| Feature | Route | Description |
|---|---|---|
| **Dashboard** | `/dashboard` | Personalized voter preparation hub with progress tracking |
| **AI Chat** | `/chat` | Conversational AI assistant for election queries with sentiment analysis |
| **Voting Journey** | `/journey` | AI-generated 6-step personalized voter preparation journey |
| **Election Timeline** | `/timeline` | Visual timeline of Indian election milestones |
| **Polling Booth Finder** | `/booth` | AI-powered booth location by address and state |
| **Scenario Simulator** | `/scenario` | "What-if" election scenario analysis with constitutional context |
| **Knowledge Quiz** | `/quiz` | AI-generated MCQ quiz with real answer scoring |
| **Translation Tool** | `/translate` | Real-time translation across 22 Indian languages |
| **Voter Checklist** | `/checklist` | 8-step interactive preparation checklist with persistence |
| **Analytics Insights** | `/analytics` | Personal learning analytics: quiz scores, chat history, progress |
| **Profile Completion** | `/complete-profile` | State, constituency, and language preference setup |
| **Google Sign-In** | `/auth` | Firebase-powered authentication with particle animation |
| **Language Selector** | Navbar | 22-language switcher with ARIA-compliant dropdown |
| **Health Monitor** | `/api/health` | Real-time system status: DB, AI providers, services |
| **Sentiment Analysis** | Backend | Google Cloud NLP integration on every chat message |

---

## Architecture

This diagram reflects what's actually wired in the codebase — not aspirational features.

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                  │
│   React 19 + Vite 8 · Framer Motion · Lucide Icons              │
│   Firebase Auth (Google Sign-In) · Axios + JWT                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GOOGLE CLOUD RUN                              │
│                                                                  │
│  ┌─────────────────┐         ┌─────────────────────────────┐   │
│  │  civicverse-     │         │  civicverse-server           │   │
│  │  client          │         │  Express.js + Helmet + CORS  │   │
│  │  (Nginx + SPA)   │  ────▶ │  Rate Limiting + Mongo       │   │
│  │  Port 8080       │         │  Sanitize                    │   │
│  └─────────────────┘         │  Port 8080                    │   │
│                               └──────────┬──────────────────┘   │
└──────────────────────────────────────────┼──────────────────────┘
                                           │
              ┌────────────────────────────┼────────────────────┐
              ▼                            ▼                    ▼
   ┌──────────────────┐    ┌───────────────────┐  ┌──────────────┐
   │   AI Layer        │    │   Data Layer       │  │  Google APIs  │
   │                    │    │                    │  │               │
   │  Mistral Large     │    │  MongoDB Atlas     │  │  Firebase     │
   │  Gemini 2.0 Flash  │    │  (5 collections)   │  │  Auth + Admin │
   │  Google Cloud NLP  │    │                    │  │               │
   │  Google Translate   │    │  Users             │  │  Cloud NLP    │
   │  In-Memory Cache   │    │  ChatHistory       │  │  Translate    │
   │  (SHA-256 + TTL)   │    │  Checklist         │  │  Analytics    │
   │                    │    │  QuizResult        │  │               │
   │  4-Tier Fallback:  │    │  QueryLog          │  │               │
   │  Cache → Mistral   │    │                    │  │               │
   │  → Gemini → Static │    │  Connection Pool:  │  │               │
   └──────────────────┘    │  maxPoolSize: 10   │  └──────────────┘
                            └───────────────────┘
```

---

## Tech Stack

Only what's actually installed and imported in this repo.

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19, Vite 8, Framer Motion | SPA with premium animations |
| **Styling** | Vanilla CSS, CSS Variables, Inter font | Dark civic-tech design system |
| **Icons** | Lucide React | Consistent icon library |
| **Auth (Client)** | Firebase JS SDK v11 | Google Sign-In popup |
| **HTTP Client** | Axios | API calls with JWT interceptors |
| **Backend** | Express.js, Node.js 20 | REST API server |
| **Auth (Server)** | Firebase Admin SDK, JWT, bcrypt | Token verification + sessions |
| **Security** | Helmet, express-mongo-sanitize, express-rate-limit | CSP, NoSQL injection, DDoS |
| **Database** | MongoDB Atlas (Mongoose ODM) | 5 collections, pooled connections |
| **AI Primary** | Mistral AI (`mistral-large-latest`) | Election-specific AI responses |
| **AI Secondary** | Google Gemini (`gemini-2.0-flash`) | Fallback AI with key rotation |
| **NLP** | Google Cloud Natural Language | Sentiment analysis on chat |
| **Translation** | Google Cloud Translate v2 | 22-language translation |
| **Analytics** | Google Analytics (gtag.js) | Usage tracking |
| **Hosting** | Google Cloud Run (dual-service) | Containerized Docker deployment |
| **CI/Build** | Google Cloud Build | Automated container builds |
| **Container Registry** | Google Artifact Registry | Docker image storage |
| **Testing** | Node.js native test runner | 12 passing tests (auth + health) |

**Not in this codebase:** Pub/Sub, BigQuery, Cloud Tasks, SMS/WhatsApp APIs. Those are scoped for v2.

---

## Project Structure

```
civicverse/
│
├── client/                          # React 19 + Vite 8 Frontend
│   ├── index.html                   # SEO meta tags, OG tags, GA script, skip-nav
│   ├── vite.config.js               # Chunk splitting (react/firebase/framer vendors)
│   ├── nginx.conf                   # Production SPA routing for Cloud Run
│   ├── Dockerfile                   # Multi-stage: Node builder → Nginx server
│   ├── .dockerignore                # Excludes node_modules from build context
│   ├── .env.production              # Build-time environment variables
│   │
│   └── src/
│       ├── main.jsx                 # StrictMode + AuthProvider wrapper
│       ├── App.jsx                  # 15-view router with protected routes
│       ├── index.css                # Design system: CSS variables, scrollbar, a11y
│       │
│       ├── config/
│       │   └── firebase.js          # Firebase client SDK (null-safe init)
│       │
│       ├── context/
│       │   └── AuthContext.jsx       # JWT + Firebase auth state management
│       │
│       ├── hooks/
│       │   ├── useAuth.js           # Auth context consumer hook
│       │   └── useTranslate.js      # Translation hook
│       │
│       ├── services/
│       │   └── api.js               # Axios instance + 13 API endpoints + 401 handler
│       │
│       └── components/              # 15 feature components (JSX + CSS pairs)
│           ├── Navbar.jsx           # ARIA nav, 22-lang selector, logo
│           ├── HeroHeader.jsx       # Animated hero with parallax + stats
│           ├── AuthPage.jsx         # 3D card + particle canvas + Google SSO
│           ├── Dashboard.jsx        # Voter preparation hub
│           ├── AIChat.jsx           # Conversational AI with sentiment
│           ├── VotingJourney.jsx    # 6-step personalized journey
│           ├── ElectionTimeline.jsx # Visual election milestones
│           ├── PollingBoothGuide.jsx # AI booth finder
│           ├── ScenarioSimulator.jsx # What-if analysis
│           ├── KnowledgeQuiz.jsx    # MCQ quiz with real scoring
│           ├── TranslateTool.jsx    # 22-language translator
│           ├── VoterChecklist.jsx   # 8-step preparation checklist
│           ├── AnalyticsInsights.jsx # Personal learning analytics
│           ├── CompleteProfile.jsx  # Profile completion form
│           └── Footer.jsx          # Branded footer with nav
│
├── server/                          # Express.js Backend
│   ├── index.js                     # App entry: CORS, Helmet CSP, routes, error handler
│   ├── Dockerfile                   # Node 20 production container
│   ├── package.json                 # Dependencies + test script
│   │
│   ├── config/
│   │   ├── db.js                    # MongoDB connection with pooling + timeouts
│   │   └── firebase.js              # Firebase Admin SDK init + token verifier
│   │
│   ├── middleware/
│   │   ├── auth.js                  # JWT verify + generate (production-safe)
│   │   └── rateLimiter.js           # General (100/15m), Auth (20/15m), AI (30/15m)
│   │
│   ├── models/                      # Mongoose schemas
│   │   ├── User.js                  # name, email, passwordHash, firebaseUID, state, lang
│   │   ├── ChatHistory.js           # userId, messages[{role, content, sentiment}]
│   │   ├── Checklist.js             # userId, items[{id, label, done}]
│   │   ├── QuizResult.js            # userId, score, answers, takenAt
│   │   └── QueryLog.js              # userId, query, provider, responseTime
│   │
│   ├── routes/                      # 12 route modules
│   │   ├── auth.js                  # register, login, google, complete-profile, me
│   │   ├── chat.js                  # AI chat with sentiment + history
│   │   ├── journey.js               # Personalized voter journey (AI)
│   │   ├── timeline.js              # Election timeline (AI)
│   │   ├── booth.js                 # Polling booth finder (AI)
│   │   ├── scenario.js              # What-if simulator (AI)
│   │   ├── quiz.js                  # Quiz generation (AI) + real scoring
│   │   ├── translate.js             # 22-language translation
│   │   ├── user.js                  # User init + profile (ownership-checked)
│   │   ├── checklist.js             # CRUD with IDOR protection
│   │   ├── analytics.js             # Aggregated learning insights
│   │   └── health.js                # System status: DB, AI, services
│   │
│   ├── services/                    # Business logic
│   │   ├── callAI.js                # 4-tier AI pipeline + caching + logging
│   │   ├── sentiment.js             # Google Cloud NLP + local fallback
│   │   └── translate.js             # Google Cloud Translate + error handling
│   │
│   └── tests/                       # Test suite (12 tests)
│       ├── auth.test.js             # JWT middleware: 5 unit tests
│       └── health.test.js           # Health endpoint: 7 integration tests
│
└── package.json                     # Root: concurrent client + server dev
```

---

## Google Services Integration

| Google Service | How It's Used | Status |
|---|---|---|
| **Firebase Authentication** | Google Sign-In popup + ID token verification | ✅ Production |
| **Firebase Admin SDK** | Server-side token verification for all protected API routes | ✅ Production |
| **Gemini 2.0 Flash** | Secondary AI provider in the 4-tier fallback pipeline | ✅ Production |
| **Google Cloud NLP** | Sentiment analysis on every user chat message | ✅ With fallback |
| **Google Cloud Translate** | Real-time translation across 22 Indian languages | ✅ With fallback |
| **Google Analytics** | Frontend usage tracking via `gtag.js` | ✅ Production |
| **Google Cloud Run** | Dual-service containerized hosting (frontend + backend) | ✅ Production |
| **Google Cloud Build** | Automated Docker container builds on deploy | ✅ Production |
| **Google Artifact Registry** | Docker image storage and versioning | ✅ Production |

---

## Security

| Measure | Implementation |
|---|---|
| **HTTP Headers** | Helmet.js with custom Content-Security-Policy |
| **CORS** | Configurable allowlist via `ALLOWED_ORIGINS` env var |
| **NoSQL Injection** | `express-mongo-sanitize` on all requests |
| **Rate Limiting** | 3-tier: General (100/15m), Auth (20/15m), AI (30/15m) |
| **Password Hashing** | bcrypt with 12 salt rounds + minimum 6-char validation |
| **JWT Security** | Throws error if `JWT_SECRET` is missing in production |
| **IDOR Protection** | Checklist and profile routes use `req.userId` from JWT |
| **Error Sanitization** | Raw error messages hidden in production responses |
| **Request Limits** | JSON body capped at 1MB |
| **Firebase Verification** | Every Google login verified server-side via Admin SDK |

---

## Accessibility

| Feature | Implementation |
|---|---|
| Skip navigation link | `<a href="#main-content">` visible on Tab |
| Landmark elements | `<main id="main-content">`, `<nav aria-label>`, `<footer>` |
| Form associations | All inputs have `id` + `<label htmlFor>` pairs |
| Error announcements | `role="alert"` + `aria-live="assertive"` on form errors |
| Dropdown a11y | `aria-expanded`, `role="listbox"`, `aria-selected` |
| Decorative elements | Canvas and SVG icons marked `aria-hidden="true"` |
| Keyboard support | `focus-visible` outline styles on all interactive elements |
| Reduced motion | `@media (prefers-reduced-motion)` disables animations |
| Autocomplete | `autocomplete="email"`, `"name"`, `"current-password"` |
| Noscript fallback | Informative message when JavaScript is disabled |

---

## Quick Start

### Prerequisites
- Node.js 20+
- MongoDB Atlas account (or local MongoDB)
- Firebase project with Google Sign-In enabled
- Mistral API key and/or Gemini API key

### 1. Clone & Install
```bash
git clone https://github.com/Devbhavsar007/election-process-education.git
cd election-process-education
npm install        # installs root dependencies
cd client && npm install && cd ..
cd server && npm install && cd ..
```

### 2. Configure Environment

**Server** (`server/.env`):
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/civicverse
JWT_SECRET=your-256-bit-secret
MISTRAL_API_KEY=your-mistral-key
GEMINI_API_KEY=your-gemini-key
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**Client** (`client/.env`):
```env
VITE_API_URL=http://localhost:5002
VITE_FIREBASE_API_KEY=your-web-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=1:000:web:000
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 3. Run Locally
```bash
# From root directory — runs both client and server concurrently
npm run dev
```
- **Client:** http://localhost:5173
- **Server:** http://localhost:5002
- **Health:** http://localhost:5002/api/health

### 4. Run Tests
```bash
cd server
npm test
```
```
🧪 Auth Middleware Tests
  ✅ generateToken creates a valid JWT
  ✅ authenticate rejects request with no token
  ✅ authenticate rejects invalid token
  ✅ authenticate passes valid token to next()
  ✅ authenticate rejects non-Bearer token

🧪 Health Endpoint Tests
  ✅ returns 200 status
  ✅ returns status: ok
  ✅ returns uptime as number
  ✅ returns timestamp
  ✅ returns database status
  ✅ returns AI configuration
  ✅ returns services configuration

📊 Results: 12 passed, 0 failed
```

---

## Deployment (Google Cloud Run)

Both services are deployed as separate Cloud Run services behind Google Cloud Build.

```bash
# Backend
gcloud run deploy civicverse-server \
  --source ./server \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production,MONGODB_URI=...,JWT_SECRET=...,MISTRAL_API_KEY=...,GEMINI_API_KEY=...,FIREBASE_PROJECT_ID=...,FIREBASE_CLIENT_EMAIL=..."

# Frontend
gcloud run deploy civicverse-client \
  --source ./client \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

> **Note:** `FIREBASE_PRIVATE_KEY` should be added via the Cloud Run Console UI (Variables & Secrets tab) to avoid shell escaping issues with the multi-line PEM format.

---

## API Endpoints

All routes are prefixed with `/api`. Protected routes require `Authorization: Bearer <jwt>`.

| Method | Endpoint | Auth | Rate Limit | Description |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | Auth (20/15m) | Email + password registration |
| `POST` | `/api/auth/login` | ❌ | Auth (20/15m) | Email + password login |
| `POST` | `/api/auth/google` | ❌ | Auth (20/15m) | Firebase Google Sign-In |
| `POST` | `/api/auth/complete-profile` | ✅ | Auth (20/15m) | Set state, constituency, lang |
| `GET` | `/api/auth/me` | ✅ | Auth (20/15m) | Get current user profile |
| `POST` | `/api/chat` | ✅ | AI (30/15m) | AI chat with sentiment analysis |
| `GET` | `/api/journey/:userId` | ✅ | AI (30/15m) | Personalized voter journey |
| `GET` | `/api/timeline/:userId` | ✅ | AI (30/15m) | Election timeline |
| `POST` | `/api/booth` | ✅ | AI (30/15m) | Find polling booth by address |
| `POST` | `/api/scenario` | ✅ | AI (30/15m) | What-if election scenario |
| `GET` | `/api/quiz` | ✅ | AI (30/15m) | Generate quiz questions |
| `POST` | `/api/quiz/submit` | ✅ | General | Submit quiz answers |
| `POST` | `/api/translate` | ✅ | AI (30/15m) | Translate text (22 langs) |
| `POST` | `/api/user/init` | ✅ | General | Initialize user + checklist |
| `GET` | `/api/user/:userId` | ✅ | General | Get user (own profile only) |
| `GET` | `/api/checklist/:userId` | ✅ | General | Get voter checklist |
| `POST` | `/api/checklist/update` | ✅ | General | Update checklist items |
| `GET` | `/api/analytics/insights/:userId` | ✅ | General | Learning analytics |
| `GET` | `/api/health` | ❌ | General | System health status |

---

## License

This project is built for the **Google Solution Challenge 2026**. All rights reserved.

---

<p align="center">
  <strong>🗳️ CivicVerse — Empowering Digital Democracy</strong><br/>
  <em>Built with ❤️ for 950M+ Indian voters</em>
</p>
