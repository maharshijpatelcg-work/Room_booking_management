export function doIntervalsOverlap(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date
): boolean {
  return start1 < end2 && end1 > start2;
}

export function combineDateAndTime(date: Date | string, time: string): Date {
  const d = new Date(date);
  const [hours, minutes] = time.split(":").map(Number);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

export function isOverdue(expectedReturnDate: Date | string): boolean {
  return new Date(expectedReturnDate) < new Date();
}

export function formatDateForDisplay(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
