# Portfolio Website

Personal website built with Next.js and configured for GitHub Pages deployment.

## Local development

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3000`.

## GitHub Pages

This repository is configured to deploy from GitHub Actions to GitHub Pages.

Site URL after deployment:

```text
https://quanggd192.github.io/portfolio/
```

Required GitHub setting:

1. Open the repository on GitHub.
2. Go to `Settings` -> `Pages`.
3. Set `Source` to `GitHub Actions`.

After that, every push to `main` will trigger deployment through:

`/.github/workflows/deploy-pages.yml`

## Production build

```bash
npm run build
```

The static export is generated in `out/`.
