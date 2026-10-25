import "server-only";
import path from "node:path";
import { openReviewDatabase } from "./database";
import { ReviewRepository } from "./repository";
import { provisionAccount } from "./accounts";
import { seedReviews } from "./seed";

let instance: ReviewRepository | undefined;
export function getReviewRepository() {
  if (instance) return instance;
  const db = openReviewDatabase(
    process.env["REVIEWS_DATABASE_PATH"]?.trim() ||
      path.join(process.cwd(), ".data", "reviews.sqlite"),
  );
  try {
    const development = process.env.NODE_ENV !== "production";
    if (development || process.env["REVIEWS_SEED_DATA"] === "true") seedReviews(db);
    const email = process.env["SUPERADMIN_EMAIL"]?.trim();
    const password = process.env["SUPERADMIN_PASSWORD"];
    if (email && password) provisionAccount(db, email, password);
    instance = new ReviewRepository(db);
    return instance;
  } catch (error) {
    db.close();
    throw error;
  }
}
