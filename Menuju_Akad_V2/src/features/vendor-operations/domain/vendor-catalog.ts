import type { CatalogDraft, VendorContext, VendorResult, VendorWorkspace } from "../types/vendor";
import { commitVendor, denied, guardVendor } from "./vendor-guards";
import { validateVendorCatalog } from "./vendor-validation";

export function saveVendorCatalog(
  state: VendorWorkspace,
  draft: CatalogDraft,
  context: VendorContext,
  expectedVersion: number,
): VendorResult {
  const blocked = guardVendor(state, context, "catalogWrite", expectedVersion);
  if (blocked) return blocked;
  const errors = validateVendorCatalog(draft);
  if (Object.keys(errors).length) return denied(state, errors);
  if (JSON.stringify(state.catalog) === JSON.stringify(draft))
    return { ok: true, state, message: "Katalog sudah tersimpan. Tidak ada perubahan baru." };
  const next = commitVendor(
    state,
    context,
    "catalog.saved",
    state.vendorId,
    "Perbarui katalog dan profil untuk pemesanan baru.",
    { catalog: draft },
  );
  return {
    ok: true,
    state: next,
    message: "Katalog tersimpan dalam simulasi lokal. Harga dan kontrak pesanan lama tetap utuh.",
  };
}
