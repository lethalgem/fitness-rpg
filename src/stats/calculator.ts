// Stats calculation from activities

import type { Activity, CalculatedStats } from '../types';
import { getStatMapping } from '../config/stats';
import { calculateLevel } from '../config/xp';
import { calculateActivityXP } from './xp';
import { log } from '../utils/logger';

export function calculateUserStats(activities: Activity[]): CalculatedStats {
  let totalStrength = 0;
  let totalEndurance = 0;
  let totalAgility = 0;
  let totalXP = 0;

  for (const activity of activities) {
    // Calculate XP for this activity (with intensity)
    const xpCalc = calculateActivityXP(activity);
    totalXP += xpCalc.totalXP;

    // Get stat mapping for sport type
    const statMapping = getStatMapping(activity.sport_type);

    // Distribute XP to stats based on mapping
    totalStrength += xpCalc.totalXP * statMapping.strength;
    totalEndurance += xpCalc.totalXP * statMapping.endurance;
    totalAgility += xpCalc.totalXP * statMapping.agility;
  }

  const level = calculateLevel(totalXP);
  const strengthLevel = calculateLevel(totalStrength);
  const enduranceLevel = calculateLevel(totalEndurance);
  const agilityLevel = calculateLevel(totalAgility);

  log('Calculated user stats', {
    activitiesCount: activities.length,
    totalXP,
    level,
    strength: Math.round(totalStrength),
    endurance: Math.round(totalEndurance),
    agility: Math.round(totalAgility),
    strengthLevel,
    enduranceLevel,
    agilityLevel,
  });

  return {
    strength: Math.round(totalStrength),
    endurance: Math.round(totalEndurance),
    agility: Math.round(totalAgility),
    strength_level: strengthLevel,
    endurance_level: enduranceLevel,
    agility_level: agilityLevel,
    total_xp: Math.round(totalXP),
    level,
    activities_count: activities.length,
  };
}

// Calculate stats breakdown by sport type
export interface SportStats {
  sport_type: string;
  count: number;
  total_xp: number;
  strength_xp: number;
  endurance_xp: number;
  agility_xp: number;
  total_time: number; // minutes
  total_distance: number; // meters
}

export function calculateStatsBySport(activities: Activity[]): SportStats[] {
  const sportMap = new Map<string, SportStats>();

  for (const activity of activities) {
    const sportType = activity.sport_type;
    const xpCalc = calculateActivityXP(activity);
    const statMapping = getStatMapping(sportType);
    const timeInMinutes = (activity.moving_time || activity.elapsed_time || 0) / 60;

    if (!sportMap.has(sportType)) {
      sportMap.set(sportType, {
        sport_type: sportType,
        count: 0,
        total_xp: 0,
        strength_xp: 0,
        endurance_xp: 0,
        agility_xp: 0,
        total_time: 0,
        total_distance: 0,
      });
    }

    const stats = sportMap.get(sportType)!;
    stats.count++;
    stats.total_xp += xpCalc.totalXP;
    stats.strength_xp += xpCalc.totalXP * statMapping.strength;
    stats.endurance_xp += xpCalc.totalXP * statMapping.endurance;
    stats.agility_xp += xpCalc.totalXP * statMapping.agility;
    stats.total_time += timeInMinutes;
    stats.total_distance += activity.distance || 0;
  }

  return Array.from(sportMap.values()).sort((a, b) => b.total_xp - a.total_xp);
}
