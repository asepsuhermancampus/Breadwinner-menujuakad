import { auth } from "@/server/auth";
import { isAmbassadorOrOperator } from "@/server/identity/policy";
import { readBoundedJson } from "@/server/payments/checkout-request";
import { jsonResponse, validateSameOrigin, handlePaymentApiError } from "@/server/payments/http";
import { getWorkspaceService } from "@/server/workspaces/runtime";

export const runtime = "nodejs";

function initAmbassadorDb(db: ReturnType<typeof getWorkspaceService>["db"]) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS ambassador_withdrawals (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      amount_idr INTEGER NOT NULL,
      bank_last4 TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS ambassador_recruits (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL,
      recruit_email TEXT NOT NULL,
      recruit_name TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
}

export async function GET() {
  const session = await auth();
  if (!session?.user || !isAmbassadorOrOperator(session)) {
    return jsonResponse({ error: "Akses mitra ambassador diperlukan." }, 403);
  }
  try {
    const db = getWorkspaceService().db;
    initAmbassadorDb(db);
    const withdrawals = db
      .prepare("SELECT * FROM ambassador_withdrawals WHERE account_id=? ORDER BY created_at DESC")
      .all(session.user.id ?? "ba-default");
    const recruits = db
      .prepare("SELECT * FROM ambassador_recruits ORDER BY created_at DESC LIMIT 50")
      .all();
    return jsonResponse({ withdrawals, recruits });
  } catch (e) {
    return handlePaymentApiError(e);
  }
}

export async function POST(req: Request) {
  const origin = validateSameOrigin(req);
  if (origin) return origin;
  const session = await auth();
  if (!session?.user || !isAmbassadorOrOperator(session)) {
    return jsonResponse({ error: "Akses mitra ambassador diperlukan." }, 403);
  }
  try {
    const body = (await readBoundedJson(req, 4096)) as {
      operationId?: string;
      amountIdr?: number;
      bankLast4?: string;
    };
    if (!body.operationId || !body.amountIdr || !body.bankLast4) {
      return jsonResponse({ error: "Data penarikan belum lengkap." }, 400);
    }
    const db = getWorkspaceService().db;
    initAmbassadorDb(db);
    db.prepare(
      "INSERT INTO ambassador_withdrawals(id,account_id,amount_idr,bank_last4,status,created_at) VALUES(?,?,?,?,?,?)",
    ).run(
      body.operationId,
      session.user.id ?? "ba-default",
      body.amountIdr,
      body.bankLast4,
      "accepted",
      new Date().toISOString(),
    );
    return jsonResponse({ ok: true, operationId: body.operationId });
  } catch (e) {
    return handlePaymentApiError(e);
  }
}
