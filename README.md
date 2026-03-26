# WCTL Liens AI — Deployment Guide

## Deploy to Vercel (recommended, ~5 min)

### 1. Push to GitHub
```bash
cd wctl-liens-app
git init
git add .
git commit -m "Initial commit"
gh repo create wctl-liens-app --private --push
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your `wctl-liens-app` GitHub repo
3. Click **Deploy** (no build config needed — Vercel auto-detects Next.js)

### 3. Add your API key
1. In Vercel dashboard → **Settings → Environment Variables**
2. Add: `ANTHROPIC_API_KEY` = `sk-ant-...`
3. Click **Redeploy**

Done. Your team URL will be: `https://wctl-liens-app.vercel.app`

---

## Run locally
```bash
npm install
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY
npm run dev
# Open http://localhost:3000
```

---

## Project structure
```
wctl-liens-app/
├── app/
│   ├── layout.js           # HTML shell
│   ├── page.js             # Entry point
│   └── api/
│       └── chat/
│           └── route.js    # ← Backend: proxies Anthropic API (key stays server-side)
├── components/
│   └── LiensApp.jsx        # ← All UI: AI chat, Subro Lookup, Offer Calc, Workflow
├── .env.example            # Copy to .env.local, add your API key
├── next.config.js
└── package.json
```

---

## Updating the AI's knowledge
All lien knowledge (formulas, contacts, workflow, documents) lives in the `SYSTEM_PROMPT`
constant inside `app/api/chat/route.js`. Edit that file and redeploy to update.

---

## Optional: restrict access
Add Vercel Password Protection (Pro plan) or Vercel Access Groups to keep it internal.
Or add a simple passphrase check in `app/api/chat/route.js`:
```js
const { messages, passphrase } = await request.json();
if (passphrase !== process.env.APP_PASSPHRASE) {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
```
