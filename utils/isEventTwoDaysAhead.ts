import type { IDriftEvent } from "~/interfaces/drift-event.interface";

export function isEventTwoDaysAhead(driftEvent: IDriftEvent | null): boolean {
  const startDate = driftEvent?.startsAt;
  if (!startDate) return false;
  const endDateString = driftEvent?.endsAt as string;
  const endDate = new Date(endDateString);
  endDate.setHours(23, 59, 59, 999); // Set to the end of the day

  const startDateTime = new Date(startDate).getTime();
  const endDateTime = endDate.getTime();
  const currentDateTime = new Date().getTime();

  const isEventOver = endDateTime < currentDateTime;
  if (isEventOver) return false;

  const twoDaysDifference = 2 * 24 * 60 * 60 * 1000; // Two days in milliseconds
  return startDateTime - currentDateTime <= twoDaysDifference;
}
