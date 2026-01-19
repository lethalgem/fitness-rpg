# Fitness RPG

A gamified fitness tracking application that turns Strava activities into RPG stats and XP. Users compete on leaderboards and track their fitness journey with friends.

## Tech Stack

- **Runtime**: Cloudflare Workers
- **Framework**: Hono (lightweight web framework)
- **Database**: Cloudflare D1 (SQLite)
- **Language**: TypeScript
- **External API**: Strava API v3
- **Deployment**: Wrangler CLI

## Architecture Overview

### Application Structure

```
src/
├── routes/          # API route handlers (Hono routers)
├── db/             # Database repositories (data access layer)
├── strava/         # Strava API integration (auth + client)
├── jobs/           # Background job processors
├── stats/          # Stats calculation logic
├── utils/          # Shared utilities (logger, response helpers)
├── cron.ts         # Scheduled task handler
├── index.ts        # Main entry point
└── types.ts        # TypeScript types and interfaces
```

### Key Design Patterns

**Repository Pattern**: Database access is encapsulated in repository classes:

- `UserRepository` - User CRUD operations
- `ActivityRepository` - Activity management with batch upsert
- `UserStatsRepository` - Stats caching and retrieval
- `JobRepository` - Import job tracking
- `FriendshipRepository` - Friend relationship management

**Response Helpers**: Consistent API responses via `utils/response.ts`:

- `success(data)` - 200 with { success: true, data }
- `error(message, code)` - Error response with status code
- `notFound(message)` - 404 response
- `unauthorized(message)` - 401 response

**Database Client Wrapper**: `DatabaseClient` class wraps D1 with convenience methods:

- `first<T>()` - Get single row
- `all<T>()` - Get multiple rows
- `run()` - Execute statement
- `batch()` - Batch operations
- `transaction()` - Transactional operations

## Strava Integration

### Authentication Flow

1. User clicks "Connect with Strava"
2. Redirected to Strava OAuth (`/auth/strava/connect`)
3. Callback receives code (`/auth/strava/callback`)
4. Exchange code for tokens (access + refresh)
5. Store user with tokens in database

**Token Management**:

- Tokens expire every 6 hours
- `StravaAuth.ensureValidToken()` auto-refreshes when needed
- 10-minute buffer before expiration for safety

### Activity Syncing - Three Methods

#### 1. Real-time Webhooks (Primary) ⚡

- **Endpoint**: `POST /webhooks/strava`
- **Verification**: `GET /webhooks/strava` (responds to hub.challenge)
- **Subscription ID**: 326016
- **Events**: activity.create, activity.update, activity.delete, athlete.deauthorize
- **Processing**: Responds in <2s, then uses `waitUntil()` for background processing
- **Stats Update**: Automatically recalculates both all-time and weekly stats after each event

#### 2. Manual Sync (On-demand) 🔄

- **Endpoint**: `POST /sync/{userId}`
- **Optimization**: Only fetches activities after most recent activity
- **Quick check**: Verifies new activities exist before creating job
- **Background processing**: Uses cron job processor via `waitUntil()`

#### 3. Cron Job (Fallback) ⏰

- **Schedule**: Every 15 minutes (`*/15 * * * *`)
- **Tasks**:
  - Process pending import jobs (page by page)
  - Cache all user stats (all-time + weekly)
  - Clean up old rate limit records
- **Rate limit aware**: Pauses jobs when approaching Strava limits

### Rate Limiting

Strava API limits:

- **Short term**: 600 requests per 15 minutes
- **Long term**: 6000 requests per day

Tracking via `rate_limits` table with automatic cleanup.

## Database Schema

### Core Tables

- **users**: User accounts with Strava tokens
- **activities**: Imported Strava activities (deduped by strava_activity_id)
- **user_stats**: Cached stats for performance (UNIQUE constraint on user_id, stat_type, time_period)
- **import_jobs**: Background sync job tracking
- **friendships**: Friend relationships (bidirectional with status)
- **rate_limits**: Strava API usage tracking

### Stats System

**Stat Types**: strength, endurance, agility, overall
**Time Periods**: all_time, weekly

Stats are calculated from activities based on sport type mappings in `stats/config.ts`:

- **79 Strava activity types** mapped to 3 core stats
- Different sports contribute to different stats with percentage distributions
- XP system with linear level progression (3,000 XP per level)
- Cached for performance, recalculated on activity changes

#### The 3-Stat System (INTENTIONAL DESIGN DECISION)

**Why 3 stats?**
The system uses Strength, Endurance, and Agility specifically to:
1. **Keep it simple**: Easy to understand and strategize
2. **Clear fitness goals**: Each stat maps to obvious workout categories
3. **Support specialization**: Users can build distinct athlete profiles
4. **Enable future racing**: Sufficient for Chao Garden-style racing minigames

**Stat Mappings Philosophy**:
- **Strength** (Power): Weight training, climbing, resistance activities
- **Endurance** (Stamina): Running, cycling, swimming, sustained cardio
- **Agility** (Skill): Ball sports, HIIT, activities requiring directional changes

**Coverage**: All 79 Strava activities are thoughtfully mapped with validated percentage distributions. Examples:
- Run: 10% strength, 70% endurance, 20% agility
- WeightTraining: 85% strength, 10% endurance, 5% agility
- Tennis: 30% strength, 30% endurance, 40% agility
- Swim: 40% strength, 50% endurance, 10% agility

**Do NOT expand to more stats** without explicit discussion. The 3-stat system was chosen after analysis of racing minigame requirements and fitness motivation clarity. See `/plans/stat-system-analysis.md` for full reasoning.

## Important Implementation Details

### Webhook Event Processing

```typescript
// Fast acknowledgment (< 2s requirement)
c.executionCtx.waitUntil(processWebhookEvent(env, event));
return success({ message: "Event received" });

// Background processing:
// 1. Find user by owner_id (Strava ID)
// 2. Refresh token if needed
// 3. Fetch full activity details
// 4. Upsert to database (handles create/update)
// 5. Recalculate stats (all-time + weekly)
```

### Stats Caching Issue (FIXED)

Early implementation had UNIQUE constraint conflict when caching stats. **Solution**: Changed from transaction-based batch insert to sequential inserts with proper `ON CONFLICT` handling. Schema ensures `UNIQUE(user_id, stat_type, time_period)`.

### Activity Import Optimization

- Uses `after` timestamp to only fetch new activities
- Batch upsert with `ON CONFLICT` for idempotency
- Pagination handles large activity histories
- Rate limit checking prevents API throttling

## Environment Variables

### Required Secrets (via Wrangler)

- `STRAVA_CLIENT_SECRET` - Strava OAuth secret

### Public Variables (wrangler.toml)

- `STRAVA_CLIENT_ID` - Strava OAuth client ID
- `STRAVA_WEBHOOK_VERIFY_TOKEN` - Webhook verification token
- `FRONTEND_URL` - URL for OAuth redirects

## Useful Commands

```bash
# Development
npm run dev                    # Local development server
npm run deploy                 # Deploy to production

# Webhooks
npm run webhook:subscribe      # Subscribe to Strava webhooks
npm run webhook:list          # List active subscriptions
npm run webhook:unsubscribe   # Remove subscription

# Maintenance
npm run sync:all-users        # Force sync all users (respects rate limits)

# Database
wrangler d1 execute fitness-rpg-ts --remote --file=./schema.sql
```

## API Endpoints

### Authentication

- `GET /auth/strava/connect` - Start OAuth flow
- `GET /auth/strava/callback` - OAuth callback

### Stats & Activities

- `GET /stats/:userId` - Get user stats (includes activities, job status)
- `GET /stats/:userId/activities` - Paginated activities
- `POST /sync/:userId` - Trigger manual sync

### Social Features

- `POST /friends/request` - Send friend request
- `GET /friends/:userId` - List friends
- `GET /friends/search` - Search users by name/username
- `POST /friends/:userId/accept` - Accept friend request

### Leaderboards

- `GET /leaderboard/global` - Global leaderboards (all-time/weekly)
- `GET /leaderboard/friends/:userId` - Friends leaderboard

### Webhooks (Strava)

- `GET /webhooks/strava` - Verification endpoint
- `POST /webhooks/strava` - Event receiver

### Utility

- `GET /health` - Health check
- `GET /cron/trigger` - Manual cron trigger (testing)
- `GET /cron/cache-stats` - Manual stats cache (testing)

## Frontend Integration

Frontend is served from `public/` directory via Cloudflare Workers Assets binding. The app uses vanilla JavaScript with API calls to the backend routes.

## Code Style Preferences

- **Error handling**: Use try-catch with proper logging
- **Database queries**: Always use parameterized queries (SQL injection prevention)
- **Async patterns**: Prefer async/await over promises
- **Logging**: Use `log()` and `error()` from utils/logger
- **Types**: Strict TypeScript, avoid `any` when possible
- **Comments**: Focus on "why" not "what" - code should be self-documenting

## Recent Changes

- **2026-01-19**: Fixed progress bar segmentation for better UX motivation
  - One-to-one mode (1-10 workouts) now always shows 10 segments
  - Filled segments = progress made, empty segments = workouts remaining
  - Mobile responsive with flexible segment sizing
- **2026-01-19**: Completed stat system analysis for future racing minigame
  - Decided to keep 3-stat system (Strength/Endurance/Agility)
  - Documented design rationale in `/plans/stat-system-analysis.md`
  - Updated CLAUDE.md with stat system philosophy
- **2026-01-17**: Implemented Strava webhook integration for real-time activity updates
- **2026-01-17**: Fixed user_stats UNIQUE constraint issue (added time_period to constraint)
- **2026-01-17**: Created force-sync-all-users script for one-time bulk syncing

## Future Features

### Racing Minigame (Planned - Chao Garden Style)

**Inspiration**: Sonic Adventure 2 Chao Garden races
**Status**: Stat system designed with racing in mind - ready for implementation

**Race Design Concepts**:
- **Marathon Races**: Long straightaways testing Endurance
- **Obstacle Courses**: Walls, barriers, climbing testing Strength
- **Technical Circuits**: Tight corners, zigzags testing Agility
- **Triathlons**: Mixed segments rewarding balanced builds

**Mechanics**:
- Stats influence race performance in specific segments
- Specialization bonuses (e.g., 2x one stat = specialist boost)
- All-rounder bonuses for balanced stats
- Cosmetic Chao customization based on stat builds

**Design Philosophy**: The 3-stat system (Strength/Endurance/Agility) is sufficient for engaging races. Do not expand stats without re-reading the analysis in `/plans/stat-system-analysis.md`.

## Known Issues & Future Improvements

- Webhook events may have slight delay after subscription (Strava propagation time)
- Consider adding webhook signature verification (HMAC-SHA256) for additional security
- Could optimize stats calculation with incremental updates instead of full recalculation

DISTILLED_AESTHETICS_PROMPT = """
<frontend_aesthetics>
You tend to converge toward generic, "on distribution" outputs. In frontend design, this creates what users call the "AI slop" aesthetic. Avoid this: make creative, distinctive frontends that surprise and delight. Focus on:

Typography: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics.

Color & Theme: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes. Draw from IDE themes and cultural aesthetics for inspiration.

Motion: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions.

Backgrounds: Create atmosphere and depth rather than defaulting to solid colors. Layer CSS gradients, use geometric patterns, or add contextual effects that match the overall aesthetic.

Avoid generic AI-generated aesthetics:

- Overused font families (Inter, Roboto, Arial, system fonts)
- Clichéd color schemes (particularly purple gradients on white backgrounds)
- Predictable layouts and component patterns
- Cookie-cutter design that lacks context-specific character

Interpret creatively and make unexpected choices that feel genuinely designed for the context. Vary between light and dark themes, different fonts, different aesthetics. You still tend to converge on common choices (Space Grotesk, for example) across generations. Avoid this: it is critical that you think outside the box!
</frontend_aesthetics>
"""
