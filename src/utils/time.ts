// Time utility functions for weekly leaderboard resets

/**
 * Get Unix timestamp for Monday 00:00:00 Eastern Time of the current week
 */
export function getStartOfWeek(now?: Date): number {
  const date = now || new Date();

  // Convert to Eastern Time using toLocaleString
  const etString = date.toLocaleString('en-US', { timeZone: 'America/New_York' });
  const etDate = new Date(etString);

  const day = etDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const daysToMonday = (day === 0 ? -6 : 1 - day); // If Sunday, go back 6 days, else go back to Monday

  // Calculate Monday in Eastern Time
  const monday = new Date(etDate);
  monday.setDate(etDate.getDate() + daysToMonday);
  monday.setHours(0, 0, 0, 0);

  // Convert back to UTC timestamp by creating a date string with ET timezone
  const mondayStr = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}T00:00:00`;
  const mondayET = new Date(mondayStr + ' GMT-0500'); // EST offset, will adjust for EDT automatically

  // Parse as Eastern Time
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const parts = formatter.formatToParts(monday);
  const year = parts.find(p => p.type === 'year')!.value;
  const month = parts.find(p => p.type === 'month')!.value;
  const dayPart = parts.find(p => p.type === 'day')!.value;

  // Create a date string that represents midnight ET on that Monday
  const mondayMidnightStr = `${year}-${month}-${dayPart}T00:00:00`;

  // Parse this as if it were in ET timezone by using toLocaleString to find the UTC equivalent
  const testDate = new Date(`${year}-${month}-${dayPart}T12:00:00Z`);
  const etOffset = new Date(testDate.toLocaleString('en-US', { timeZone: 'America/New_York' })).getTime() - new Date(testDate.toLocaleString('en-US', { timeZone: 'UTC' })).getTime();

  const mondayMidnight = new Date(mondayMidnightStr);
  mondayMidnight.setTime(mondayMidnight.getTime() - etOffset);

  return Math.floor(mondayMidnight.getTime() / 1000); // Unix timestamp
}

/**
 * Get Unix timestamp for next Monday 00:00:00 Eastern Time (reset time)
 */
export function getNextResetTime(now?: Date): number {
  const date = now || new Date();

  // Convert to Eastern Time
  const etString = date.toLocaleString('en-US', { timeZone: 'America/New_York' });
  const etDate = new Date(etString);

  const day = etDate.getDay();
  const daysUntilMonday = day === 0 ? 1 : 8 - day;

  // Calculate next Monday in Eastern Time
  const nextMonday = new Date(etDate);
  nextMonday.setDate(etDate.getDate() + daysUntilMonday);
  nextMonday.setHours(0, 0, 0, 0);

  // Convert back to UTC timestamp
  const mondayStr = `${nextMonday.getFullYear()}-${String(nextMonday.getMonth() + 1).padStart(2, '0')}-${String(nextMonday.getDate()).padStart(2, '0')}T00:00:00`;

  // Parse as Eastern Time by finding the UTC equivalent
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const parts = formatter.formatToParts(nextMonday);
  const year = parts.find(p => p.type === 'year')!.value;
  const month = parts.find(p => p.type === 'month')!.value;
  const dayPart = parts.find(p => p.type === 'day')!.value;

  // Create a date that represents midnight on that day in ET
  const mondayMidnightStr = `${year}-${month}-${dayPart}T00:00:00`;
  const testDate = new Date(`${year}-${month}-${dayPart}T12:00:00Z`);
  const etOffset = new Date(testDate.toLocaleString('en-US', { timeZone: 'America/New_York' })).getTime() - new Date(testDate.toLocaleString('en-US', { timeZone: 'UTC' })).getTime();

  const mondayMidnight = new Date(mondayMidnightStr);
  mondayMidnight.setTime(mondayMidnight.getTime() - etOffset);

  return Math.floor(mondayMidnight.getTime() / 1000);
}

/**
 * Format time until reset in human-readable form
 * @returns e.g., "2 days, 5 hours"
 */
export function getTimeUntilReset(now?: Date): string {
  const currentTime = now || new Date();
  const resetTime = getNextResetTime(currentTime);
  const diffSeconds = resetTime - Math.floor(currentTime.getTime() / 1000);

  const days = Math.floor(diffSeconds / 86400);
  const hours = Math.floor((diffSeconds % 86400) / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}, ${hours} hour${hours !== 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}, ${minutes} min`;
  } else {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
}
