import { Button } from "@/components/ui/button";
import type { AccountEntry } from "../types/operations";
import { Badge } from "./operation-ui";
type Props = {
  accounts: AccountEntry[];
  selected: string[];
  onToggle: (id: string) => void;
  onInspect: (id: string) => void;
};
export function AccountTable({ accounts, selected, onToggle, onInspect }: Props) {
  return (
    <div className="overflow-x-auto rounded-card border border-ux-border">
      <table className="w-full text-left text-xs">
        <caption className="sr-only">Akun dan otorisasi sesuai scope</caption>
        <thead className="bg-ux-dock text-secondary">
          <tr>
            <th scope="col" className="p-3">
              <span className="sr-only">Pilihan</span>
            </th>
            {["Akun", "Role / scope", "Status"].map((title) => (
              <th key={title} scope="col" className="p-3 font-medium">
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id} className="border-t border-ux-border">
              <td className="p-2">
                <label className="flex size-11 items-center justify-center">
                  <input
                    type="checkbox"
                    aria-label={`Pilih ${account.name}`}
                    checked={selected.includes(account.id)}
                    onChange={() => onToggle(account.id)}
                  />
                </label>
              </td>
              <th scope="row" className="p-2 font-medium">
                <Button variant="ghost" size="small" onClick={() => onInspect(account.id)}>
                  {account.name}
                </Button>
              </th>
              <td className="p-3 text-secondary">{account.scope}</td>
              <td className="p-3">
                <Badge danger={account.status === "Dibatasi"}>{account.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
