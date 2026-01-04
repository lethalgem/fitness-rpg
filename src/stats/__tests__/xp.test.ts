import { describe, it, expect } from 'vitest';
import { calculateActivityXP } from '../xp';
import type { Activity } from '../../types';
import { BASE_XP_PER_MINUTE } from '../../config/xp';

describe('calculateActivityXP', () => {
  it('should return zero XP for activity with no time', () => {
    const activity: Activity = {
      id: 1,
      user_id: 1,
      strava_activity_id: '123',
      sport_type: 'Run',
      moving_time: 0,
      elapsed_time: 0,
      distance: 0,
      start_date: '2024-01-01T00:00:00Z',
      created_at: Date.now(),
    };

    const result = calculateActivityXP(activity);

    expect(result.baseXP).toBe(0);
    expect(result.totalXP).toBe(0);
    expect(result.intensityMultiplier).toBe(1.0);
  });

  it('should calculate base XP from moving time', () => {
    const activity: Activity = {
      id: 1,
      user_id: 1,
      strava_activity_id: '123',
      sport_type: 'Run',
      moving_time: 1800, // 30 minutes
      elapsed_time: 2000,
      distance: 5000,
      start_date: '2024-01-01T00:00:00Z',
      created_at: Date.now(),
    };

    const result = calculateActivityXP(activity);

    // 30 minutes * 10 XP/min = 300 base XP
    expect(result.baseXP).toBe(30 * BASE_XP_PER_MINUTE);
    expect(result.totalXP).toBeGreaterThanOrEqual(result.baseXP);
  });

  it('should use elapsed time if moving time is not available', () => {
    const activity: Activity = {
      id: 1,
      user_id: 1,
      strava_activity_id: '123',
      sport_type: 'Run',
      moving_time: undefined,
      elapsed_time: 1800, // 30 minutes
      distance: 5000,
      start_date: '2024-01-01T00:00:00Z',
      created_at: Date.now(),
    };

    const result = calculateActivityXP(activity);

    expect(result.baseXP).toBe(30 * BASE_XP_PER_MINUTE);
  });

  describe('intensity multipliers', () => {
    it('should apply heart rate intensity multiplier', () => {
      const lowIntensity: Activity = {
        id: 1,
        user_id: 1,
        strava_activity_id: '123',
        sport_type: 'Run',
        moving_time: 1800,
        elapsed_time: 1800,
        distance: 5000,
        average_heartrate: 120, // ~60% of max (200) = Zone 1-2
        start_date: '2024-01-01T00:00:00Z',
        created_at: Date.now(),
      };

      const highIntensity: Activity = {
        ...lowIntensity,
        average_heartrate: 180, // ~90% of max = Zone 5
      };

      const lowResult = calculateActivityXP(lowIntensity);
      const highResult = calculateActivityXP(highIntensity);

      expect(lowResult.intensitySource).toBe('heartrate');
      expect(highResult.intensitySource).toBe('heartrate');
      expect(highResult.intensityMultiplier).toBeGreaterThan(lowResult.intensityMultiplier);
      expect(highResult.totalXP).toBeGreaterThan(lowResult.totalXP);
    });

    it('should apply watts intensity multiplier for cycling', () => {
      const lowPower: Activity = {
        id: 1,
        user_id: 1,
        strava_activity_id: '123',
        sport_type: 'Ride',
        moving_time: 3600,
        elapsed_time: 3600,
        distance: 30000,
        average_watts: 100, // Low power
        start_date: '2024-01-01T00:00:00Z',
        created_at: Date.now(),
      };

      const highPower: Activity = {
        ...lowPower,
        average_watts: 300, // High power
      };

      const lowResult = calculateActivityXP(lowPower);
      const highResult = calculateActivityXP(highPower);

      expect(lowResult.intensitySource).toBe('watts');
      expect(highResult.intensitySource).toBe('watts');
      expect(highResult.intensityMultiplier).toBeGreaterThan(lowResult.intensityMultiplier);
      expect(highResult.totalXP).toBeGreaterThan(lowResult.totalXP);
    });

    it('should apply pace intensity multiplier for running', () => {
      const slowRun: Activity = {
        id: 1,
        user_id: 1,
        strava_activity_id: '123',
        sport_type: 'Run',
        moving_time: 3600, // 60 minutes
        elapsed_time: 3600,
        distance: 8000, // 8km in 60 min = slow pace
        average_speed: 8000 / 3600, // m/s
        start_date: '2024-01-01T00:00:00Z',
        created_at: Date.now(),
      };

      const fastRun: Activity = {
        ...slowRun,
        moving_time: 1800, // 30 minutes
        distance: 8000, // 8km in 30 min = fast pace
        average_speed: 8000 / 1800, // m/s
      };

      const slowResult = calculateActivityXP(slowRun);
      const fastResult = calculateActivityXP(fastRun);

      expect(slowResult.intensitySource).toBe('pace');
      expect(fastResult.intensitySource).toBe('pace');
      expect(fastResult.intensityMultiplier).toBeGreaterThan(slowResult.intensityMultiplier);
    });

    it('should prioritize heart rate over other intensity metrics', () => {
      const activity: Activity = {
        id: 1,
        user_id: 1,
        strava_activity_id: '123',
        sport_type: 'Run',
        moving_time: 1800,
        elapsed_time: 1800,
        distance: 5000,
        average_heartrate: 160,
        average_speed: 5000 / 1800,
        average_watts: 200, // Shouldn't be used for running anyway
        start_date: '2024-01-01T00:00:00Z',
        created_at: Date.now(),
      };

      const result = calculateActivityXP(activity);

      expect(result.intensitySource).toBe('heartrate');
    });

    it('should use default multiplier when no intensity data available', () => {
      const activity: Activity = {
        id: 1,
        user_id: 1,
        strava_activity_id: '123',
        sport_type: 'Run',
        moving_time: 1800,
        elapsed_time: 1800,
        distance: 5000,
        start_date: '2024-01-01T00:00:00Z',
        created_at: Date.now(),
      };

      const result = calculateActivityXP(activity);

      expect(result.intensitySource).toBe('default');
      expect(result.intensityMultiplier).toBe(1.0);
      expect(result.totalXP).toBe(result.baseXP);
    });
  });

  it('should never return negative XP', () => {
    const activity: Activity = {
      id: 1,
      user_id: 1,
      strava_activity_id: '123',
      sport_type: 'Run',
      moving_time: 1800,
      elapsed_time: 1800,
      distance: 5000,
      start_date: '2024-01-01T00:00:00Z',
      created_at: Date.now(),
    };

    const result = calculateActivityXP(activity);

    expect(result.baseXP).toBeGreaterThanOrEqual(0);
    expect(result.totalXP).toBeGreaterThanOrEqual(0);
    expect(result.intensityMultiplier).toBeGreaterThanOrEqual(0);
  });

  it('should calculate consistent XP for identical activities', () => {
    const activity1: Activity = {
      id: 1,
      user_id: 1,
      strava_activity_id: '123',
      sport_type: 'Run',
      moving_time: 1800,
      elapsed_time: 1800,
      distance: 5000,
      average_heartrate: 150,
      start_date: '2024-01-01T00:00:00Z',
      created_at: Date.now(),
    };

    const activity2: Activity = {
      ...activity1,
      id: 2,
      strava_activity_id: '124',
    };

    const result1 = calculateActivityXP(activity1);
    const result2 = calculateActivityXP(activity2);

    expect(result1.totalXP).toBe(result2.totalXP);
    expect(result1.intensityMultiplier).toBe(result2.intensityMultiplier);
  });
});
