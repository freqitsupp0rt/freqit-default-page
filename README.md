# freqit-default-page

Animated 404 page shown for the bare public IP and any unknown host behind Traefik.
Every path returns **HTTP 404** with this page (assets under `/assets/` load normally).

## Local preview
```bash
npm install
npm run dev
```

## Deploy (Coolify)
- Build pack: **Dockerfile**, Ports Exposes: **80**
- **No domain** — Traefik's catch-all router (`default-deny.yaml`) points at this container
- Healthcheck: off (every path intentionally returns 404)

## Customising
- Text / company link: `src/App.jsx`
- Colours & animation timing: `src/index.css`
- Effects: `src/components/` (FuzzyText, Particles, Aurora, ShinyText)
