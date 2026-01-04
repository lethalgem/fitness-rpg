// Flexible sport-to-stat mapping configuration
// Modify these values to change how activities contribute to stats

import type { StatMapping } from '../types';

// Sport types and their stat contributions (must sum to 1.0)
// Higher values = more contribution to that stat
export const SPORT_STAT_MAPPING: StatMapping = {
  // Running activities (high endurance)
  'Run': { strength: 0.1, endurance: 0.7, agility: 0.2 },
  'TrailRun': { strength: 0.2, endurance: 0.5, agility: 0.3 },
  'VirtualRun': { strength: 0.1, endurance: 0.7, agility: 0.2 },

  // Cycling activities (balanced endurance/strength)
  'Ride': { strength: 0.3, endurance: 0.6, agility: 0.1 },
  'VirtualRide': { strength: 0.3, endurance: 0.6, agility: 0.1 },
  'MountainBikeRide': { strength: 0.3, endurance: 0.4, agility: 0.3 },
  'GravelRide': { strength: 0.3, endurance: 0.5, agility: 0.2 },
  'EBikeRide': { strength: 0.2, endurance: 0.7, agility: 0.1 },

  // Swimming (balanced)
  'Swim': { strength: 0.4, endurance: 0.5, agility: 0.1 },

  // Strength training (high strength)
  'WeightTraining': { strength: 0.85, endurance: 0.1, agility: 0.05 },
  'Crossfit': { strength: 0.5, endurance: 0.2, agility: 0.3 },

  // Hiking & walking (endurance focused)
  'Hike': { strength: 0.25, endurance: 0.6, agility: 0.15 },
  'Walk': { strength: 0.1, endurance: 0.8, agility: 0.1 },

  // Rowing & paddling (balanced)
  'Rowing': { strength: 0.5, endurance: 0.4, agility: 0.1 },
  'VirtualRow': { strength: 0.5, endurance: 0.4, agility: 0.1 },
  'Kayaking': { strength: 0.4, endurance: 0.5, agility: 0.1 },
  'Canoeing': { strength: 0.4, endurance: 0.5, agility: 0.1 },
  'StandUpPaddling': { strength: 0.35, endurance: 0.45, agility: 0.2 },

  // Winter sports
  'AlpineSki': { strength: 0.4, endurance: 0.3, agility: 0.3 },
  'BackcountrySki': { strength: 0.3, endurance: 0.5, agility: 0.2 },
  'NordicSki': { strength: 0.2, endurance: 0.6, agility: 0.2 },
  'Snowboard': { strength: 0.4, endurance: 0.3, agility: 0.3 },
  'Snowshoe': { strength: 0.25, endurance: 0.6, agility: 0.15 },

  // Climbing
  'RockClimbing': { strength: 0.6, endurance: 0.2, agility: 0.2 },

  // HIIT & cardio
  'HighIntensityIntervalTraining': { strength: 0.3, endurance: 0.4, agility: 0.3 },
  'Workout': { strength: 0.4, endurance: 0.4, agility: 0.2 },
  'Elliptical': { strength: 0.2, endurance: 0.7, agility: 0.1 },
  'StairStepper': { strength: 0.35, endurance: 0.55, agility: 0.1 },

  // Yoga & flexibility
  'Yoga': { strength: 0.2, endurance: 0.5, agility: 0.3 },
  'Pilates': { strength: 0.3, endurance: 0.4, agility: 0.3 },

  // Ball sports (agility focused)
  'Soccer': { strength: 0.3, endurance: 0.4, agility: 0.3 },
  'Tennis': { strength: 0.3, endurance: 0.3, agility: 0.4 },
  'Badminton': { strength: 0.2, endurance: 0.4, agility: 0.4 },
  'Pickleball': { strength: 0.2, endurance: 0.4, agility: 0.4 },
  'TableTennis': { strength: 0.1, endurance: 0.4, agility: 0.5 },
  'Squash': { strength: 0.3, endurance: 0.3, agility: 0.4 },
  'Racquetball': { strength: 0.3, endurance: 0.3, agility: 0.4 },

  // Other activities
  'Golf': { strength: 0.15, endurance: 0.7, agility: 0.15 },
  'Skateboard': { strength: 0.3, endurance: 0.3, agility: 0.4 },
  'InlineSkate': { strength: 0.2, endurance: 0.5, agility: 0.3 },
  'IceSkate': { strength: 0.2, endurance: 0.5, agility: 0.3 },
  'RollerSki': { strength: 0.2, endurance: 0.6, agility: 0.2 },

  // Water sports
  'Surfing': { strength: 0.3, endurance: 0.3, agility: 0.4 },
  'Kitesurf': { strength: 0.4, endurance: 0.3, agility: 0.3 },
  'Windsurf': { strength: 0.4, endurance: 0.3, agility: 0.3 },
  'Sail': { strength: 0.3, endurance: 0.5, agility: 0.2 },

  // Wheelchair
  'Wheelchair': { strength: 0.4, endurance: 0.5, agility: 0.1 },
  'Handcycle': { strength: 0.3, endurance: 0.6, agility: 0.1 },

  // Misc
  'Velomobile': { strength: 0.3, endurance: 0.6, agility: 0.1 },
};

// Default mapping for unknown sport types
export const DEFAULT_STAT_MAPPING = {
  strength: 0.33,
  endurance: 0.34,
  agility: 0.33,
};

// Get stat mapping for a sport type
export function getStatMapping(sportType: string): { strength: number; endurance: number; agility: number } {
  return SPORT_STAT_MAPPING[sportType] || DEFAULT_STAT_MAPPING;
}

// Available stat types
export const STAT_TYPES = ['strength', 'endurance', 'agility'] as const;
export type StatType = typeof STAT_TYPES[number];
