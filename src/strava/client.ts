// Strava API client for fetching activities

import type { StravaSummaryActivity, StravaRateLimits } from './types';
import { log, error as logError } from '../utils/logger';

const STRAVA_API_BASE = 'https://www.strava.com/api/v3';

export class StravaClient {
  constructor(private accessToken: string) {}

  // Fetch a single page of activities
  async getActivities(page = 1, perPage = 200, after?: number): Promise<StravaSummaryActivity[]> {
    try {
      log(`Fetching activities page ${page}`, { perPage, after });

      const url = new URL(`${STRAVA_API_BASE}/athlete/activities`);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('per_page', perPage.toString());

      // Only fetch activities after this timestamp (epoch seconds)
      if (after) {
        url.searchParams.append('after', after.toString());
      }

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Strava API error: ${response.status} ${error}`);
      }

      // Extract rate limit info from headers
      const rateLimits = this.extractRateLimits(response);
      log('Rate limits', rateLimits);

      const activities = await response.json<StravaSummaryActivity[]>();
      log(`Fetched ${activities.length} activities from page ${page}`);

      return activities;
    } catch (err) {
      logError('Failed to fetch activities', err);
      throw err;
    }
  }

  // Fetch all activities (paginated)
  async getAllActivities(
    onProgress?: (imported: number, page: number) => void
  ): Promise<StravaSummaryActivity[]> {
    const allActivities: StravaSummaryActivity[] = [];
    let page = 1;
    const perPage = 200; // Strava max

    while (true) {
      const activities = await this.getActivities(page, perPage);

      if (activities.length === 0) {
        break;
      }

      allActivities.push(...activities);
      log(`Total activities fetched: ${allActivities.length}`);

      if (onProgress) {
        onProgress(allActivities.length, page);
      }

      // If we got fewer than perPage, we've reached the end
      if (activities.length < perPage) {
        break;
      }

      page++;
    }

    log(`Finished fetching all activities`, { total: allActivities.length });
    return allActivities;
  }

  // Fetch activities for a specific page (used by background jobs)
  async getActivitiesPage(page: number, after?: number): Promise<{
    activities: StravaSummaryActivity[];
    hasMore: boolean;
    rateLimits: StravaRateLimits | null;
  }> {
    const perPage = 200;
    const activities = await this.getActivities(page, perPage, after);

    return {
      activities,
      hasMore: activities.length === perPage,
      rateLimits: null, // Will be populated from response headers
    };
  }

  // Extract rate limit info from response headers
  private extractRateLimits(response: Response): StravaRateLimits | null {
    const shortLimit = response.headers.get('X-RateLimit-Limit');
    const shortUsage = response.headers.get('X-RateLimit-Usage');

    if (!shortLimit || !shortUsage) {
      return null;
    }

    const [shortUsageVal, longUsageVal] = shortUsage.split(',').map(Number);
    const [shortLimitVal, longLimitVal] = shortLimit.split(',').map(Number);

    return {
      short: { usage: shortUsageVal, limit: shortLimitVal },
      long: { usage: longUsageVal, limit: longLimitVal },
    };
  }

  // Check if we're approaching rate limits
  static isApproachingRateLimit(rateLimits: StravaRateLimits | null): boolean {
    if (!rateLimits) return false;

    // Consider approaching if we've used 80% of either limit
    const shortPercentage = (rateLimits.short.usage / rateLimits.short.limit) * 100;
    const longPercentage = (rateLimits.long.usage / rateLimits.long.limit) * 100;

    return shortPercentage >= 80 || longPercentage >= 80;
  }
}
