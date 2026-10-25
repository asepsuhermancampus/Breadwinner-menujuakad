import { describe, it, expect } from "vitest";
import { validateKuaFile, MAX_KUA_FILE_SIZE } from "./kua-validation";

describe("validateKuaFile", () => {
  it("rejects null or missing file", () => {
    const res = validateKuaFile(null);
    expect(res.valid).toBe(false);
    if (!res.valid) {
      expect(res.error).toBe("Pilih berkas terlebih dahulu.");
    }
  });

  it("rejects 0 byte empty file", () => {
    const file = new File([], "empty.pdf", { type: "application/pdf" });
    const res = validateKuaFile(file);
    expect(res.valid).toBe(false);
    if (!res.valid) {
      expect(res.error).toContain("kosong");
    }
  });

  it("rejects files larger than 5MB", () => {
    const file = new File([new Uint8Array(MAX_KUA_FILE_SIZE + 1)], "large.pdf", {
      type: "application/pdf",
    });
    const res = validateKuaFile(file);
    expect(res.valid).toBe(false);
    if (!res.valid) {
      expect(res.error).toContain("5MB");
    }
  });

  it("accepts file exactly at 5MB limit", () => {
    const file = new File([new Uint8Array(MAX_KUA_FILE_SIZE)], "limit.pdf", {
      type: "application/pdf",
    });
    const res = validateKuaFile(file);
    expect(res.valid).toBe(true);
  });

  it("accepts valid PDF, JPG, JPEG, and PNG files", () => {
    const pdf = new File([new Uint8Array(100)], "scan.pdf", { type: "application/pdf" });
    const jpg = new File([new Uint8Array(100)], "photo.jpg", { type: "image/jpeg" });
    const jpeg = new File([new Uint8Array(100)], "photo.jpeg", { type: "image/jpeg" });
    const png = new File([new Uint8Array(100)], "card.png", { type: "image/png" });

    expect(validateKuaFile(pdf).valid).toBe(true);
    expect(validateKuaFile(jpg).valid).toBe(true);
    expect(validateKuaFile(jpeg).valid).toBe(true);
    expect(validateKuaFile(png).valid).toBe(true);
  });

  it("rejects mismatched MIME and extension", () => {
    const fakePng = new File([new Uint8Array(100)], "virus.exe", { type: "image/png" });
    const fakePdf = new File([new Uint8Array(100)], "fake.png", { type: "application/pdf" });
    const exe = new File([new Uint8Array(100)], "exploit.pdf.exe", { type: "application/pdf" });

    expect(validateKuaFile(fakePng).valid).toBe(false);
    expect(validateKuaFile(fakePdf).valid).toBe(false);
    expect(validateKuaFile(exe).valid).toBe(false);
  });

  it("rejects unsupported MIME types and extensions", () => {
    const txt = new File([new Uint8Array(100)], "doc.txt", { type: "text/plain" });
    const zip = new File([new Uint8Array(100)], "docs.zip", { type: "application/zip" });

    expect(validateKuaFile(txt).valid).toBe(false);
    expect(validateKuaFile(zip).valid).toBe(false);
  });
});
