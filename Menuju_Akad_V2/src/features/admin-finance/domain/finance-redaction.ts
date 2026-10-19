export const redactFinanceText = (value: string) =>
  value
    .replace(/\b\d{6,}\b/g, "[disamarkan]")
    .replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, "[email privat]")
    .replace(/(?:otp|secret|token|password|api[_ -]?key)\s*[:=]\s*\S+/gi, "[rahasia disamarkan]");
