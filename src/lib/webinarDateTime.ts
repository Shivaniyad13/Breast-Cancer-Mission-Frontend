export const WEBINAR_TIME_ZONE = "Asia/Kolkata";

export function formatWebinarTime(value: string | Date) {
  return new Date(value).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: WEBINAR_TIME_ZONE,
  });
}

export function getWebinarDateInputValue(value: string | Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: WEBINAR_TIME_ZONE,
  }).formatToParts(new Date(value));
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "";

  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function getWebinarTimeInputValue(value: string | Date) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: WEBINAR_TIME_ZONE,
  }).format(new Date(value));
}

export function toWebinarDateTimeISOString(date: string, time: string) {
  return new Date(`${date}T${time}:00+05:30`).toISOString();
}
