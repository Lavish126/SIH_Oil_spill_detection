# Deployment Guide

This project is fully configured for deployment across all major static hosting platforms and container environments.

---

## 1. Deploying to Vercel (Recommended for Quick Setup)

### Option A: Vercel Dashboard (1-Click Git Integration)
1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Import your repository.
4. Framework Preset will automatically detect **Vite**.
5. Click **Deploy**.

### Option B: Vercel CLI
```bash
npm install -g vercel
vercel
```

> **Note:** SPA rewrite routing is pre-configured in [`vercel.json`](file:///c:/Users/Admin/Desktop/sih/vercel.json).

---

## 2. Deploying to Netlify

### Option A: Netlify Dashboard
1. Push your code to GitHub.
2. Go to [Netlify App](https://app.netlify.com/).
3. Select **Add new site** > **Import an existing project**.
4. Set Build command: `npm run build` and Publish directory: `dist`.
5. Click **Deploy site**.

### Option B: Netlify CLI
```bash
npm install -g netlify-cli
netlify deploy --prod
```

> **Note:** SPA fallback routing rules are pre-configured in [`netlify.toml`](file:///c:/Users/Admin/Desktop/sih/netlify.toml) and [`public/_redirects`](file:///c:/Users/Admin/Desktop/sih/public/_redirects).

---

## 3. Containerized Deployment with Docker (Render, AWS, Railway, GCP, Azure, Fly.io)

### Local Docker Build & Test
```bash
# Build the Docker image
docker build -t sih-app .

# Run container on port 8080
docker run -p 8080:80 sih-app
```
Access the application at `http://localhost:8080`.

> **Features:**
> - Multi-stage build with `node:20-alpine` and `nginx:alpine`.
> - Pre-configured gzip compression and SPA fallback routing in [`nginx.conf`](file:///c:/Users/Admin/Desktop/sih/nginx.conf).

---

## 4. Deploying to GitHub Pages

### Automatic Deployment via GitHub Actions
1. Push your project to GitHub.
2. Navigate to repository **Settings** > **Pages**.
3. Under **Source**, select **GitHub Actions**.
4. Every push to `main` or `master` will automatically trigger [`deploy.yml`](file:///c:/Users/Admin/Desktop/sih/.github/workflows/deploy.yml) and deploy your app.

---

## Production Build Verification

To verify the production build locally at any time:
```bash
npm run build
npm run preview
```
