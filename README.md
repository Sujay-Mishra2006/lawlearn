# LexLearn

LexLearn is a React/Vite educational website for learning Indian law topics.

## Run Locally

Install Node.js first, then run:

```bash
npm install
npm run dev
```

In a second terminal, start the AI backend:

```bash
cd server
npm install
copy .env.example .env
npm start
```

Edit `server/.env` and set `GEMINI_API_KEY` to a valid Gemini API key. The Vite dev server proxies AI requests from `/api/ask` to `http://localhost:5000/ask`.

The backend defaults to `gemini-3.5-flash-lite`. If your Render backend has a `GEMINI_MODEL` environment variable, set it to `gemini-3.5-flash-lite` or remove it so the code default is used. Old values such as `gemini-2.5-flash` can cause 404 model errors.

For a deployed frontend, set `VITE_LEXAI_ENDPOINT` to your deployed backend URL, for example:

```bash
VITE_LEXAI_ENDPOINT=https://your-backend.example.com/ask
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
