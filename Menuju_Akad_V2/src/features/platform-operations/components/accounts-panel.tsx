import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Status } from "@/components/ui/status";
import { accountEntries, supportPermissions, supportRestrictions } from "../content/accounts";
import type { PanelProps } from "../types/panel";
import { Inspector, OperationHeading, OperationNote } from "./operation-ui";
import { AccountTable } from "./account-table";
import { AccountReview } from "./account-review";
export function AccountsPanel({ context }: PanelProps) {
  const [accounts, setAccounts] = useState(accountEntries);
  const [selected, setSelected] = useState<string[]>([]);
  const [inspected, setInspected] = useState("farah");
  const [review, setReview] = useState(false);
  const [saved, setSaved] = useState("");
  const account = accounts.find((item) => item.id === inspected)!;
  function toggle(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }
  function reviewOne() {
    setSelected([inspected]);
    setReview(true);
  }
  return (
    <>
      <OperationHeading
        title="Hak akses sesuai tanggung jawab."
        description="Role, izin, paket dan availability bukan hal yang sama."
        action={
          <Button disabled={!selected.length} onClick={() => setReview(true)}>
            Tinjau tindakan massal
          </Button>
        }
      />
      {saved && <Status tone="success">{saved}</Status>}
      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
        <div className="grid min-w-0 content-start gap-5">
          <AccountTable
            accounts={accounts}
            selected={selected}
            onToggle={toggle}
            onInspect={setInspected}
          />
          <p className="text-xs text-secondary">
            {selected.length} dipilih · tindakan massal harus ditinjau dan dikonfirmasi.
            {!selected.length && " Pilih akun untuk mengaktifkan review massal."}
          </p>
          <OperationNote title="Tidak ada workspace staf atau tamu tambahan">
            Tamu personal tidak wajib akun. Staf check-in memakai delegasi event; bukan role
            workspace keenam. Status Hidden tetap lapisan availability, bukan penghapusan akun.
          </OperationNote>
        </div>
        <Inspector
          title={`${account.name} · ${account.scope}`}
          description={`v${account.version} · ${account.sessions} sesi aktif. Izin mengikuti tanggung jawab.`}
        >
          {account.id === "farah" ? (
            <>
              <ul className="grid gap-3 text-xs text-primary">
                {supportPermissions.map((permission) => (
                  <li key={permission}>✓ {permission}</li>
                ))}
              </ul>
              <ul className="grid gap-3 text-xs text-secondary">
                {supportRestrictions.map((restriction) => (
                  <li key={restriction}>— {restriction}</li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-xs leading-relaxed text-secondary">
              Akses {account.scope} tetap mengikuti objek, acara, entitlement dan availability saat
              tindakan. Tidak ada pemberian scope admin melalui layar ini.
            </p>
          )}
          <Button variant="secondary" onClick={reviewOne}>
            Tinjau perubahan izin / sesi
          </Button>
          <p className="text-xs font-semibold">Tidak boleh menaikkan izin sendiri</p>
          <p className="text-xs leading-relaxed text-secondary">
            Perubahan membutuhkan otorisasi, alasan dan audit. Pembatasan meninjau setiap akun serta
            admin terakhir, lalu memutus sesi terkait.
          </p>
        </Inspector>
      </div>
      {review && (
        <AccountReview
          accounts={accounts}
          selected={selected}
          context={context}
          onClose={() => setReview(false)}
          onSave={(entries, message) => {
            setAccounts(entries);
            setSaved(message);
            setSelected([]);
          }}
        />
      )}
    </>
  );
}
