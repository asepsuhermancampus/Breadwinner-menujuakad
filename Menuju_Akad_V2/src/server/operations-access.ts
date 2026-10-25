import "server-only";
export function isOperationsEmail(
  email: string,
  allowlist = process.env["OPERATIONS_EMAIL_ALLOWLIST"] ?? "",
) {
  return allowlist
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .includes(email.trim().toLowerCase());
}
