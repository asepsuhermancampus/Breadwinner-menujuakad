export function integerText(value: string) {
  return value.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
}
export function integerValue(value: string, maximum: number) {
  return Math.min(maximum, Number(integerText(value)) || 0);
}
