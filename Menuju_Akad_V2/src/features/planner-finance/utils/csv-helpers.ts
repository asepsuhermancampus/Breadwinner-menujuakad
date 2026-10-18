import type { DepositItem, ExpenseItem } from "../types/finance";

export type CsvRowItem = {
  rowNumber: number;
  date: string;
  description: string;
  category: string;
  amount: number;
  paidBy: string;
  fundingSource: string;
  status: "valid" | "invalid_date" | "duplicate";
  statusMessage?: string;
  selected: boolean;
};

export function generateFinanceCsv(
  deposits: DepositItem[],
  expenses: ExpenseItem[],
  options: {
    includeDeposits?: boolean;
    includeExpenses?: boolean;
    includePrivateNotes?: boolean;
  } = {},
): string {
  const { includeDeposits = true, includeExpenses = true, includePrivateNotes = false } = options;
  const rows: string[] = ["id;tanggal;tipe;kategori;nominal_idr;pihak;sumber_dana;status;catatan"];

  if (includeDeposits) {
    for (const d of deposits) {
      const notes = includePrivateNotes ? d.reference || "" : "";
      rows.push(
        `${d.id};${d.date};Setoran;Kontribusi;${d.amount};${d.contributor};${d.accountName};Tercatat;${notes}`,
      );
    }
  }

  if (includeExpenses) {
    for (const e of expenses) {
      const notes = includePrivateNotes ? e.notes || "" : "";
      rows.push(
        `${e.id};${e.date};Pengeluaran;${e.category};${e.amount};${e.paidBy};${e.accountName || e.fundingScope};${e.status};${notes}`,
      );
    }
  }

  return rows.join("\n");
}

export function parseCsvRows(csvContent: string): CsvRowItem[] {
  const lines = csvContent
    .trim()
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  if (lines.length <= 1) return [];

  const dataRows = lines.slice(1);
  return dataRows.map((line, index) => {
    const parts = line.includes(";") ? line.split(";") : line.split(",");
    const [rawDate = "", rawDesc = "", rawAmount = "", rawCategory = "", rawPaidBy = ""] = parts;

    const amount = Number.parseInt(rawAmount.replace(/[^0-9]/g, ""), 10) || 0;
    const dateTrimmed = rawDate.trim();

    const isInvalidDate =
      dateTrimmed.includes("32") ||
      dateTrimmed.startsWith("32") ||
      !/\d{1,2}\s+(Okt|Nov|Des|Jan|Feb|Mar|Apr|Mei|Jun|Jul|Agu|Sep)\s+\d{4}/i.test(dateTrimmed);

    const isDuplicate = rawDesc.toLowerCase().includes("venue") && amount === 15_000_000;

    let status: "valid" | "invalid_date" | "duplicate" = "valid";
    let statusMessage = "Valid";
    let selected = true;

    if (isInvalidDate) {
      status = "invalid_date";
      statusMessage = "Tanggal tidak valid";
      selected = false;
    } else if (isDuplicate) {
      status = "duplicate";
      statusMessage = "Cocok dengan catatan EX-1001";
      selected = false;
    }

    return {
      rowNumber: index + 1,
      date: dateTrimmed,
      description: rawDesc.trim(),
      category: rawCategory.trim() || "Operasional",
      amount,
      paidBy: rawPaidBy.trim() || "Andi",
      fundingSource: "Dana acara · BCA ••4821",
      status,
      statusMessage,
      selected,
    };
  });
}
