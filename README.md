# Calorie Snap AI

## What is included
- `public/index.html`: mobile-friendly frontend with photo upload, AI analyze button, daily diary, calorie and macro totals.
- `server.js`: Express backend. Keeps OpenAI API key server-side and sends the image to the Responses API for analysis.
- `package.json`: dependencies.

## Run locally
1. Install Node.js (LTS).
2. In this folder, run: `npm install`
3. Create `.env` based on `.env.example`, and add your OpenAI API key.
4. Run: `npm start`
5. Open `http://localhost:3000` in a browser.

## Environment
`.env`:
```
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-6.2-astra
```

Never place your API key in the frontend HTML or publish `.env`.

## Deploy
Deploy this Node app to a hosting provider that supports Node and environment variables. Set `OPENAI_API_KEY` and optionally `OPENAI_MODEL` in the host's secret/environment settings. Then open the deployed HTTPS URL on iPhone Safari and choose Share → Add to Home Screen.

## Notes
AI estimates are approximate, especially for mixed dishes and portion sizes. Review the estimate before adding it to the diary. The frontend diary is currently stored locally in the browser.
