import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

/** Normalizes data to 00:00:00 local */
export function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** Add days preserving local time */
export function addDays(d: Date, days: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}


/** Convert Date -> 'YYYY-MM-DD' (local) */
export function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}


/** Avoid -1 day caused by UTC parse of 'yyyy-MM-dd' */
export function parseIsoLocalDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setHours(12, 0, 0, 0);
  return dt;
}


/** Start of the month (12pm local time to avoid TZ) */
export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1, 12, 0, 0, 0);
}


/** End of the month (12pm local time to avoid TZ) */
export function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 12, 0, 0, 0);
}


/** Stable key for month cache (YYYY-MM) */
export function monthKeyFromDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
 
export function fromDate(date: Date): NgbDateStruct {
    return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
}
  
export function toDate(struct: NgbDateStruct): Date {
    const d = new Date(struct.year, struct.month - 1, struct.day);
    d.setHours(12, 0, 0, 0);
    return d;
  }
export function isSameDay(a: Date, b: Date): boolean {
    return startOfDay(a).getTime() === startOfDay(b).getTime();
}

export function   daysRemaining(expiration: Date, ref: Date = new Date()): number {
    const msPerDay = 24 * 60 * 60 * 1000;
    const diff = startOfDay(expiration).getTime() - startOfDay(ref).getTime();
    return Math.max(0, Math.ceil(diff / msPerDay));
}