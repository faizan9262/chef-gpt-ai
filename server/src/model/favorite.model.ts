import mongoose, { Model, Schema } from "mongoose";

interface IFavorite extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  recipe: string[];
  image: string;
}

const favoriteSchema: Schema<IFavorite> = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    recipe: {
      type: [String],
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Favorite: Model<IFavorite> = mongoose.model<IFavorite>(
  "Favorite",
  favoriteSchema
);
