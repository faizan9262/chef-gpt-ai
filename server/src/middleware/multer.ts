// middleware/uploadMiddleware.ts
import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { uploadBufferToCloudinary } from "../helper/cloudinaryUpload";

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    allowed.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Only .jpg, .jpeg, and .png are allowed"));
  },
});

export const uploadMiddleware = upload.single("image");

export const uploadToCloudinaryMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const imageUrl = await uploadBufferToCloudinary(req.file.buffer);
    req.body.image = imageUrl; // Replace with uploaded URL
    next();
  } catch (err) {
    console.error("Upload Middleware Error:", err);
    res.status(500).json({ message: "Failed to upload image" });
  }
};
