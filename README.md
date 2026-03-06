# Pulse

Pulse is a React + Vite video discovery frontend built on top of the Pexels Videos API.

It includes:
- demo login flow for portfolio preview
- curated home feed
- searchable video library with pagination
- detail page with embedded playback
- attribution links required by the Pexels API terms

## Tech stack

- React 19
- React Router 6
- TanStack Query
- Axios
- Sass
- i18next

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Set your variables:

```env
VITE_PEXELS_API_KEY=your_pexels_api_key
VITE_DEMO_USERNAME=demo@pulse.dev
VITE_DEMO_PASSWORD=Pulse123!
```

The login screen shows `VITE_DEMO_USERNAME` and `VITE_DEMO_PASSWORD` as placeholders so the demo credentials are visible during preview.

### 3. Run the project

```bash
npm run dev
```

## Scripts

- `npm run dev` - start local dev server
- `npm run build` - production build
- `npm run lint` - lint source code
- `npm run preview` - preview production build

## API integration

The app uses the Pexels video endpoints:
- `GET /videos/popular`
- `GET /videos/search`
- `GET /videos/videos/:id`

Requests are authenticated with the `Authorization` header using `VITE_PEXELS_API_KEY`.

## Project structure

```text
src/
  components/
  constants/
  hooks/
  layout/
  pages/
  router/
  services/
    videos/
  stores/
  translations/
```

## Attribution

Pexels attribution is shown in the app via:
- a prominent "Videos provided by Pexels" link on listing/detail screens
- per-video author credit linking to the creator profile and media page
