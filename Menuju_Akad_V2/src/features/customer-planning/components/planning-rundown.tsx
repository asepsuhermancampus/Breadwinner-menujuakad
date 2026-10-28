import type { PlanningViewProps } from "../domain/planning-view";
import table from "@/features/planner-rundown/components/rundown.module.css";
import styles from "./planning.module.css";
export function PlanningRundown({ items, edit, remove }: PlanningViewProps) {
  const rows = items.filter((item) => "order" in item).sort((a, b) => a.order - b.order);
  return (
    <div className={styles.stack}>
      <div className={`${styles.row} ${styles.notice}`}>
        <strong>{rows.length} kegiatan tercatat</strong>
        <span>Jadwal dan PIC dapat diedit dari detail kegiatan.</span>
      </div>
      <div className={`${table.tableContainer} app-scroll`}>
        <table className={table.table}>
          <thead>
            <tr>
              <th>Urutan</th>
              <th>Waktu (WIB)</th>
              <th>Kegiatan</th>
              <th>PIC</th>
              <th>
                <span className="sr-only">Tindakan</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.id}>
                <td className="font-mono">{item.order}</td>
                <td className="font-mono font-semibold">{item.startTime}</td>
                <td>
                  <strong>{item.title}</strong>
                  {item.notes && (
                    <p className="mt-1 text-xs text-secondary whitespace-pre-wrap">{item.notes}</p>
                  )}
                </td>
                <td>{item.pic || "Belum ditentukan"}</td>
                <td>
                  <div className={styles.actions}>
                    <button onClick={() => edit(item)}>Edit</button>
                    <button data-delete onClick={() => remove(item)}>
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className={styles.empty}>Belum ada kegiatan. Susun jadwal acara kalian.</p>
        )}
      </div>
    </div>
  );
}
