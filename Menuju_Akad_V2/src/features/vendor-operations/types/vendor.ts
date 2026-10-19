export type VendorPackage = {
  id: string;
  name: string;
  description: string;
  priceIdr: number;
  active: boolean;
  duration: string;
  deliverables: string[];
  image: string;
};

export type VendorProfile = {
  name: string;
  ownerName: string;
  category: string;
  city: string;
  address: string;
  description: string;
  pinSet: boolean;
  cover: string;
};

export type CatalogDraft = { profile: VendorProfile; packages: VendorPackage[] };
export type UploadMetadata = { name: string; type: string; size: number };
export type PrivateEvidence = {
  id: string;
  label: string;
  extension: "pdf" | "jpg" | "jpeg" | "png";
  mimeType: string;
  sizeBytes: number;
  access: "private";
};
export type VendorBank = { bankName: string; accountName: string; last4: string };
export type BankProposal = VendorBank & {
  status: "revision-required" | "pending";
  evidence: PrivateEvidence | null;
  submittedAt: string | null;
};
export type BankRevisionDraft = {
  bankName: string;
  accountName: string;
  accountNumber: string;
  confirmAccountName: string;
  confirmAccountNumber: string;
  document: UploadMetadata | null;
  acknowledged: boolean;
  operationId: string;
};

export type VendorContract = {
  version: number;
  title: string;
  packageName: string;
  priceIdr: number;
  scope: string[];
  terms: { id: string; label: string; amountIdr: number; dueDate: string }[];
};
export type VendorOrder = {
  id: string;
  vendorId: string;
  client: string;
  eventDate: string;
  venue: string;
  packageId: string;
  status: "pending" | "accepted" | "rejected";
  version: number;
  contract: VendorContract;
  decision: { action: "accept" | "reject"; reason: string; actorId: string; at: string } | null;
};
export type DecisionInput = {
  orderId: string;
  action: "accept" | "reject";
  expectedOrderVersion: number;
  expectedVersion: number;
  reason: string;
  acknowledged: boolean;
  operationId: string;
};

export type VendorAudit = {
  id: string;
  action: "catalog.saved" | "kyb.submitted" | "order.accepted" | "order.rejected";
  objectId: string;
  actorId: string;
  vendorId: string;
  reason: string;
  previousVersion: number;
  version: number;
  at: string;
};
export type VendorWorkspace = {
  vendorId: string;
  ownerId: string;
  version: number;
  catalog: CatalogDraft;
  kyb: {
    step: number;
    totalSteps: number;
    version: number;
    status: "revision-required" | "pending";
    verifiedBank: VendorBank;
    proposedBank: BankProposal;
  };
  orders: VendorOrder[];
  audit: VendorAudit[];
  operations: Record<string, { action: string; objectId: string; version: number }>;
};
export type VendorContext = {
  role: "vendor" | "support" | "finance";
  vendorId: string;
  actorId: string;
  permissions: {
    catalogWrite: boolean;
    kybSubmit: boolean;
    orderDecide: boolean;
    calendarWrite: boolean;
    payoutRequest: boolean;
  };
  online: boolean;
  sessionValid: boolean;
  sandbox: boolean;
  availability: "hidden" | "live";
  latestVersion: number;
  slotAvailable: boolean;
  uploadState: "idle" | "pending" | "error";
  now?: () => string;
};
export type VendorResult = {
  ok: boolean;
  state: VendorWorkspace;
  message: string;
  errors?: Record<string, string>;
};
