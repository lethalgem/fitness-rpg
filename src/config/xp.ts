// XP calculation configuration
// Modify these values to tune the RPG progression system

// Base XP per minute of activity (before intensity multiplier)
export const BASE_XP_PER_MINUTE = 10;

// Heart rate zone multipliers (based on percentage of max HR)
// Assumes max HR ~220 - age (you can customize this)
export const HR_ZONE_MULTIPLIERS = {
  zone1: { min: 0, max: 60, multiplier: 1.0 },    // Recovery (50-60% max HR)
  zone2: { min: 60, max: 70, multiplier: 1.2 },   // Aerobic (60-70% max HR)
  zone3: { min: 70, max: 80, multiplier: 1.5 },   // Tempo (70-80% max HR)
  zone4: { min: 80, max: 90, multiplier: 1.8 },   // Threshold (80-90% max HR)
  zone5: { min: 90, max: 100, multiplier: 2.0 },  // VO2 Max (90%+ max HR)
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

// Level calculation: XP needed for level N
// Formula: level = floor(sqrt(totalXP / 1000))
// Level 1 = 1,000 XP
// Level 2 = 4,000 XP
// Level 10 = 100,000 XP
// Level 100 = 10,000,000 XP
export const XP_PER_LEVEL_FACTOR = 1000;

export function calculateLevel(totalXP: number): number {
  return Math.floor(Math.sqrt(totalXP / XP_PER_LEVEL_FACTOR));
}

export function xpForNextLevel(currentLevel: number): number {
  return Math.pow(currentLevel + 1, 2) * XP_PER_LEVEL_FACTOR;
}

export function xpForCurrentLevel(currentLevel: number): number {
  return Math.pow(currentLevel, 2) * XP_PER_LEVEL_FACTOR;
}

// Estimated max heart rate (can be customized per user later)
export const DEFAULT_MAX_HR = 190; // Roughly for a 30-year-old

// Estimated FTP for cycling (can be customized per user later)
export const DEFAULT_FTP = 200; // watts
