# Margin — A journal for the curious

An editorial-style blog built with **Next.js App Router, React, MongoDB, Mongoose, and Better Auth**. It includes public post browsing, About page, email/password signup and login, authenticated writing, owner-only edit/delete, full-text-style filtering over titles/content/tags, categories/tags, Markdown/GFM rendering, comments, appreciations, readable slugs, responsive layouts, theme switching, metadata, sitemap, and a branded favicon.

## Run locally

1. Install Node.js 20.9+ (Node 22 recommended).
2. Install MongoDB locally or create a MongoDB Atlas database.
3. Copy `.env.example` to `.env.local` and fill in the values in your own environment. Do not paste secrets into source files or commit `.env.local`.
4. Install and start:

   ```bash
   npm install
   npm run dev
   ```

5. Open `http://localhost:3000`.

Generate a strong Better Auth secret, for example with `openssl rand -base64 32`. Keep it in `.env.local` and the host's environment settings only. Set `BETTER_AUTH_URL` and `NEXT_PUBLIC_SITE_URL` to your local or deployed site URL as appropriate.

## Main routes

- `/` — home and recent stories
- `/about` — project/about page
- `/blogs` — public archive with search and tag filters
- `/blogs/[slug]` — a full post
- `/sign-in`, `/sign-up` — account forms
- `/write` — authenticated authoring interface
- `/api/auth/[...all]` — Better Auth handlers

## Deploy

1. Create a private or public repository on GitHub and push this directory.
2. Import the repository into Vercel (or another host supporting Next.js).
3. Add `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, and `NEXT_PUBLIC_SITE_URL` to the hosting provider's environment-variable settings. Use the final HTTPS domain for the URL variables.
4. Deploy, then check signup, login, publishing, edit/delete ownership, and responsive pages on the live URL.
5. Never commit `.env.local`, MongoDB credentials, auth secrets, or production database backups.

## Security notes

- `.gitignore` ignores local env files and build outputs. Only `.env.example` is committed, with placeholders.
- Post create/update/delete and engagement mutations verify the current Better Auth session on the server.
- Authors can update or remove only posts whose `authorId` matches their session user ID.
- Markdown is rendered through `react-markdown` (not raw HTML).
- This repository contains no real connection string or API secret.

## Extra features beyond the core guide

Global search, tags/categories, Markdown/GFM, theme switching, readable slugs, comments and likes, responsive navigation/layouts, dynamic page metadata, branded favicon, custom art direction and a 404 experience.