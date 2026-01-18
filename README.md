# ⚔️ Fitness RPG

A fitness gamification app that turns your Strava activities into RPG stats. Level up by working out in real life!

## 🎮 Features

### Core Mechanics
- **Strava Integration**: Automatically sync all your activities from Strava
- **Three RPG Stats**: Activities contribute to **Strength**, **Endurance**, and **Agility** based on sport type
- **Intensity-Based XP**: Heart rate, power (watts), and pace all factor into XP gains
- **Level System**: Progressive leveling based on total XP earned (both overall and per-stat)
- **Background Imports**: Historical activity imports respect Strava rate limits

### Visualizations
- **3D Radar Chart**: Compare your Strength, Endurance, and Agility levels at a glance
- **Activity Breakdown**: See XP contribution by sport type with stat focus badges
- **Recent Activities Feed**: Chronological list with detailed XP breakdown

### Social Features
- **Friends System**: Search for users and send friend requests
- **Stat Comparison**: Click any friend to see overlaid radar charts (you vs them)
- **Side-by-Side Stats**: Compare levels, XP, and activity counts

### Technical
- **Flexible Configuration**: Easily modify sport-to-stat mappings and XP formulas
- **Test Coverage**: 34 unit tests protecting core stat calculations
- **Fast Imports**: 875 activities sync in ~20-30 seconds

## 🏗️ Architecture

### Tech Stack
- **Backend**: TypeScript + Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **Frontend**: Vanilla JavaScript + Chart.js
- **Framework**: Hono (lightweight web framework)
- **Deployment**: Cloudflare (free tier!)

### Project Structure
```
fitness-rpg/
├── src/
│   ├── index.ts              # Main worker entry
│   ├── cron.ts               # Background job processor
│   ├── types.ts              # TypeScript types
│   ├── config/
│   │   ├── stats.ts          # Sport → stat mapping (60+ sports)
│   │   └── xp.ts             # XP calculation config
│   ├── db/
│   │   ├── client.ts         # Database client
│   │   ├── users.ts          # User operations
│   │   ├── activities.ts     # Activity operations
│   │   ├── jobs.ts           # Import job operations
│   │   └── friendships.ts    # Friend operations
│   ├── strava/
│   │   ├── auth.ts           # OAuth logic
│   │   ├── client.ts         # API client
│   │   └── types.ts          # Strava types
│   ├── jobs/
│   │   ├── importer.ts       # Import processor
│   │   └── rate-limiter.ts   # Rate limit tracking
│   ├── stats/
│   │   ├── calculator.ts     # Stats calculation
│   │   ├── xp.ts             # XP calculation
│   │   └── __tests__/        # Unit tests (34 tests)
│   ├── routes/
│   │   ├── auth.ts           # Auth endpoints
│   │   ├── stats.ts          # Stats endpoints
│   │   └── friends.ts        # Friends endpoints
│   └── utils/
│       ├── logger.ts         # Logging
│       └── response.ts       # Response helpers
├── public/
│   ├── index.html            # Frontend HTML
│   ├── app.js                # Frontend logic
│   └── style.css             # Styles
├── schema.sql                # Database schema
├── wrangler.toml             # Cloudflare config
└── package.json              # Dependencies
```

## 🚀 Setup

### Prerequisites
- Node.js 18+
- A Cloudflare account (free tier works!)
- A Strava API application ([create one here](https://www.strava.com/settings/api))

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Strava API
1. Go to https://www.strava.com/settings/api
2. Create a new application
3. Set Authorization Callback Domain to your Cloudflare Workers domain (or `localhost` for dev)
4. Note your **Client ID** and **Client Secret**

### 3. Set Up Environment Variables
Create a `.dev.vars` file in the project root:
```bash
cp .dev.vars.example .dev.vars
```

Edit `.dev.vars` and add your Strava credentials:
```
STRAVA_CLIENT_SECRET="your_secret_here"
```

Update `wrangler.toml` with your Client ID (line 17):
```toml
STRAVA_CLIENT_ID = "your_client_id_here"
```

### 4. Initialize Database
The database ID in `wrangler.toml` already exists from your previous setup. Just run:
```bash
./scripts/init-db.sh
```

Or manually:
```bash
wrangler d1 execute fitness-rpg-db --remote --file=./schema.sql
```

### 5. Set Production Secrets
**IMPORTANT**: `.dev.vars` is only for local development. For production, set secrets via Cloudflare:

```bash
echo "your_actual_strava_secret" | wrangler secret put STRAVA_CLIENT_SECRET
```

This securely stores your secret separately from your code.

### 6. Deploy to Cloudflare
```bash
npm run deploy
```

Your app will be live at: `https://fitness-rpg.your-subdomain.workers.dev`

**Don't forget to update your Strava app's "Authorization Callback Domain" to your workers.dev domain!**

## 🛠️ Development

### Local Development
```bash
npm run dev
```

Visit `http://localhost:8787` to test locally.

### Project Commands
- `npm run dev` - Start local development server
- `npm run deploy` - Deploy to Cloudflare
- `npm run cf-typegen` - Generate Cloudflare types
- `npm run init-db` - Initialize database
- `npm test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Open interactive test UI

## ⚙️ Configuration

### Modify Sport-to-Stat Mappings
Edit [src/config/stats.ts](src/config/stats.ts):

```typescript
export const SPORT_STAT_MAPPING = {
  'Run': { strength: 0.1, endurance: 0.7, agility: 0.2 },
  'WeightTraining': { strength: 0.85, endurance: 0.1, agility: 0.05 },
  'Tennis': { strength: 0.3, endurance: 0.3, agility: 0.4 },
  // Add more sports or modify existing ones
  // Percentages must sum to 1.0 (tests will catch errors!)
};
```

**See [STATS_CONFIG.md](STATS_CONFIG.md) for detailed guide on adding new stats.**

### Adjust XP Calculation
Edit [src/config/xp.ts](src/config/xp.ts):

```typescript
// Base XP per minute of activity
export const BASE_XP_PER_MINUTE = 10;

// Heart rate zone multipliers
export const HR_ZONE_MULTIPLIERS = {
  zone1: { min: 0, max: 60, multiplier: 1.0 },
  zone2: { min: 60, max: 70, multiplier: 1.2 },
  // ...
};
```

### Change Level Progression
Currently uses formula: `level = floor(sqrt(totalXP / 1000))`

Modify in [src/config/xp.ts](src/config/xp.ts):
```typescript
export const XP_PER_LEVEL_FACTOR = 1000; // Change this
```

## 📊 How It Works

### XP Calculation
1. **Base XP**: 10 XP per minute of activity
2. **Intensity Multiplier** (1.0x - 2.0x):
   - **Heart Rate**: Best - uses HR zones (recovery to VO2 max)
   - **Power (Watts)**: For cycling - uses FTP zones
   - **Pace**: Fallback - estimated from speed
3. **Total XP** = Base XP × Intensity Multiplier

### Stat Distribution
Each sport type distributes XP across Strength, Endurance, and Agility:
- **Running** → 10% Strength, 70% Endurance, 20% Agility
- **Weight Training** → 85% Strength, 10% Endurance, 5% Agility
- **Tennis** → 30% Strength, 30% Endurance, 40% Agility
- **Cycling** → 30% Strength, 60% Endurance, 10% Agility
- **60+ sports configured** - see [src/config/stats.ts](src/config/stats.ts)

### Background Jobs
- Cron worker runs every 15 minutes
- Fetches activities in batches of 200
- Respects Strava rate limits (300/15min, 3000/day for read requests)
- Pauses automatically if rate limit approached

## 🔐 Privacy & Security

- **No sensitive data stored**: Only Strava tokens and activity metrics
- **Secure token storage**: Tokens stored in Cloudflare D1
- **Automatic token refresh**: Handles expired tokens automatically
- **Rate limit protection**: Built-in rate limiting prevents API abuse

## 🎯 Roadmap & Future Ideas

### Implemented ✅
- ✅ Three-stat system (Strength, Endurance, Agility)
- ✅ Friend system with stat comparison
- ✅ Overlaid radar charts for comparisons
- ✅ Unit test coverage for core logic

### Planned Features
- [ ] **Battle System**: Use stats to challenge friends to workout battles
- [ ] **Leaderboards**: Global and friend rankings
- [ ] **Achievements & Badges**: Unlock rewards for milestones
- [ ] **Activity Streaks**: Track consecutive days
- [ ] **Custom XP Formulas**: Per-user configuration
- [ ] **Activity Challenges**: "Run 50km this week"
- [ ] **Evolution System**: Unlock titles/abilities at level milestones
- [ ] **More Stats**: Vitality, Speed, Power, etc.
- [ ] **UI Redesign**: More inspiring/gamified interface
- [ ] **Mobile App**: Native iOS/Android experience

## 🐛 Troubleshooting

### "User not found" error
- Make sure you've connected with Strava first
- Check that userId is stored in localStorage
- Try reconnecting with Strava

### "Failed to fetch stats" error
- Verify database is initialized: `./scripts/init-db.sh`
- Check Cloudflare dashboard for D1 database
- Ensure worker is deployed: `npm run deploy`

### Activities not importing
- Check import status on dashboard
- Look at Cloudflare Workers logs for errors
- Verify Strava tokens are valid (try reconnecting)

### Rate limit errors
- Normal! Strava has strict limits
- Background jobs will resume automatically
- Check `rate_limits` table in database

## 📝 License

MIT License - feel free to use and modify!

## 🙏 Credits

- Built with [Cloudflare Workers](https://workers.cloudflare.com/)
- Powered by [Strava API](https://developers.strava.com/)
- Charts by [Chart.js](https://www.chartjs.org/)
- Framework: [Hono](https://hono.dev/)

---

**Level up IRL! 💪🏃⚔️**
