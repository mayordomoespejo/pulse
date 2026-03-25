# Pulse

Video discovery platform powered by the Pexels API. Browse trending videos, save favorites, and track your watch history — with a smart auth flow that handles login and registration in a single form.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite + SWC |
| Styling | SCSS / BEM |
| State | Zustand 5, TanStack Query 5 |
| Auth | Firebase Auth (Email/Password + Google OAuth) |
| Data | Supabase (PostgreSQL), Pexels API |
| i18n | react-i18next (English, Spanish) |
| Routing | React Router 6 |
| Forms | Formik + Yup |
| HTTP | Axios |
| Video | react-player, media-chrome |

---

## Demo

Live: https://pulse-ashy-six.vercel.app

---

## Features

- Browse popular and trending videos via the Pexels API
- Search videos with orientation, size, and locale-aware filters
- Smart auth: a single form detects whether the email is new or returning and handles registration or login automatically
- Google OAuth login via popup flow
- Save favorites (persisted in Supabase)
- Watch history with deduplication (persisted in Supabase)
- User profile with favorites and watch history counts
- Favorite toggle from the video player page
- Animated digit counters on profile stats
- Account deletion with confirmation modal
- Language switcher (EN / ES)
- Responsive layout (mobile, tablet, desktop)
- Pexels attribution in compliance with API terms

---

## Setup

Install dependencies:

```bash
npm install
```

Copy the environment file and fill in your values:

```bash
cp .env.example .env
```

Start the dev server:

```bash
npm run dev
```

For auth, create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com) and enable the Email/Password and Google providers. For favorites and watch history, create a Supabase project at [supabase.com](https://supabase.com) — the `pulse_favorites` and `pulse_watch_history` tables are managed via Supabase Edge Functions using the service role key server-side, so no manual table setup is needed for contributors.

---

## Environment variables

| Variable | Description |
|---|---|
| `VITE_PEXELS_API_KEY` | Pexels API key — obtain at pexels.com/api |
| `VITE_FIREBASE_API_KEY` | Firebase API key — found in Project Settings > General |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain — e.g. your-project.firebaseapp.com |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_SUPABASE_URL` | Supabase project URL — found in Project Settings > API |

The Firebase variables are required for auth. The Supabase variables are required for favorites and watch history.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Lint source files |

---

## License

MIT
