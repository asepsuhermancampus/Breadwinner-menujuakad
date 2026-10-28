import "server-only";
import sharp from "sharp";
import { PaymentError } from "@/server/payments/errors";

export const MAX_PROFILE_PHOTO_BYTES = 256 * 1024;
export const MAX_PROFILE_PHOTO_BODY = Math.ceil(MAX_PROFILE_PHOTO_BYTES / 3) * 4 + 256;

export async function sanitizeProfilePhoto(dataUrl: unknown) {
  const invalid = () =>
    new PaymentError("Gunakan foto JPEG persegi berukuran 256–1024 piksel", 400);
  if (typeof dataUrl !== "string") throw invalid();
  const match = /^data:image\/jpeg;base64,([A-Za-z0-9+/]+={0,2})$/.exec(dataUrl);
  if (!match || match[1]!.length % 4 !== 0) throw invalid();
  const image = Buffer.from(match[1]!, "base64");
  if (image.length > MAX_PROFILE_PHOTO_BYTES)
    throw new PaymentError("Foto profil maksimal 256 KB setelah dipotong", 413);
  if (image.toString("base64") !== match[1] || image[0] !== 0xff || image[1] !== 0xd8)
    throw invalid();
  try {
    const pipeline = sharp(image, { limitInputPixels: 1024 * 1024, failOn: "warning" });
    const metadata = await pipeline.metadata();
    if (
      metadata.format !== "jpeg" ||
      !metadata.width ||
      metadata.width !== metadata.height ||
      metadata.width < 256 ||
      metadata.width > 1024 ||
      (metadata.pages ?? 1) !== 1
    )
      throw invalid();
    return await pipeline.rotate().resize(512, 512).jpeg({ quality: 85 }).toBuffer();
  } catch (error) {
    if (error instanceof PaymentError) throw error;
    throw invalid();
  }
}
