// Authentication routes

import { Hono } from 'hono';
import type { Env } from '../types';
import { createDbClient } from '../db/client';
import { UserRepository } from '../db/users';
import { StravaAuth } from '../strava/auth';
import { ImportJobProcessor } from '../jobs/importer';
import { success, error } from '../utils/response';
import { log, error as logError } from '../utils/logger';

const auth = new Hono<{ Bindings: Env }>();

// GET /auth/strava/connect - Redirect to Strava OAuth
auth.get('/strava/connect', (c) => {
  const stravaAuth = new StravaAuth(c.env);
  const redirectUri = `${c.env.FRONTEND_URL}/auth/strava/callback`;
  const authUrl = stravaAuth.getAuthorizationUrl(redirectUri);

  return c.redirect(authUrl);
});

// GET /auth/strava/callback - Handle OAuth callback
auth.get('/strava/callback', async (c) => {
  try {
    const code = c.req.query('code');
    const error = c.req.query('error');

    if (error) {
      return c.html(`<html><body><h1>Authorization cancelled</h1><p>${error}</p></body></html>`, 400);
    }

    if (!code) {
      return c.html('<html><body><h1>Missing authorization code</h1></body></html>', 400);
    }

    log('Processing Strava OAuth callback', { code });

    // Exchange code for token
    const stravaAuth = new StravaAuth(c.env);
    const tokenResponse = await stravaAuth.exchangeToken(code);

    // Create or update user
    const dbClient = createDbClient(c.env);
    const userRepo = new UserRepository(dbClient);
    const user = await userRepo.upsert(tokenResponse);

    log('User authenticated', { userId: user.id, stravaId: user.strava_id });

    // Start initial activity import (first page synchronously)
    const importer = new ImportJobProcessor(c.env);
    await importer.startInitialImport(user);

    // Start background processing immediately for remaining pages
    // Create the promise first so it starts immediately, then pass to waitUntil to keep alive
    const cronHandler = await import('../cron');
    const processingPromise = cronHandler.default.processImports(c.env).catch((error) => {
      console.error('Background import failed:', error);
    });

    // Keep the promise alive even after response is sent
    c.executionCtx.waitUntil(processingPromise);

    // Redirect to dashboard with user ID
    return c.html(`
      <html>
        <head>
          <title>Connected to Strava!</title>
          <meta http-equiv="refresh" content="2;url=/?userId=${user.id}" />
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }
            .container {
              text-align: center;
              padding: 2rem;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 16px;
              backdrop-filter: blur(10px);
            }
            .spinner {
              border: 4px solid rgba(255, 255, 255, 0.3);
              border-top: 4px solid white;
              border-radius: 50%;
              width: 40px;
              height: 40px;
              animation: spin 1s linear infinite;
              margin: 20px auto;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✓ Connected to Strava!</h1>
            <div class="spinner"></div>
            <p>Importing your activities...</p>
            <p><small>Redirecting to dashboard...</small></p>
          </div>
        </body>
      </html>
    `);

  } catch (err) {
    logError('OAuth callback failed', err);
    return c.html(`
      <html>
        <body>
          <h1>Authentication failed</h1>
          <p>${err instanceof Error ? err.message : 'Unknown error'}</p>
          <a href="/">Try again</a>
        </body>
      </html>
    `, 500);
  }
});

export default auth;
