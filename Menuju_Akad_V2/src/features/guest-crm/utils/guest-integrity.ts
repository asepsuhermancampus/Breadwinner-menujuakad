type Guest = {
  personalToken: string;
  quota: number;
  attendingCount: number;
  checkedInCount?: number | undefined;
};
export function validGuestIntegrity(items: Guest[]): boolean {
  return (
    new Set(items.map((item) => item.personalToken)).size === items.length &&
    items.every(
      (item) => item.attendingCount <= item.quota && (item.checkedInCount ?? 0) <= item.quota,
    )
  );
}
