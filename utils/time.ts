

export function formatISODateToString(date: string): string {
    return date.replace(/T.*/, '').split('-').reverse().join('.')
}

export function formatISODateToStringShort(date: string): string {
    // 2021-12-31 -> 31.12.2021 
    // 2020-01-01 -> 1.1.2020
    const dateArray = date.split('-')
    return `${parseInt(dateArray[2])}.${parseInt(dateArray[1])}.${dateArray[0]}`
}

export function toLocaleString(date: Date | string): string {
    return new Date(date).toLocaleString()
}

export function toLocaleDateString(date: Date | string): string {
    return new Date(date).toLocaleDateString()
}

export function toLocaleTimeString(date: Date | string): string {
    return new Date(date).toLocaleTimeString()
}

export function isCurrentTimeBetween(startsAt: Date | string, endsAt: Date | string): boolean {
    const startDate = new Date(startsAt)
    const d1 = startDate.getTime()
    const endDate = new Date(endsAt)
    const d2 = endDate.getTime()

    const currentDate = new Date
    const currentTime = currentDate.getTime()

    return d1 < currentTime && d2 > currentTime
}

export function isBefore(dateToBeBefore: Date | string, dateToBeAfter: Date | string): boolean {
    return new Date(dateToBeBefore) < new Date(dateToBeAfter)
}

export function getMinutesLeftCurrently(startsAt: Date | string, endsAt: Date | string, currentTimeProp?: Date): string {
    const isActive = isCurrentTimeBetween(startsAt, endsAt)
    if(!isActive) return '0'

    const currentDate = currentTimeProp ? currentTimeProp : new Date()

    const currentTime = currentDate.getTime()

    const endsAtTime = new Date(endsAt).getTime()

    const timeLeft = endsAtTime - currentTime

    return msToTime(timeLeft);
}

function msToTime(ms: number) {
    if (ms >= 24 * 60 * 60 * 1000) {
      // More than one day
      const days = Math.floor(ms / (24 * 60 * 60 * 1000));
      return `${days} päivä${days > 1 ? 'ä' : ''}`;
    } else if (ms >= 60 * 60 * 1000) {
      // More than one hour
      const hours = Math.floor(ms / (60 * 60 * 1000));
      const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
      const seconds = Math.floor((ms % (60 * 1000)) / 1000);
      return `${hours}:${minutes}:${seconds}`;
    } else if (ms >= 60 * 1000) {
      // More than one minute
      const minutes = Math.floor(ms / (60 * 1000));
      const seconds = Math.floor((ms % (60 * 1000)) / 1000);
      return `${minutes}:${seconds}`;
    } else {
      // Less than one minute
      const seconds = Math.floor(ms / 1000);
      return `${seconds}s`;
    }
  }

  export function formatUTCDateTime(utcDateStr: string): string {
    // Create a new Date object from the UTC string
    let date = new Date(utcDateStr);

    // Extract UTC components
    let year = date.getUTCFullYear();
    let month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    let day = String(date.getUTCDate()).padStart(2, '0');
    let hours = String(date.getUTCHours()).padStart(2, '0');
    let minutes = String(date.getUTCMinutes()).padStart(2, '0');
    let seconds = String(date.getUTCSeconds()).padStart(2, '0');
    let milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');

    // Construct the base format "yyyy-MM-ddThh:mm"
    let formatted = `${year}-${month}-${day}T${hours}:${minutes}`;

    // Append seconds and milliseconds if needed
    if (seconds !== '00' || milliseconds !== '000') {
        formatted += `:${seconds}`;
        if (milliseconds !== '000') {
            formatted += `.${milliseconds}`;
        }
    }

    return formatted;
}