import { fixtures } from '../data/fixtures';
export function warsawDate(now: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {timeZone:fixtures.delivery.timezone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
  const part = (type: string) => parts.find(p=>p.type===type)!.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}
export function upcomingDates(now = new Date()): string[] {
  const cursor = new Date(`${warsawDate(now)}T12:00:00Z`); const dates: string[] = [];
  while(dates.length < fixtures.delivery.numberOfUpcomingOptions) {
    cursor.setUTCDate(cursor.getUTCDate()+1);
    const isoDay = cursor.getUTCDay() || 7;
    if(fixtures.delivery.demoDaysOfWeekISO.includes(isoDay)) dates.push(`${cursor.getUTCFullYear()}-${String(cursor.getUTCMonth()+1).padStart(2,'0')}-${String(cursor.getUTCDate()).padStart(2,'0')}`);
  }
  return dates;
}
export const dateLabel = (date: string) => new Intl.DateTimeFormat('pl-PL',{ weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:fixtures.delivery.timezone }).format(new Date(`${date}T12:00:00Z`));
