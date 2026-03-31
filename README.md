# Portfolio (static site)

The site lives in `kr-apps-benchmark/` and is deployed with **GitHub Actions** to **GitHub Pages**.

## URL: `https://itshayeonkim.github.io/`

GitHub serves a **user site** only from a repository named **`Itshayeonkim.github.io`** (same as `username.github.io`).

1. On GitHub, create a repository **`Itshayeonkim.github.io`** (public).
2. Push this project’s **`main`** branch to that repo (or rename/move your existing repo to that name).
3. In the repo: **Settings → Pages → Build and deployment → Source**: select **GitHub Actions** (not “Deploy from a branch” unless you switch to Actions-only flow).
4. Push to `main` (or run the workflow manually). After the workflow succeeds, open **`https://itshayeonkim.github.io/`**.

### If you keep another repo name (e.g. `hayeonkim`)

The site URL becomes **`https://itshayeonkim.github.io/hayeonkim/`** (project site). To use the root URL above, use the **`Itshayeonkim.github.io`** repository.

### Workflow file

`.github/workflows/deploy-github-pages.yml` uploads the `kr-apps-benchmark` folder as the site root so `index.html` and `assets/` paths stay correct.
