import { describe, it, expect } from 'vitest';
import { calculateUserStats, calculateStatsBySport } from '../calculator';
import type { Activity } from '../../types';

describe('calculateUserStats', () => {
  it('should return zero stats for empty activities list', () => {
    const stats = calculateUserStats([]);

    expect(stats.strength).toBe(0);
    expect(stats.endurance).toBe(0);
    expect(stats.agility).toBe(0);
    expect(stats.total_xp).toBe(0);
    expect(stats.level).toBe(0);
    expect(stats.activities_count).toBe(0);
  });

  it('should calculate stats for a single activity', () => {
    const activities: Activity[] = [
      {
        id: 1,
        user_id: 1,
        strava_activity_id: '123',
        sport_type: 'Run',
        moving_time: 1800, // 30 minutes
        elapsed_time: 1800,
        distance: 5000,
        start_date: '2024-01-01T00:00:00Z',
        created_at: Date.now(),
      },
    ];

    const stats = calculateUserStats(activities);

    // Base XP: 30 minutes * 10 = 300 XP
    // Run mapping: 10% strength, 70% endurance, 20% agility
    expect(stats.total_xp).toBeGreaterThan(0);
    expect(stats.strength).toBeGreaterThan(0);
    expect(stats.endurance).toBeGreaterThan(stats.strength); // Run is more endurance
    expect(stats.agility).toBeGreaterThan(0);
    expect(stats.activities_count).toBe(1);
  });

  it('should calculate correct level from XP', () => {
    const activities: Activity[] = [
      {
        id: 1,
        user_id: 1,
        strava_activity_id: '123',
        sport_type: 'Run',
        moving_time: 6000, // 100 minutes = 1000 base XP = Level 1
        elapsed_time: 6000,
        distance: 15000,
        start_date: '2024-01-01T00:00:00Z',
        created_at: Date.now(),
      },
    ];

    const stats = calculateUserStats(activities);

    // Level formula: floor(xp / 3000) - linear, 3000 XP per level
    // 3000 XP = Level 1
    expect(stats.level).toBeGreaterThanOrEqual(1);
  });

  it('should aggregate stats from multiple activities', () => {
    const activities: Activity[] = [
      {
        id: 1,
        user_id: 1,
        strava_activity_id: '123',
        sport_type: 'Run',
        moving_time: 1800,
        elapsed_time: 1800,
        distance: 5000,
        start_date: '2024-01-01T00:00:00Z',
        created_at: Date.now(),
      },
      {
        id: 2,
        user_id: 1,
        strava_activity_id: '124',
        sport_type: 'WeightTraining',
        moving_time: 1800,
        elapsed_time: 1800,
        distance: 0,
        start_date: '2024-01-02T00:00:00Z',
        created_at: Date.now(),
      },
    ];

    const stats = calculateUserStats(activities);

    expect(stats.activities_count).toBe(2);
    expect(stats.total_xp).toBeGreaterThan(0);
    // Weight training is 85% strength, so should boost strength more
    expect(stats.strength).toBeGreaterThan(0);
  });

  it('should handle activities with heart rate data', () => {
    const activities: Activity[] = [
      {
        id: 1,
        user_id: 1,
        strava_activity_id: '123',
        sport_type: 'Run',
        moving_time: 1800,
        elapsed_time: 1800,
        distance: 5000,
        average_heartrate: 160, // High intensity
        start_date: '2024-01-01T00:00:00Z',
        created_at: Date.now(),
      },
    ];

    const statsWithHR = calculateUserStats(activities);

    const activitiesNoHR: Activity[] = [
      {
        ...activities[0],
        average_heartrate: undefined,
      },
    ];

    const statsNoHR = calculateUserStats(activitiesNoHR);

    // Activity with HR should have higher XP due to intensity multiplier
    expect(statsWithHR.total_xp).toBeGreaterThan(statsNoHR.total_xp);
  });
});

describe('calculateStatsBySport', () => {
  it('should return empty array for no activities', () => {
    const breakdown = calculateStatsBySport([]);
    expect(breakdown).toEqual([]);
  });

  it('should aggregate activities by sport type', () => {
    const activities: Activity[] = [
      {
        id: 1,
        user_id: 1,
        strava_activity_id: '123',
        sport_type: 'Run',
        moving_time: 1800,
        elapsed_time: 1800,
        distance: 5000,
        start_date: '2024-01-01T00:00:00Z',
        created_at: Date.now(),
      },
      {
        id: 2,
        user_id: 1,
        strava_activity_id: '124',
        sport_type: 'Run',
        moving_time: 1800,
        elapsed_time: 1800,
        distance: 5000,
        start_date: '2024-01-02T00:00:00Z',
        created_at: Date.now(),
      },
      {
        id: 3,
        user_id: 1,
        strava_activity_id: '125',
        sport_type: 'Ride',
        moving_time: 3600,
        elapsed_time: 3600,
        distance: 20000,
        start_date: '2024-01-03T00:00:00Z',
        created_at: Date.now(),
      },
    ];

    const breakdown = calculateStatsBySport(activities);

    expect(breakdown).toHaveLength(2);

    const runStats = breakdown.find(s => s.sport_type === 'Run');
    const rideStats = breakdown.find(s => s.sport_type === 'Ride');

    expect(runStats).toBeDefined();
    expect(runStats?.count).toBe(2);
    expect(runStats?.total_distance).toBe(10000);

    expect(rideStats).toBeDefined();
    expect(rideStats?.count).toBe(1);
    expect(rideStats?.total_distance).toBe(20000);
  });

  it('should sort sports by total XP descending', () => {
    const activities: Activity[] = [
      {
        id: 1,
        user_id: 1,
        strava_activity_id: '123',
        sport_type: 'Run',
        moving_time: 1800, // Less XP
        elapsed_time: 1800,
        distance: 5000,
        start_date: '2024-01-01T00:00:00Z',
        created_at: Date.now(),
      },
      {
        id: 2,
        user_id: 1,
        strava_activity_id: '124',
        sport_type: 'Ride',
        moving_time: 7200, // More XP
        elapsed_time: 7200,
        distance: 40000,
        start_date: '2024-01-02T00:00:00Z',
        created_at: Date.now(),
      },
    ];

    const breakdown = calculateStatsBySport(activities);

    expect(breakdown[0].sport_type).toBe('Ride');
    expect(breakdown[1].sport_type).toBe('Run');
    expect(breakdown[0].total_xp).toBeGreaterThan(breakdown[1].total_xp);
  });

  it('should include all three stat XP values', () => {
    const activities: Activity[] = [
      {
        id: 1,
        user_id: 1,
        strava_activity_id: '123',
        sport_type: 'Run',
        moving_time: 1800,
        elapsed_time: 1800,
        distance: 5000,
        start_date: '2024-01-01T00:00:00Z',
        created_at: Date.now(),
      },
    ];

    const breakdown = calculateStatsBySport(activities);

    expect(breakdown[0].strength_xp).toBeGreaterThan(0);
    expect(breakdown[0].endurance_xp).toBeGreaterThan(0);
    expect(breakdown[0].agility_xp).toBeGreaterThan(0);

    // Total should equal sum of stat XPs (approximately, allowing for rounding)
    const sum = breakdown[0].strength_xp + breakdown[0].endurance_xp + breakdown[0].agility_xp;
    expect(Math.abs(sum - breakdown[0].total_xp)).toBeLessThan(1);
  });
});
