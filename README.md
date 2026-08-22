This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Image & Landing Page Performance

The landing page is server-rendered: `src/app/page.tsx` reads `src/data/landing.json` at request time, so the hero image URL and the "Ghazwan Allaf" text ship in the first HTML byte and the hero is preloaded before any JavaScript runs.

### Upload optimization

- **New uploads** are auto-converted to WebP (≤2400px) by the admin upload API.
- **Existing uploads** are optimized by the migration tool:

```bash
npm run optimize-uploads        # dry-run — prints the plan, changes nothing
npm run optimize-uploads:apply  # converts to WebP q80, caps 2000px, generates
                                # -640w/-1200w/-1920w variants, dedupes identical
                                # files, rewrites landing.json refs
```

Originals are backed up to `public/uploads/_originals/`. The tool is idempotent.

**Production note:** the deploy workflow excludes `public/uploads/**`, so production assets live only on Namecheap. After deploying code changes, run the migration once on the server via cPanel terminal (`node scripts/optimize-uploads.mjs --apply`) or call the admin endpoint:

```bash
curl -X POST "https://<domain>/api/optimize" \
     -H "Authorization: Bearer <admin-token>"        # dry run
curl -X POST "https://<domain>/api/optimize?apply=1" \
     -H "Authorization: Bearer <admin-token>"        # write changes
```

### CDN (Cloudflare, free tier)

Namecheap shared hosting has limited bandwidth; a CDN in front removes that ceiling.

1. Create a free Cloudflare account, add your domain, choose the plan.
2. Cloudflare shows two nameservers — update them at your domain registrar.
3. Wait for propagation (minutes to ~24h), then in Cloudflare enable:
   - **Speed → Optimization**: HTTP/2, HTTP/3, Brotli (on by default).
   - **Caching → Cache Rules**: cache everything for `/uploads/*` with a long edge TTL (images use hashed names, safe to cache aggressively).
4. Verify: response headers on `/uploads/*.webp` should include `cf-cache-status: HIT` after the second request.

### Verifying delivery on Namecheap

```bash
# Should show Cache-Control immutable + image/webp:
curl -I https://<domain>/uploads/<hero-file>.webp
```

If headers come from Node (`X-Powered-By: Next.js` present), uncomment the rewrite block in `.htaccess` so Apache serves `/uploads` directly instead of Passenger, then re-test.
