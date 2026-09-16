# 13: $0.00 Zero-Budget Infrastructure, APIs & Tooling Blueprint

---

## 1. Architectural Philosophy: The Dual-Engine Model

To ensure a permanent **$0.00 operating cost**—eliminating hosting fees, API surprise bills, credit card requirements, database maintenance, and legal exposure—the platform is designed around a **Dual-Engine Architecture**:

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           TAROT APPLICATION                              │
├──────────────────────────────────────────────────────────────────────────┤
│ 1. AUTONOMOUS BASE ENGINE (100% Free, Zero Setup, Zero Accounts)         │
│    • 78 Bundled 1909 RWS Cards (Optimized WebP, ~2.7 MB total)           │
│    • Procedural Algorithmic Interpretation Engine (Elemental Dignities)  │
│    • Native Web Audio API Procedural Soundscape (0 KB audio downloads)   │
│    • Client-Side IndexedDB Storage (Dexie.js / Zero-Knowledge Privacy)   │
│    • Operates 100% offline as a Progressive Web App (PWA)                │
├──────────────────────────────────────────────────────────────────────────┤
│ 2. OPTIONAL ENHANCEMENT ENGINE (Bring-Your-Own-Key / BYOK Client AI)     │
│    • User-provided Google AI Studio Key (Gemini 2.0 Flash / 1,500 RPD)   │
│    • User-provided Groq Key (Llama 3.3 70B / Ultra-fast LPU inference)   │
│    • Stored strictly in user's browser localStorage                      │
│    • Direct browser-to-API fetch (Zero backend proxy required)           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Comprehensive Tool & Service Audit

### 2.1 AI & Synthesis Engines

| Engine / Provider | Cost | Rate Limits / Quotas | Credit Card Required? | Privacy & Gotchas |
| :--- | :--- | :--- | :--- | :--- |
| **Procedural Combinatorial Engine** (Built-in) | **$0.00** | **Unlimited** (Runs locally in JS) | **NO** | 100% private, zero latency, runs offline. |
| **Google AI Studio (Gemini 2.0 Flash)** | **$0.00** | **15 RPM**, **1,500 RPD**, 1M TPM | **NO** | Free tier prompts used for model training; personal API key only. |
| **GroqCloud (Llama 3.3 70B)** | **$0.00** | **30 RPM**, **1,000 RPD** | **NO** | Ultra-fast inference (500+ tokens/sec); OpenAI-compatible endpoint. |
| **Cloudflare Workers AI** | $0.00 | 10,000 Neurons/day (~30 readings/day) | NO | Daily limit too low for multi-user shared site. |

### 2.2 Public Domain Artwork & Asset Management

* **Legal Status**: Pamela Colman Smith passed away in September 1951. Under international copyright law (Life + 70 years), the original December 1909 Rider-Waite-Smith artwork entered the public domain worldwide on **January 1, 2022** (and prior to 1929 in the US).
* **Crucial Legal Precaution**: Modern recolored editions (e.g., Mary Hanson-Roberts *Universal Waite* from 1990) hold active copyrights by U.S. Games Systems. We must strictly use authentic scans of the 1909 first edition.
* **Optimization**: 78 cards compressed to WebP format (600×1030 px) total **~2.7 MB**, bundled directly into the app repository. No external CDN or image hosting required.

### 2.3 Hosting & Database

| Platform | Cost | Specs | Verdict |
| :--- | :--- | :--- | :--- |
| **Cloudflare Pages** | **$0.00** | **Unlimited Bandwidth**, Free SSL, Custom Domains | ⭐ **Gold Standard**: Zero overage risk, immune to viral traffic spikes. |
| **GitHub Pages** | **$0.00** | 100GB/mo soft bandwidth limit, 1GB repo limit | ⭐ **Excellent**: Native Git integration, zero external services. |
| **Vercel Hobby** | $0.00 | 100GB bandwidth/mo, execution hour caps | ⚠️ Risk: Sudden viral traffic or asset scraping can trigger overage alerts. |
| **Supabase Free** | $0.00 | 500MB DB, 1GB Storage | ❌ **Unsuitable**: Free tier pauses after 7 days of inactivity. |
| **Dexie.js (IndexedDB)** | **$0.00** | Uses client browser storage (Gigabytes available) | ⭐ **Gold Standard**: Zero server cost, zero GDPR liability, 100% private. |

---

## 3. What the User Needs to Provide

### Category A: To Develop & Run Locally Right Now
* **Requirements**: **ABSOLUTELY NOTHING**. 
* The entire platform (UI, 3D physics, procedural readings, sound synthesis, local journal) runs completely self-contained on your local machine using Node.js.

### Category B: To Deploy to the Live Internet (100% Free)
1. **GitHub Account (Free)**: To host the code repository.
2. **Cloudflare Account (Free, No Credit Card)**: Connects to your GitHub repository and deploys via Cloudflare Pages with unlimited free bandwidth.

### Category C: If You Want Conversational AI Readings (Optional)
1. **Google AI Studio API Key (Free, No Credit Card)**:
   * Generated in 30 seconds at `https://aistudio.google.com/apikey`.
   * Can be entered directly into the app settings modal (or configured in a `.env.local` file).
   * Provides 1,500 free requests per day.
