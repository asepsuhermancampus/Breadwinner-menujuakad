import type { AnalyticsFixture } from "../types/manager";

export function analyticsCsv(data: AnalyticsFixture): string {
  return [
    "metrik;nilai;periode",
    `unique_visitors;${data.uniqueVisitors};${data.range}`,
    `sessions;${data.sessions};${data.range}`,
    `personal_opens;${data.personalOpens};${data.range}`,
    `online_answers;${data.onlineAnswers};${data.range}`,
    ...data.daily.map((day) => `sessions_${day.label};${day.sessions};${data.range}`),
    ...data.devices.map((device) => `device_${device.label};${device.sessions};${data.range}`),
  ].join("\r\n");
}
