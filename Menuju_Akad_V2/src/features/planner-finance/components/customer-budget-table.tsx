import type { CustomerBudget } from "../types/customer-budget";
import styles from "./finance.module.css";
export function CustomerBudgetTable({
  items,
  pending,
  edit,
  remove,
}: {
  items: CustomerBudget[];
  pending: boolean;
  edit: (item: CustomerBudget) => void;
  remove: (item: CustomerBudget) => void;
}) {
  return (
    <div className={styles.tableCard}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Kebutuhan</th>
            <th>Rencana</th>
            <th>
              <span className="sr-only">Tindakan</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                {item.title}
                {item.notes && (
                  <p className="text-xs text-secondary mt-1 whitespace-pre-wrap">{item.notes}</p>
                )}
              </td>
              <td className="font-mono whitespace-nowrap">
                Rp {(item.amount ?? 0).toLocaleString("id-ID")}
              </td>
              <td>
                <div className="flex gap-3 text-xs">
                  <button disabled={pending} className="min-h-11" onClick={() => edit(item)}>
                    Edit
                  </button>
                  <button
                    disabled={pending}
                    className="min-h-11 text-danger"
                    onClick={() => remove(item)}
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!items.length && (
        <p className="p-8 text-center text-sm text-secondary">
          Belum ada anggaran. Mulai dari kebutuhan kalian.
        </p>
      )}
    </div>
  );
}
