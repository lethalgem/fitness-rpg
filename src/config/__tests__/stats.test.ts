import { describe, it, expect } from 'vitest';
import { SPORT_STAT_MAPPING, DEFAULT_STAT_MAPPING, getStatMapping, STAT_TYPES } from '../stats';

describe('Sport Stat Mappings', () => {
  it('should have all sport percentages sum to 1.0', () => {
    Object.entries(SPORT_STAT_MAPPING).forEach(([sport, mapping]) => {
      const sum = mapping.strength + mapping.endurance + mapping.agility;

      // Use toBeCloseTo to handle floating point precision
      expect(sum).toBeCloseTo(1.0, 5);

      if (Math.abs(sum - 1.0) > 0.0001) {
        throw new Error(`Sport "${sport}" has percentages that don't sum to 1.0: ${sum}`);
      }
    });
  });

  it('should have all percentages between 0 and 1', () => {
    Object.entries(SPORT_STAT_MAPPING).forEach(([sport, mapping]) => {
      expect(mapping.strength).toBeGreaterThanOrEqual(0);
      expect(mapping.strength).toBeLessThanOrEqual(1);

      expect(mapping.endurance).toBeGreaterThanOrEqual(0);
      expect(mapping.endurance).toBeLessThanOrEqual(1);

      expect(mapping.agility).toBeGreaterThanOrEqual(0);
      expect(mapping.agility).toBeLessThanOrEqual(1);
    });
  });

  it('should have default mapping sum to 1.0', () => {
    const sum = DEFAULT_STAT_MAPPING.strength +
                DEFAULT_STAT_MAPPING.endurance +
                DEFAULT_STAT_MAPPING.agility;

    expect(sum).toBeCloseTo(1.0, 5);
  });

  it('should include all three stat types', () => {
    expect(STAT_TYPES).toContain('strength');
    expect(STAT_TYPES).toContain('endurance');
    expect(STAT_TYPES).toContain('agility');
    expect(STAT_TYPES).toHaveLength(3);
  });

  describe('getStatMapping', () => {
    it('should return correct mapping for known sport', () => {
      const mapping = getStatMapping('Run');

      expect(mapping).toHaveProperty('strength');
      expect(mapping).toHaveProperty('endurance');
      expect(mapping).toHaveProperty('agility');
      expect(mapping.strength + mapping.endurance + mapping.agility).toBeCloseTo(1.0, 5);
    });

    it('should return default mapping for unknown sport', () => {
      const mapping = getStatMapping('UnknownSport123');

      expect(mapping).toEqual(DEFAULT_STAT_MAPPING);
    });

    it('should handle case-sensitive sport names', () => {
      const upperCase = getStatMapping('RUN');
      const lowerCase = getStatMapping('run');
      const properCase = getStatMapping('Run');

      // These should NOT be equal because sport types are case-sensitive
      expect(upperCase).toEqual(DEFAULT_STAT_MAPPING);
      expect(lowerCase).toEqual(DEFAULT_STAT_MAPPING);
      expect(properCase).not.toEqual(DEFAULT_STAT_MAPPING);
    });
  });

  describe('Sport Type Validation', () => {
    it('should have strength-focused sports (>60% strength)', () => {
      const strengthSports = Object.entries(SPORT_STAT_MAPPING)
        .filter(([_, mapping]) => mapping.strength > 0.6);

      expect(strengthSports.length).toBeGreaterThan(0);

      // Weight training should definitely be strength-focused
      const weightTraining = SPORT_STAT_MAPPING['WeightTraining'];
      expect(weightTraining.strength).toBeGreaterThan(0.6);
    });

    it('should have endurance-focused sports (>60% endurance)', () => {
      const enduranceSports = Object.entries(SPORT_STAT_MAPPING)
        .filter(([_, mapping]) => mapping.endurance > 0.6);

      expect(enduranceSports.length).toBeGreaterThan(0);

      // Running should be endurance-focused
      const run = SPORT_STAT_MAPPING['Run'];
      expect(run.endurance).toBeGreaterThan(0.6);
    });

    it('should have agility-focused sports (>40% agility)', () => {
      const agilitySports = Object.entries(SPORT_STAT_MAPPING)
        .filter(([_, mapping]) => mapping.agility >= 0.4);

      expect(agilitySports.length).toBeGreaterThan(0);

      // Tennis should have good agility component
      const tennis = SPORT_STAT_MAPPING['Tennis'];
      expect(tennis.agility).toBeGreaterThanOrEqual(0.3);
    });

    it('should have balanced sports (no stat >50%)', () => {
      const balancedSports = Object.entries(SPORT_STAT_MAPPING)
        .filter(([_, mapping]) =>
          mapping.strength <= 0.5 &&
          mapping.endurance <= 0.5 &&
          mapping.agility <= 0.5
        );

      expect(balancedSports.length).toBeGreaterThan(0);
    });
  });

  describe('Common Sports Coverage', () => {
    const commonSports = [
      'Run', 'Ride', 'Swim', 'Walk', 'Hike',
      'WeightTraining', 'Yoga', 'Tennis', 'Golf'
    ];

    it('should include all common sports', () => {
      commonSports.forEach(sport => {
        expect(SPORT_STAT_MAPPING).toHaveProperty(sport);
      });
    });

    it('should have reasonable distributions for common sports', () => {
      // Running should be primarily endurance
      expect(SPORT_STAT_MAPPING['Run'].endurance).toBeGreaterThan(0.5);

      // Weight training should be primarily strength
      expect(SPORT_STAT_MAPPING['WeightTraining'].strength).toBeGreaterThan(0.7);

      // Swimming should be relatively balanced
      const swim = SPORT_STAT_MAPPING['Swim'];
      expect(Math.max(swim.strength, swim.endurance, swim.agility)).toBeLessThan(0.7);
    });
  });

  it('should not have any sports with zero in all stats', () => {
    Object.entries(SPORT_STAT_MAPPING).forEach(([sport, mapping]) => {
      const hasNonZero = mapping.strength > 0 || mapping.endurance > 0 || mapping.agility > 0;
      expect(hasNonZero).toBe(true);
    });
  });

  it('should have a reasonable number of sports defined', () => {
    const sportCount = Object.keys(SPORT_STAT_MAPPING).length;

    // Should have at least 20 sports, but not an unreasonable amount
    expect(sportCount).toBeGreaterThanOrEqual(20);
    expect(sportCount).toBeLessThan(200);
  });
});
