# LexLearn

LexLearn is a React/Vite educational website for learning Indian law topics.

## Run Locally

Install Node.js first, then run:

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy To GitHub Pages

1. Create a new GitHub repository named `lawlearn`.
2. Push this folder to the repository.
3. In GitHub, open the repository settings.
4. Go to Pages.
5. Under Build and deployment, set Source to GitHub Actions.
6. Push to the `main` branch. The workflow in `.github/workflows/deploy.yml` will build and publish the site.

## Important

The current AI feature should not call a paid AI API directly from browser code. Use a backend server or serverless function if you want live AI answers in production.

The admin mode is a frontend demo only. Do not use client-side passwords for real content management, because visitors can inspect frontend JavaScript.
