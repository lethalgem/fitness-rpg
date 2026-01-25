// Time utility functions for weekly leaderboard resets
// All resets happen at Sunday 23:59:00 Eastern Time (America/New_York)

/**
 * Get the current Eastern Time offset in milliseconds
 * Returns negative value (e.g., -5 hours = -18000000 for EST, -4 hours for EDT)
 */
function getEasternOffsetMs(date: Date): number {
  // Format the date in both UTC and Eastern, then compare
  const utcString = date.toLocaleString('en-US', { timeZone: 'UTC' });
  const etString = date.toLocaleString('en-US', { timeZone: 'America/New_York' });

  const utcDate = new Date(utcString);
  const etDate = new Date(etString);

  // ET offset = ET - UTC (will be negative, e.g., -5 hours)
  return etDate.getTime() - utcDate.getTime();
}

/**
 * Get the day of week (0=Sunday, 1=Monday, etc.) in Eastern Time
 */
function getEasternDayOfWeek(date: Date): number {
  const etString = date.toLocaleString('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short'
  });
  const dayMap: Record<string, number> = {
    'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6
  };
  return dayMap[etString] ?? 0;
}

/**
 * Get Eastern Time date components
 */
function getEasternDateParts(date: Date): { year: number; month: number; day: number; hour: number } {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    hour12: false
  });

  const parts = formatter.formatToParts(date);
  return {
    year: parseInt(parts.find(p => p.type === 'year')!.value),
    month: parseInt(parts.find(p => p.type === 'month')!.value),
    day: parseInt(parts.find(p => p.type === 'day')!.value),
    hour: parseInt(parts.find(p => p.type === 'hour')!.value)
  };
}

/**
 * Get Unix timestamp for Sunday 23:59:00 Eastern Time that started the current week
 */
export function getStartOfWeek(now?: Date): number {
  const date = now || new Date();
  const etDay = getEasternDayOfWeek(date);
  const etParts = getEasternDateParts(date);

  // Calculate days to go back to reach the most recent Sunday
  // We want the Sunday that STARTED this week (i.e., the previous Sunday at 23:59)
  // Sunday (0) -> if before 23:59, go back 7 days; otherwise 0
  // Monday (1) -> go back 1 day
  // Tuesday (2) -> go back 2 days
  // etc.
  let daysToSunday: number;
  if (etDay === 0) {
    // It's Sunday - check if we're past 23:59 (we basically never are)
    // For safety, assume we're before 23:59, so the week started LAST Sunday
    daysToSunday = 7;
  } else {
    daysToSunday = etDay;
  }

  // Create a date for that Sunday at 23:59 UTC first
  const sundayUTC = new Date(Date.UTC(etParts.year, etParts.month - 1, etParts.day - daysToSunday, 23, 59, 0, 0));

  // Get the ET offset for that Sunday (to handle DST correctly)
  const etOffset = getEasternOffsetMs(sundayUTC);

  // Adjust: we want 23:59 ET, so subtract the offset
  const sunday2359ET = new Date(sundayUTC.getTime() - etOffset);

  return Math.floor(sunday2359ET.getTime() / 1000);
}

/**
 * Get Unix timestamp for next Sunday 23:59:00 Eastern Time (reset time)
 */
export function getNextResetTime(now?: Date): number {
  const date = now || new Date();
  const etDay = getEasternDayOfWeek(date);
  const etParts = getEasternDateParts(date);

  // Calculate days until next Sunday at 23:59
  // Sunday (0) -> 0 days (today at 23:59, if we haven't passed it yet) or 7 days
  // Monday (1) -> 6 days
  // Tuesday (2) -> 5 days
  // Wednesday (3) -> 4 days
  // Thursday (4) -> 3 days
  // Friday (5) -> 2 days
  // Saturday (6) -> 1 day
  let daysUntilSunday = etDay === 0 ? 0 : 7 - etDay;

  // Create a date for that Sunday at 23:59 UTC first
  let sundayUTC = new Date(Date.UTC(etParts.year, etParts.month - 1, etParts.day + daysUntilSunday, 23, 59, 0, 0));

  // Get the ET offset for that Sunday (to handle DST correctly)
  let etOffset = getEasternOffsetMs(sundayUTC);

  // Adjust: we want 23:59 ET
  let sunday2359ET = new Date(sundayUTC.getTime() - etOffset);

  // If the calculated time is in the past (e.g., it's Sunday at 11:59:30 PM), add 7 days
  if (sunday2359ET.getTime() <= date.getTime()) {
    sundayUTC = new Date(Date.UTC(etParts.year, etParts.month - 1, etParts.day + daysUntilSunday + 7, 23, 59, 0, 0));
    etOffset = getEasternOffsetMs(sundayUTC);
    sunday2359ET = new Date(sundayUTC.getTime() - etOffset);
  }

  return Math.floor(sunday2359ET.getTime() / 1000);
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
