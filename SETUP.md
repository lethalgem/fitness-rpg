# 🚀 Quick Setup Guide

Follow these steps to get your Fitness RPG up and running!

## Step 1: Get Your Strava Credentials

1. Go to https://www.strava.com/settings/api
2. Click "Create App" (or use existing app)
3. Fill in the form:
   - **Application Name**: Fitness RPG (or whatever you want)
   - **Category**: Training
   - **Website**: Your Cloudflare Workers URL (or localhost for testing)
   - **Authorization Callback Domain**: `localhost,your-subdomain.workers.dev` (comma-separated)
4. Save and note your **Client ID** and **Client Secret**

## Step 2: Configure Environment

Create `.dev.vars` file with your secret:
```bash
cp .dev.vars.example .dev.vars
```

Edit `.dev.vars`:
```
STRAVA_CLIENT_SECRET="your_actual_secret_here"
```

Edit `wrangler.toml` line 17:
```toml
STRAVA_CLIENT_ID = "your_actual_client_id_here"
```

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Initialize Database

Your D1 database is already created (ID in wrangler.toml). Just run the schema:

```bash
./scripts/init-db.sh
```

Or manually:
```bash
wrangler d1 execute fitness-rpg-db --remote --file=./schema.sql
```

## Step 5: Test Locally (Optional)

```bash
npm run dev
```

Visit http://localhost:8787 and try connecting with Strava!

**Note**: Local development uses a remote D1 database. Make sure you've initialized it first.

## Step 6: Set Production Secrets

**IMPORTANT**: The `.dev.vars` file is only for local development. For production, you must set secrets via Cloudflare:

```bash
echo "your_actual_strava_secret" | wrangler secret put STRAVA_CLIENT_SECRET
```

This securely stores your secret in Cloudflare (separate from your code). **Never commit secrets to git!**

## Step 7: Deploy to Production

```bash
npm run deploy
```

Your app will be live at: `https://fitness-rpg.YOUR_SUBDOMAIN.workers.dev`

Update your Strava app's "Authorization Callback Domain" to include your workers.dev domain (just the domain, no protocol):
```
your-subdomain.workers.dev
```

**Note**: Remove `localhost,` from the callback domain for production, or it may cause OAuth errors.

## Step 8: Update Redirect URL

In `wrangler.toml`, update the FRONTEND_URL:
```toml
FRONTEND_URL = "https://fitness-rpg.YOUR_ACTUAL_SUBDOMAIN.workers.dev"
```

Then redeploy:
```bash
npm run deploy
```

## Step 9: Connect Your Strava!

Visit your deployed URL and click "Connect with Strava". Your activities will start importing immediately!

## Troubleshooting

### "redirect_uri mismatch" error
- Make sure your Strava app's "Authorization Callback Domain" includes your Workers domain
- Check that FRONTEND_URL in wrangler.toml matches your actual deployment URL

### "Database not found" error
- Run `./scripts/init-db.sh` to initialize the schema
- Check that database_id in wrangler.toml matches your D1 database

### "client_secret invalid" error
- You forgot to set the production secret! Run:
  ```bash
  echo "your_actual_strava_secret" | wrangler secret put STRAVA_CLIENT_SECRET
  ```
- The `.dev.vars` file is NOT used in production

### Activities not importing
- Check Cloudflare dashboard > Workers & Pages > Your Worker > Logs
- Look for errors in the cron trigger logs
- Verify your Strava tokens are valid by trying to reconnect

## Next Steps

- Customize sport-to-stat mappings in [src/config/stats.ts](src/config/stats.ts)
- Adjust XP formulas in [src/config/xp.ts](src/config/xp.ts)
- Add your friends and start competing!

---

**Have fun and level up! 💪🏃⚔️**
