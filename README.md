# Portfolio (static site)

Site files are in `kr-apps-benchmark/`. **GitHub Actions** deploys that folder as the **GitHub Pages** site root.

**Live URL:** `https://itshayeonkim.github.io/`

## One-time setup (user site root)

1. On GitHub: **New repository** → name **`itshayeonkim.github.io`** → **Public** → do **not** add README / .gitignore / license (empty repo).
2. From this machine (remote `origin` should point at that repo):

   ```bash
   git push -u origin main
   ```

3. Repo **Settings → Pages → Build and deployment → Source:** **GitHub Actions**.
4. **Actions** tab: wait for **Deploy GitHub Pages** to succeed, then open **`https://itshayeonkim.github.io/`**.

### Remotes

- **`origin`** → `itshayeonkim.github.io` (Pages / main push target).
- **`hayeonkim`** → previous `hayeonkim` repo (optional mirror).

### Workflow

`.github/workflows/deploy-github-pages.yml` uploads `kr-apps-benchmark/` as the published site root (`index.html`, `assets/`, etc.).
