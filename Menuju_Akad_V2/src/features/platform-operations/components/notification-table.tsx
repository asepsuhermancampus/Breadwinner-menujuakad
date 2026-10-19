import { Button } from "@/components/ui/button";
import { notificationStatus } from "../content/notifications";
import type { NotificationLog } from "../types/operations";
import { Badge } from "./operation-ui";
export function NotificationTable({
  logs,
  selected,
  onSelect,
}: {
  logs: NotificationLog[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-card border border-ux-border">
      <table className="w-full text-left text-xs">
        <caption className="sr-only">Lima contoh log notifikasi</caption>
        <thead className="bg-ux-dock text-secondary">
          <tr>
            {["Log / penerima", "Kanal", "Status", "Alasan"].map((title) => (
              <th key={title} scope="col" className="p-4 font-medium">
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr
              key={log.id}
              className={`border-t border-ux-border ${selected === log.id ? "bg-ux-soft" : ""}`}
            >
              <th scope="row" className="p-3 font-medium">
                <Button
                  variant="ghost"
                  size="small"
                  aria-pressed={selected === log.id}
                  onClick={() => onSelect(log.id)}
                >
                  {log.id} · {log.recipient}
                </Button>
              </th>
              <td className="p-3">{log.channel}</td>
              <td className="p-3">
                <Badge danger={log.status === "failed" || log.status === "canceled"}>
                  {notificationStatus[log.status]}
                </Badge>
              </td>
              <td className="p-3 text-secondary">{log.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
