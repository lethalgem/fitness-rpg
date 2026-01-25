// XP calculation configuration
// Modify these values to tune the RPG progression system

// Base XP per minute of activity (before intensity multiplier)
export const BASE_XP_PER_MINUTE = 10;

// Heart rate zone multipliers (based on percentage of max HR)
// HR is the primary intensity signal - higher HR = harder workout = more XP
// Wide multiplier spread to differentiate easy walks from hard efforts
export const HR_ZONE_MULTIPLIERS = {
  zone1: { min: 0, max: 60, multiplier: 0.8 },    // Recovery/very easy - penalized
  zone2: { min: 60, max: 70, multiplier: 1.0 },   // Easy aerobic - baseline
  zone3: { min: 70, max: 80, multiplier: 1.5 },   // Tempo - moderate bonus
  zone4: { min: 80, max: 90, multiplier: 2.0 },   // Threshold - significant bonus
  zone5: { min: 90, max: 100, multiplier: 2.5 },  // VO2 Max - maximum bonus
};

// Watt zone multipliers for cycling (based on FTP)
// Assumes FTP (Functional Threshold Power) of ~200W for average cyclist
export const WATT_ZONE_MULTIPLIERS = {
  zone1: { min: 0, max: 55, multiplier: 1.0 },     // Recovery (<55% FTP)
  zone2: { min: 55, max: 75, multiplier: 1.2 },    // Endurance (55-75% FTP)
  zone3: { min: 75, max: 90, multiplier: 1.5 },    // Tempo (75-90% FTP)
  zone4: { min: 90, max: 105, multiplier: 1.8 },   // Threshold (90-105% FTP)
  zone5: { min: 105, max: 200, multiplier: 2.0 },  // VO2 Max (>105% FTP)
};

// Pace-based intensity estimation for running (min/km)
// Slower = lower intensity, faster = higher intensity
export const PACE_INTENSITY_THRESHOLDS = {
  veryEasy: { minPace: 7.0, multiplier: 1.0 },    // >7 min/km
  easy: { minPace: 6.0, multiplier: 1.2 },        // 6-7 min/km
  moderate: { minPace: 5.0, multiplier: 1.5 },    // 5-6 min/km
  hard: { minPace: 4.0, multiplier: 1.8 },        // 4-5 min/km
  veryHard: { minPace: 0, multiplier: 2.0 },      // <4 min/km
};

// Level calculation: Linear progression
// Each level requires ~3,000 XP (about 3-5 workouts depending on intensity/duration)
// Level 1 = 3,000 XP
// Level 2 = 6,000 XP
// Level 10 = 30,000 XP
// Level 100 = 300,000 XP
// Level 200 = 600,000 XP
export const XP_PER_LEVEL_BASE = 3000;

export function calculateLevel(totalXP: number): number {
  return Math.floor(totalXP / XP_PER_LEVEL_BASE);
}

export function xpForNextLevel(currentLevel: number): number {
  return (currentLevel + 1) * XP_PER_LEVEL_BASE;
}

export function xpForCurrentLevel(currentLevel: number): number {
  return currentLevel * XP_PER_LEVEL_BASE;
}

// Estimated max heart rate (can be customized per user later)
export const DEFAULT_MAX_HR = 190; // Roughly for a 30-year-old

// Estimated FTP for cycling (can be customized per user later)
export const DEFAULT_FTP = 200; // watts
