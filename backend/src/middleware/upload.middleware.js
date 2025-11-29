import multer from "multer";
import sharp from "sharp";
import cloudinary from "../config/cloudinary.js";

const upload = multer({ storage: multer.memoryStorage() });

export const uploadToCloudinary = async (buffer, filename) => {
  const optimizedImage = await sharp(buffer)
    .resize(800)
    .toFormat("webp", { quality: 80 })
    .toBuffer();

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: "image", folder: "ecommerce-products", public_id: filename.split(".")[0] },
      (err, result) => {
        if (err) reject(err);
        else resolve(result.secure_url);
      }
    ).end(optimizedImage);
  });
};

export default upload;
