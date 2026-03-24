# Pulse

Video discovery app powered by the Pexels API. Browse trending videos, save favorites, and track your watch history.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite + SWC |
| Styling | SCSS/BEM |
| State | Zustand 5, TanStack Query 5 |
| Auth | Supabase (Email OTP + Google OAuth) |
| Data | Supabase (PostgreSQL), Pexels API |
| i18n | react-i18next (English, Spanish) |
| Routing | React Router 6 |
| Forms | Formik + Yup |
| HTTP | Axios |
| Video | react-player, media-chrome |

---

## Demo

Live: https://pulse-ashy-six.vercel.app

Demo credentials are shown directly on the login screen.

---

## Features

- Browse popular and trending videos via Pexels API
- Search videos with orientation, size, and locale-aware filters
- Save favorites (persisted in Supabase)
- Watch history with deduplication (persisted in Supabase)
- User profile with favorites and watch history counts
- Email OTP login (passwordless)
- Google OAuth login (popup flow)
- Favorite toggle from the video player page
- Animated digit counters on profile stats (YouTube-style)
- Account deletion with confirmation modal
- Responsive design (mobile, tablet, desktop)
- Language switcher (EN / ES)
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

If you want to use Supabase features (auth, favorites, watch history), create a project at [supabase.com](https://supabase.com), then run the schema in the SQL editor:

```
# File: src/services/supabase/schema.sql
```

---

## Environment variables

| Variable | Description |
|---|---|
| `VITE_PEXELS_API_KEY` | Pexels API key — obtain at pexels.com/api |
| `VITE_SUPABASE_URL` | Supabase project URL — found in Project Settings > API |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key — found in Project Settings > API |
| `VITE_DEMO_USERNAME` | Email shown as a hint on the login screen |
| `VITE_DEMO_PASSWORD` | Password shown as a hint on the login screen |

The Supabase variables are required for Google OAuth, favorites, and watch history. Without them the app falls back to demo-only mode.

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
