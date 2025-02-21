import { mongoose } from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: String,
    title: String,
    price: Number,
    description: String,
    imageUrl: String,
    category: String,
    rating: Number,
  },
  { timestamps: true, versionKey: false }
);
export const Product = mongoose.model("Product", productSchema);
