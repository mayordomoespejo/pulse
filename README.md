# Pulse

Pulse is a React + Vite video discovery app powered by the [Pexels Videos API](https://www.pexels.com/api/).

## Features

- Demo login with credentials shown on the login screen
- Featured feed of popular Pexels videos
- Searchable video library with orientation, size, and locale filters
- Video detail page with an embedded player, quality selector, and playlist navigation
- Full SCSS/BEM styling with responsive breakpoints
- Pexels attribution as required by their API terms

## Tech stack

| Layer | Library |
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

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then fill in the values:

```env
VITE_PEXELS_API_KEY=your_pexels_api_key
VITE_DEMO_USERNAME=demo@pulse.dev
VITE_DEMO_PASSWORD=Pulse123!
```

> The login screen reads `VITE_DEMO_USERNAME` / `VITE_DEMO_PASSWORD` and renders them as visible hints so the demo is immediately usable.

### 3. Run the dev server

```bash
npm run dev
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Lint source files |

## API integration

All requests hit the Pexels Videos API via `src/services/apiClient.js`. The `Authorization` header is set from `VITE_PEXELS_API_KEY`.

Active endpoints:

| Method | Path | Used for |
|---|---|---|
| GET | `/videos/popular` | Featured feed |
| GET | `/videos/search` | Video library |
| GET | `/videos/videos/:id` | Video detail |

## Project structure

```text
src/
  assets/          Icons and static assets
  components/
    common/        Generic layout helpers (List, EmptyState, …)
    player/        Player and playlist components
    ui/            Design-system primitives (Button, Input, Modal, …)
    video/         Video card and display components
  constants/       App-wide constants and Pexels filter definitions
  helpers/         Date and theme utilities
  hooks/           Custom React hooks
  layout/          Route-level layout wrappers
  pages/           Page components (FeaturedPage, VideoManage, PlayerPlaylistPage, …)
  router/          createBrowserRouter setup and route names
  services/
    auth/          Demo login service
    videos/        Pexels fetch functions and response mappers
  stores/          Zustand stores (video player state)
  translations/    i18next locale files
  utils/           Pure utility functions (colors, thumbnail generation)
```

## Attribution

Per the Pexels API terms every screen that displays Pexels content includes:

- A **"Videos provided by Pexels"** link in the footer
- Per-video author credit linking to the photographer's Pexels profile
