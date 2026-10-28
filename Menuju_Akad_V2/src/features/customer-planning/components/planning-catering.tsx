"use client";
import { useUrlTab } from "@/hooks/use-url-tab";
import { useId } from "react";
import { Button } from "@/components/ui/button";
import { SummaryCard } from "@/components/ui/summary-card";
import type { PlanningViewProps } from "../domain/planning-view";
import type { CustomerBudget } from "@/features/planner-finance/types/customer-budget";
import type { CateringEstimate } from "./use-catering-estimate";
import { CateringSavedMenus } from "./catering-saved-menus";
import { CateringBasis } from "./catering-basis";
import catering from "./planning-catering.module.css";
import layout from "./catering-workspace.module.css";
import styles from "./planning.module.css";
export function PlanningCatering({
  items,
  edit,
  remove,
  estimate,
  guestError,
  guestsLoading,
  add,
  budgets,
  budgetError,
}: PlanningViewProps & {
  estimate: CateringEstimate;
  guestError: string;
  guestsLoading: boolean;
  add: () => void;
  budgets: CustomerBudget[] | null;
  budgetError: string;
}) {
  const { input, result } = estimate;
  const [tab, setTab] = useUrlTab("tab", ["calculation", "menus"], "calculation");
  const id = useId();
  const tabs = [
    ["calculation", "Dasar perhitungan"],
    ["menus", "Menu katering tersimpan"],
  ] as const;
  return (
    <div className={styles.stack}>
      <div className={layout.toolbar}>
        <div className={layout.tabs} role="tablist" aria-label="Katering" data-customer-tabs>
          {tabs.map(([value, label], index) => (
            <button
              key={value}
              type="button"
              role="tab"
              id={id + "-" + value + "-tab"}
              aria-controls={id + "-panel"}
              aria-selected={tab === value}
              tabIndex={tab === value ? 0 : -1}
              onClick={() => setTab(value)}
              onKeyDown={(event) => {
                if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
                event.preventDefault();
                const next = event.key === "Home" ? 0 : event.key === "End" ? 1 : 1 - index;
                setTab(tabs[next]![0]);
                document.getElementById(id + "-" + tabs[next]![0] + "-tab")?.focus();
              }}
            >
              {label}
            </button>
          ))}
        </div>
        {tab === "menus" && (
          <Button size="small" onClick={add}>
            + Menu katering
          </Button>
        )}
        {tab === "calculation" && (
          <Button
            size="small"
            disabled={estimate.saving || !estimate.dirty || !estimate.canSave}
            onClick={() => void estimate.save()}
          >
            {estimate.saving ? "Menyimpan..." : "Simpan perhitungan"}
          </Button>
        )}
      </div>
      {estimate.saveError && (
        <p role="alert" className="text-sm text-danger">
          {estimate.saveError}
        </p>
      )}
      <div
        role="tabpanel"
        id={id + "-panel"}
        aria-labelledby={id + "-" + tab + "-tab"}
        className={styles.stack}
      >
        {tab === "calculation" ? (
          <>
            <div className={catering.summaries}>
              <SummaryCard
                label="Estimasi tamu"
                value={result.totalWithBuffer.toLocaleString("id-ID")}
                detail={`Termasuk ${result.bufferPax.toLocaleString("id-ID")} orang cadangan`}
                ornament={1}
                highlight
              />
              <SummaryCard
                label="Prasmanan utama"
                value={result.buffetPax.toLocaleString("id-ID")}
                detail={`${input.buffetPercent}% dari estimasi tamu`}
                ornament={2}
              />
              <SummaryCard
                label="Porsi gubukan"
                value={result.stallPortionsTotal.toLocaleString("id-ID")}
                detail={`${input.stallDishesCount} jenis sajian, masing-masing ${result.stallPax.toLocaleString("id-ID")} porsi`}
                ornament={3}
              />
              <SummaryCard
                label="Total sajian"
                value={result.totalPortions.toLocaleString("id-ID")}
                detail="Porsi prasmanan dan seluruh gubukan"
                ornament={4}
                highlight
              />
            </div>
            <CateringBasis
              estimate={estimate}
              guestError={guestError}
              guestsLoading={guestsLoading}
            />
          </>
        ) : (
          <CateringSavedMenus
            items={items}
            edit={edit}
            remove={remove}
            budgets={budgets}
            budgetError={budgetError}
          />
        )}
      </div>
    </div>
  );
}
