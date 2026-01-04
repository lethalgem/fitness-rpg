// Simple logging utility for Cloudflare Workers

export function log(message: string, data?: any) {
  console.log(`[${new Date().toISOString()}] ${message}`, data ? JSON.stringify(data) : '');
}

export function error(message: string, err?: any) {
  console.error(`[${new Date().toISOString()}] ERROR: ${message}`, err);
}

export function debug(message: string, data?: any) {
  // Debug logging (always enabled in workers)
  console.debug(`[${new Date().toISOString()}] DEBUG: ${message}`, data ? JSON.stringify(data) : '');
}
