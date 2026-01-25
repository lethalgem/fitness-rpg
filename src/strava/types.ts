// Strava API type definitions (minimal - only what we need)

export interface StravaAuthParams {
  client_id: string;
  client_secret: string;
  code?: string;
  grant_type: 'authorization_code' | 'refresh_token';
  refresh_token?: string;
}

export interface StravaTokenResponse {
  token_type: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  access_token: string;
  athlete: StravaAthlete;
}

export interface StravaAthlete {
  id: number;
  username?: string;
  firstname?: string;
  lastname?: string;
  city?: string;
  state?: string;
  country?: string;
  sex?: string;
  premium?: boolean;
  profile?: string;
  profile_medium?: string;
}

export interface StravaSummaryActivity {
  id: number;
  name?: string;
  distance?: number;
  moving_time?: number;
  elapsed_time?: number;
  total_elevation_gain?: number;
  sport_type?: string;
  start_date?: string;
  start_date_local?: string;
  timezone?: string;
  average_speed?: number;
  max_speed?: number;
  average_heartrate?: number;
  max_heartrate?: number;
  average_watts?: number;
  max_watts?: number;
  kilojoules?: number;
  trainer?: boolean;
  commute?: boolean;
  manual?: boolean;
  private?: boolean;
  suffer_score?: number;  // Strava's Relative Effort (requires detailed activity fetch)
}

export interface StravaRateLimits {
  short: { usage: number; limit: number }; // 15-minute window
  long: { usage: number; limit: number };  // daily window
}
