// utils/cloudinaryUpload.ts
import streamifier from "streamifier";
import cloudinary from "../config/cloudinary";

// Uploads from file buffer (used with multer)
export const uploadBufferToCloudinary = (buffer: Buffer, folder = "ChefGPT"): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = streamifier.createReadStream(buffer);

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result?.secure_url);
      }
    );

    stream.pipe(uploadStream);
  });
};

// Uploads directly from base64 or external URL
export const uploadFromUrl = async (imageUrl: string, folder = "ChefGPT"): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, { folder });
    return result.secure_url;
  } catch (err) {
    console.error("Cloudinary Upload (URL) Error:", err);
    throw err;
  }
};
