import { format, parseISO, differenceInMinutes } from 'date-fns';

export function formatPrice(amount: number | string, currency: string = 'USD'): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount);
}

export function formatTime(isoString: string): string {
  return format(parseISO(isoString), 'HH:mm');
}

export function formatDate(isoString: string): string {
  return format(parseISO(isoString), 'EEE, MMM d');
}

export function formatFullDate(isoString: string): string {
  return format(parseISO(isoString), 'EEEE, MMMM d, yyyy');
}

export function formatDuration(isoDuration: string): string {
  // Parse ISO 8601 duration (e.g., "PT2H30M")
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return isoDuration;

  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;

  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

export function formatStops(stops: number): string {
  if (stops === 0) return 'Nonstop';
  if (stops === 1) return '1 stop';
  return `${stops} stops`;
}

export function getTimeOfDay(isoString: string): string {
  const hour = parseISO(isoString).getHours();
  if (hour >= 5 && hour < 12) return 'Morning';
  if (hour >= 12 && hour < 17) return 'Afternoon';
  if (hour >= 17 && hour < 21) return 'Evening';
  return 'Night';
}

export function getHourFromISO(isoString: string): number {
  return parseISO(isoString).getHours();
}

export function calculateTotalDuration(segments: { duration: string }[]): string {
  let totalMinutes = 0;

  segments.forEach(segment => {
    const match = segment.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (match) {
      const hours = match[1] ? parseInt(match[1]) : 0;
      const minutes = match[2] ? parseInt(match[2]) : 0;
      totalMinutes += hours * 60 + minutes;
    }
  });

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `PT${hours}H${minutes}M`;
}

export function getLayoverDuration(arrival: string, departure: string): string {
  const minutes = differenceInMinutes(parseISO(departure), parseISO(arrival));
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m layover`;
  if (mins === 0) return `${hours}h layover`;
  return `${hours}h ${mins}m layover`;
}
