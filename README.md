# Pulse

Video discovery app powered by the Pexels Videos API.

---

## Stack

| Layer | Technology |
|---|---|
| UI | React 19, React Router 6 |
| State | Zustand 5 (persisted) |
| Server state | TanStack Query 5 |
| Forms | Formik + Yup |
| HTTP | Axios |
| Video playback | react-player, media-chrome |
| Styles | SCSS + BEM |
| i18n | react-i18next |
| Build | Vite + SWC |

---

## Demo

Live: https://pulse-ashy-six.vercel.app

Demo credentials are shown directly on the login screen.

---

## Features

- Demo login with credentials displayed on the login screen
- Featured feed of popular Pexels videos
- Searchable video library with orientation, size, and locale filters
- Video detail page with embedded player, quality selector, and playlist navigation
- Full SCSS/BEM styling with responsive breakpoints
- Pexels attribution in compliance with API terms (footer link and per-video author credit)

---

## Getting started

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

---

## Environment variables

| Variable | Description |
|---|---|
| `VITE_PEXELS_API_KEY` | Pexels API key — obtain at pexels.com/api |
| `VITE_DEMO_USERNAME` | Username shown as a hint on the login screen |
| `VITE_DEMO_PASSWORD` | Password shown as a hint on the login screen |

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
