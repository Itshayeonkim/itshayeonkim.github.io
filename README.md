# Portfolio (static site)

`index.html`, `assets/`, `works/`, `scripts/` are at the **repository root**. **GitHub Actions** copies them into a clean `site/` folder (without this README) and deploys to **GitHub Pages**.

**Live URL:** `https://itshayeonkim.github.io/`

## Setup

1. Repo **`itshayeonkim.github.io`** (public).
2. **Settings → Pages → Source:** **GitHub Actions**.
3. Push to `main`; after **Deploy GitHub Pages** succeeds, open the URL above.

### Remotes

- **`origin`** → `itshayeonkim.github.io`
- **`hayeonkim`** → optional mirror of the older `hayeonkim` repo

### Workflow

`.github/workflows/deploy-github-pages.yml` builds a `site/` artifact (static files + `.nojekyll`) so the published root is the portfolio, not `README.md`.
