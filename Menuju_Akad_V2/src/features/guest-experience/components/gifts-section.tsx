"use client";

export function GiftsSection({ onBack }: { onBack: () => void }) {
  return (
    <section className="grid gap-5 px-5 py-6" aria-label="Hadiah opsional">
      <button
        type="button"
        onClick={onBack}
        className="flex min-h-11 w-fit items-center gap-1.5 text-xs font-semibold text-secondary"
      >
        ← Kembali
      </button>
      <header className="grid gap-2 text-center">
        <h2 className="whitespace-pre-line font-serif text-4xl leading-tight">
          {"Doa Anda\nsudah berarti."}
        </h2>
        <p className="text-xs text-secondary">
          Memberi hadiah tidak menjadi syarat kehadiran atau RSVP.
        </p>
      </header>
      <div className="rounded-card border border-border bg-canvas p-4" role="status">
        <p className="text-xs font-bold">Hadiah nonaktif</p>
        <p className="mt-1 text-xs text-secondary">
          Modul hadiah tidak diaktifkan untuk undangan Andi &amp; Risa. Tidak ada QRIS aktif,
          rekening, atau alamat pengiriman yang ditampilkan.
        </p>
      </div>
    </section>
  );
}
