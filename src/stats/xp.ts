// Intensity-aware XP calculation

import type { Activity } from '../types';
import {
  BASE_XP_PER_MINUTE,
  WATT_ZONE_MULTIPLIERS,
  PACE_INTENSITY_THRESHOLDS,
  DEFAULT_MAX_HR,
  DEFAULT_FTP,
} from '../config/xp';

export interface XPCalculation {
  baseXP: number;
  intensityMultiplier: number;
  totalXP: number;
  intensitySource: 'heartrate' | 'watts' | 'pace' | 'default';
}

export function calculateActivityXP(activity: Activity): XPCalculation {
  // Use elapsed_time (total duration) - HR multiplier already adjusts for intensity
  const timeInMinutes = ((activity.elapsed_time || activity.moving_time || 0) / 60);

  if (timeInMinutes === 0) {
    return {
      baseXP: 0,
      intensityMultiplier: 1.0,
      totalXP: 0,
      intensitySource: 'default',
    };
  }

  const baseXP = timeInMinutes * BASE_XP_PER_MINUTE;

  // Try different intensity calculations in order of preference
  // HR is the primary intensity signal - it's the great equalizer across activities
  let intensityMultiplier = 1.0;
  let intensitySource: XPCalculation['intensitySource'] = 'default';

  // 1. Heart rate (primary - works across all activity types)
  if (activity.average_heartrate) {
    intensityMultiplier = getHRIntensityMultiplier(activity.average_heartrate);
    intensitySource = 'heartrate';
  }
  // 2. Watts (for cycling without HR)
  else if (activity.average_watts && activity.sport_type?.toLowerCase().includes('ride')) {
    intensityMultiplier = getWattIntensityMultiplier(activity.average_watts);
    intensitySource = 'watts';
  }
  // 3. Pace (for running/walking without HR)
  else if (activity.average_speed && isRunningActivity(activity.sport_type || '')) {
    intensityMultiplier = getPaceIntensityMultiplier(activity.average_speed);
    intensitySource = 'pace';
  }

  const totalXP = baseXP * intensityMultiplier;

  return {
    baseXP,
    intensityMultiplier,
    totalXP,
    intensitySource,
  };
}

// Calculate intensity multiplier from heart rate using continuous linear scale
// Every percentage point of HR matters - no arbitrary zone boundaries
function getHRIntensityMultiplier(avgHeartRate: number, maxHR: number = DEFAULT_MAX_HR): number {
  const hrPercentage = (avgHeartRate / maxHR) * 100;

  // Linear scale: 50% HR → 0.7×, 100% HR → 2.5×
  // Formula: multiplier = 0.7 + (hrPercent - 50) × 0.036
  const MIN_HR_PERCENT = 50;
  const MAX_HR_PERCENT = 100;
  const MIN_MULTIPLIER = 0.7;
  const MAX_MULTIPLIER = 2.5;

  // Clamp HR percentage to valid range
  const clampedHR = Math.max(MIN_HR_PERCENT, Math.min(MAX_HR_PERCENT, hrPercentage));

  // Linear interpolation
  const multiplier = MIN_MULTIPLIER +
    (clampedHR - MIN_HR_PERCENT) * (MAX_MULTIPLIER - MIN_MULTIPLIER) / (MAX_HR_PERCENT - MIN_HR_PERCENT);

  return multiplier;
}

// Calculate intensity multiplier from watts (cycling)
function getWattIntensityMultiplier(avgWatts: number, ftp: number = DEFAULT_FTP): number {
  const wattPercentage = (avgWatts / ftp) * 100;

  for (const zone of Object.values(WATT_ZONE_MULTIPLIERS)) {
    if (wattPercentage >= zone.min && wattPercentage < zone.max) {
      return zone.multiplier;
    }
  }

  // If watts are above threshold, use max multiplier
  return WATT_ZONE_MULTIPLIERS.zone5.multiplier;
}

// Calculate intensity multiplier from pace (running)
function getPaceIntensityMultiplier(avgSpeed: number): number {
  // Convert m/s to min/km
  if (avgSpeed === 0) return 1.0;

  const paceMinPerKm = (1000 / avgSpeed) / 60;

  // Check pace thresholds (in order from slowest to fastest)
  if (paceMinPerKm > PACE_INTENSITY_THRESHOLDS.veryEasy.minPace) {
    return PACE_INTENSITY_THRESHOLDS.veryEasy.multiplier;
  }
  if (paceMinPerKm > PACE_INTENSITY_THRESHOLDS.easy.minPace) {
    return PACE_INTENSITY_THRESHOLDS.easy.multiplier;
  }
  if (paceMinPerKm > PACE_INTENSITY_THRESHOLDS.moderate.minPace) {
    return PACE_INTENSITY_THRESHOLDS.moderate.multiplier;
  }
  if (paceMinPerKm > PACE_INTENSITY_THRESHOLDS.hard.minPace) {
    return PACE_INTENSITY_THRESHOLDS.hard.multiplier;
  }

  return PACE_INTENSITY_THRESHOLDS.veryHard.multiplier;
}

// Check if activity is a running-type activity
function isRunningActivity(sportType: string): boolean {
  const runningTypes = ['run', 'trailrun', 'virtualrun', 'walk', 'hike'];
  return runningTypes.some(type => sportType.toLowerCase().includes(type));
}
