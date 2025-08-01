// controllers/favorite.controller.ts
import { Request, Response } from "express";
import { Favorite } from "../model/favorite.model";
import { uploadFromUrl } from "../helper/cloudinaryUpload";

export const addToFavorites = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, recipe, image } = req.body; // `image` is URL (either from middleware or user-provided)
    const userId = res.locals.jwtData.id;

    let imageUrl = image;

    // If it's not already a Cloudinary URL, assume it's a base64/URL and upload
    if (!image.includes("res.cloudinary.com")) {
      imageUrl = await uploadFromUrl(image);
    }

    const favorite = await Favorite.create({
      userId,
      name,
      description,
      recipe,
      image: imageUrl,
    });

    res.status(201).json("Favorite added successfully");
  } catch (error) {
    console.error("Error adding to favorites:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const removeFromFavorites = async (req: Request, res: Response): Promise<void> => {
  try {
    const { favoriteId } = req.body;

    const favorite = await Favorite.findByIdAndDelete(favoriteId);

    if (!favorite) {
      res.status(404).json({ error: "Favorite not found" });
      return
    }

    res.status(200).json("Favorite removed successfully");
  } catch (error) {
    console.error("Error removing from favorites:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


export const getFavorites = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = res.locals.jwtData.id;

    const favorites = await Favorite.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

