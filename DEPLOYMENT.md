# DocumentNest — Vercel Deployment Guide

Step-by-step instructions to deploy DocumentNest to Vercel at **₹0 cost**.

---

## Prerequisites
- A free [GitHub](https://github.com) account.
- A free [Vercel](https://vercel.com) account.

---

## 1. Push Codebase to GitHub

```bash
git add .
git commit -m "feat: complete DocumentNest web platform"
git push -u origin main
```

---

## 2. Deploy on Vercel

1. Log in to [Vercel](https://vercel.com).
2. Click **"Add New..."** → **"Project"**.
3. Select your repository.
4. Framework Preset will auto-detect as **Next.js**.
5. Click **"Deploy"**.

Vercel will compile the Next.js App Router static pages (SSG) in under 60 seconds and give you a live production URL (e.g. `https://your-project.vercel.app`).

---

## 3. Custom Domain (Optional)

In your Vercel Project Dashboard:
- Go to **Settings** → **Domains**.
- Add your custom domain (e.g. `documentnest.com`).
- Add the CNAME / A records provided by Vercel in your DNS manager.
- SSL certificates are provisioned automatically for free.
