"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { calculateTargetSimulation, formatRupiah } from "../utils/finance-calc";

type Props = {
  open: boolean;
  onClose: () => void;
  targetAmount: number;
  totalContributed: number;
  onSavePlan: (newTarget: number) => void;
};

export function TargetSimulatorDialog({
  open,
  onClose,
  targetAmount,
  totalContributed,
  onSavePlan,
}: Props) {
  const [targetInput, setTargetInput] = useState(targetAmount.toString());
  const [periods, setPeriods] = useState(4);
  const [andiPercent, setAndiPercent] = useState(50);

  const numericTarget = Number.parseInt(targetInput.replace(/[^0-9]/g, ""), 10) || 150_000_000;
  const gap = Math.max(0, numericTarget - totalContributed);
  const risaPercent = 100 - andiPercent;

  const sim = calculateTargetSimulation(gap, periods, andiPercent, risaPercent);

  const handleSave = () => {
    onSavePlan(numericTarget);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} title="Simulasi Target Dana & Kontribusi">
      <div className="flex flex-col gap-4 p-5 max-w-md">
        <div>
          <h3 className="font-serif text-xl font-medium text-brand-secondary">
            Bagi target, bukan beban.
          </h3>
          <p className="text-xs text-secondary">
            Atur ritme menabung yang masuk akal untuk kalian berdua.
          </p>
        </div>

        <Field
          label="Target Dana Pernikahan (IDR)"
          value={targetInput}
          onChange={(e) => setTargetInput(e.target.value)}
        />

        <div className="rounded-card bg-ux-dock p-3 border border-border flex items-center justify-between text-xs">
          <span className="text-secondary">Setoran tercatat · dari ledger (Read-only)</span>
          <strong className="font-mono text-foreground">{formatRupiah(totalContributed)}</strong>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-secondary">Kekurangan dana (Gap)</span>
          <strong className="font-mono text-brand-secondary text-sm">{formatRupiah(gap)}</strong>
        </div>

        <div className="grid min-w-0 gap-2">
          <label className="text-sm font-medium">Jumlah Periode Setoran (Bulan)</label>
          <div className="flex items-center gap-2">
            {[2, 3, 4, 6].map((p) => (
              <button
                key={p}
                type="button"
                className={`flex-1 py-1.5 text-xs rounded-control border transition-all ${
                  periods === p
                    ? "bg-primary text-on-primary border-primary font-semibold"
                    : "border-border bg-surface text-secondary hover:text-foreground"
                }`}
                onClick={() => setPeriods(p)}
              >
                {p} Bulan
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <span>Pembagian: Andi {andiPercent}%</span>
            <span>Risa {risaPercent}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={andiPercent}
            onChange={(e) => setAndiPercent(Number.parseInt(e.target.value, 10))}
            className="w-full cursor-pointer accent-primary"
          />
        </div>

        <div className="rounded-card bg-surface p-3.5 border border-border flex flex-col gap-2 text-xs">
          <span className="font-semibold text-foreground">
            Kebutuhan: {formatRupiah(sim.perPeriod)} / periode
          </span>
          <div className="grid grid-cols-2 gap-2 text-secondary pt-1 border-t border-border">
            <div>
              <span>Andi ({andiPercent}%):</span>
              <strong className="block font-mono text-foreground text-sm">
                {formatRupiah(sim.andiPerPeriod)}
              </strong>
            </div>
            <div>
              <span>Risa ({risaPercent}%):</span>
              <strong className="block font-mono text-foreground text-sm">
                {formatRupiah(sim.risaPerPeriod)}
              </strong>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Simpan Rencana
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
