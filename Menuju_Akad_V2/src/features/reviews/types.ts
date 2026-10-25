export type ReviewStatus = "pending" | "published" | "hidden";
export type PublicReview = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
};
export type PrivateReview = PublicReview & {
  status: ReviewStatus;
  updatedAt: string;
  moderatedAt: string | null;
  moderatedBy: string | null;
};
export type ReviewPage<T> = {
  items: T[];
  total: number;
  page: number;
  hasMore: boolean;
};
export type PublicReviewPage = ReviewPage<PublicReview> & { average: number };
export type ReviewFilters = {
  page: number;
  status?: ReviewStatus;
  rating?: number;
  search?: string;
};
