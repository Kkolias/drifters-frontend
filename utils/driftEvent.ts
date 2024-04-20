import type { IDriftEvent } from "~/interfaces/drift-event.interface";

export function eventDates(driftEvent: IDriftEvent): string {
    if (!driftEvent) return "";
    const startsAt = driftEvent?.startsAt || "";
    const endsAt = driftEvent?.endsAt || "";
    const startDate = formatISODateToStringShort(startsAt) || "";
    const endDate = formatISODateToStringShort(endsAt) || "";
    return `${startDate} - ${endDate}`;
  }