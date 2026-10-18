export function MarketplaceRecoveryView() {
  return (
    <div className="p-5 bg-surface rounded-2xl border border-border space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-border">
        <div>
          <h3 className="font-bold text-foreground text-sm">Akses Aman & Pemulihan Katalog</h3>
          <p className="text-xs text-secondary mt-0.5">
            Panduan arsitektur keamanan untuk rilis produksi dan pemulihan data pesanan historis.
          </p>
        </div>
        <span className="text-xs font-mono bg-subtle px-2.5 py-1 rounded text-primary font-bold">
          Release #43
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="p-3 bg-canvas rounded-xl border border-border space-y-1.5">
          <div className="font-bold text-foreground">1. Portal Vendor & BA (Status: Hidden)</div>
          <p className="text-secondary leading-relaxed">
            Pada release #43, rute publik Vendor dan Brand Ambassador berstatus{" "}
            <strong>Hidden</strong>. Entrypoint disembunyikan dan URL langsung dialihkan ke login
            secara fail-closed.
          </p>
        </div>

        <div className="p-3 bg-canvas rounded-xl border border-border space-y-1.5">
          <div className="font-bold text-foreground">2. Pemulihan Pesanan Historis</div>
          <p className="text-secondary leading-relaxed">
            Status Hidden tidak menghapus pesanan yang sudah dibeli atau hak akses produk digital.
            Pelanggan lama dapat memulihkan invoice dan receipt melalui token pesanan resmi.
          </p>
        </div>

        <div className="p-3 bg-canvas rounded-xl border border-border space-y-1.5">
          <div className="font-bold text-foreground">3. Penanganan Data Kosong</div>
          <p className="text-secondary leading-relaxed">
            Ketika filter kota atau tanggal tidak memiliki vendor yang tersedia, filter dan pilihan
            paket Anda tetap aman tersimpan tanpa melakukan pemesanan sepihak.
          </p>
        </div>

        <div className="p-3 bg-canvas rounded-xl border border-border space-y-1.5">
          <div className="font-bold text-foreground">4. Inkonsistensi Versi & Lock</div>
          <p className="text-secondary leading-relaxed">
            Jika versi kontrak atau ketersediaan vendor berubah saat peninjauan, server menolak
            commit dan meminta konfirmasi eksplisit dari pengguna.
          </p>
        </div>
      </div>
    </div>
  );
}
