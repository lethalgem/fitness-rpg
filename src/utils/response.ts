// Standard JSON response helpers

import type { ApiResponse } from '../types';

export function success<T>(data: T, status = 200): Response {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };
  return new Response(JSON.stringify(response), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function error(message: string, status = 400): Response {
  const response: ApiResponse = {
    success: false,
    error: message,
  };
  return new Response(JSON.stringify(response), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function notFound(message = 'Resource not found'): Response {
  return error(message, 404);
}

export function unauthorized(message = 'Unauthorized'): Response {
  return error(message, 401);
}

export function serverError(message = 'Internal server error'): Response {
  return error(message, 500);
}
