// Strava OAuth authentication logic

import type { Env } from '../types';
import type { StravaTokenResponse } from './types';
import { log, error as logError } from '../utils/logger';

const STRAVA_TOKEN_URL = 'https://www.strava.com/oauth/token';
const STRAVA_AUTHORIZE_URL = 'https://www.strava.com/oauth/authorize';

export class StravaAuth {
  constructor(private env: Env) {}

  // Generate OAuth authorization URL
  getAuthorizationUrl(redirectUri: string, state?: string): string {
    const params = new URLSearchParams({
      client_id: this.env.STRAVA_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: 'code',
      approval_prompt: 'auto',
      scope: 'read,activity:read_all',
    });

    if (state) {
      params.append('state', state);
    }

    return `${STRAVA_AUTHORIZE_URL}?${params.toString()}`;
  }

  // Exchange authorization code for access token
  async exchangeToken(code: string): Promise<StravaTokenResponse> {
    try {
      log('Exchanging authorization code for token');

      const response = await fetch(STRAVA_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: this.env.STRAVA_CLIENT_ID,
          client_secret: this.env.STRAVA_CLIENT_SECRET,
          code,
          grant_type: 'authorization_code',
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Strava token exchange failed: ${error}`);
      }

      const data = await response.json<StravaTokenResponse>();
      log('Token exchange successful', { athleteId: data.athlete.id });

      return data;
    } catch (err) {
      logError('Token exchange failed', err);
      throw err;
    }
  }

  // Refresh access token using refresh token
  async refreshToken(refreshToken: string): Promise<StravaTokenResponse> {
    try {
      log('Refreshing access token');

      const response = await fetch(STRAVA_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: this.env.STRAVA_CLIENT_ID,
          client_secret: this.env.STRAVA_CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Strava token refresh failed: ${error}`);
      }

      const data = await response.json<StravaTokenResponse>();
      log('Token refresh successful');

      return data;
    } catch (err) {
      logError('Token refresh failed', err);
      throw err;
    }
  }

  // Check if token needs refresh and refresh if necessary
  async ensureValidToken(
    accessToken: string,
    refreshToken: string,
    expiresAt: number
  ): Promise<{ accessToken: string; refreshToken: string; expiresAt: number; refreshed: boolean }> {
    const now = Math.floor(Date.now() / 1000);
    const bufferSeconds = 600; // 10 minutes

    if (now >= expiresAt - bufferSeconds) {
      log('Token expired or expiring soon, refreshing');
      const response = await this.refreshToken(refreshToken);
      return {
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        expiresAt: response.expires_at,
        refreshed: true,
      };
    }

    return { accessToken, refreshToken, expiresAt, refreshed: false };
  }
}
