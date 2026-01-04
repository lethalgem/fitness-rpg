// Core application types for Fitness RPG

// Cloudflare Worker environment bindings
export interface Env {
  DB: D1Database;
  STRAVA_CLIENT_ID: string;
  STRAVA_CLIENT_SECRET: string;
  FRONTEND_URL: string;
  ASSETS?: Fetcher; // For static file serving
}

// Database models
export interface User {
  id: number;
  strava_id: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  profile_url?: string;
  access_token: string;
  refresh_token: string;
  expires_at: number;
  created_at: number;
  updated_at: number;
}

export interface Activity {
  id: number;
  user_id: number;
  strava_activity_id: string;
  name?: string;
  sport_type: string;
  start_date?: string;
  start_date_local?: string;
  distance?: number;
  moving_time?: number;
  elapsed_time?: number;
  total_elevation_gain?: number;
  average_speed?: number;
  max_speed?: number;
  average_heartrate?: number;
  max_heartrate?: number;
  average_watts?: number;
  max_watts?: number;
  kilojoules?: number;
  created_at: number;
}

export interface ImportJob {
  id: number;
  user_id: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'paused';
  total_activities: number;
  imported_activities: number;
  current_page: number;
  last_activity_date?: string;
  after_timestamp?: number; // Only fetch activities after this epoch timestamp
  error_message?: string;
  started_at?: number;
  completed_at?: number;
  created_at: number;
  updated_at: number;
}

export interface UserStats {
  id: number;
  user_id: number;
  stat_type: string;
  stat_value: number;
  total_xp: number;
  level: number;
  activities_count: number;
  updated_at: number;
}

export interface RateLimit {
  id: number;
  window_start: number;
  window_type: '15min' | 'daily';
  requests_count: number;
  created_at: number;
}

export interface Friendship {
  id: number;
  user_id: number;
  friend_id: number;
  status: 'pending' | 'accepted' | 'declined' | 'blocked';
  requester_id: number;
  created_at: number;
  updated_at: number;
}

// Strava API types (minimal - only fields we need)
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
  profile?: string;
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
  average_speed?: number;
  max_speed?: number;
  average_heartrate?: number;
  max_heartrate?: number;
  average_watts?: number;
  max_watts?: number;
  kilojoules?: number;
}

// Stats configuration types
export interface StatMapping {
  [sportType: string]: {
    strength: number;
    endurance: number;
    agility: number;
  };
}

export interface CalculatedStats {
  strength: number;
  endurance: number;
  agility: number;
  strength_level: number;
  endurance_level: number;
  agility_level: number;
  total_xp: number;
  level: number;
  activities_count: number;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
