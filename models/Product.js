import mongoose, { Schema, model, models } from "mongoose";

const imageRender = [
  {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
];

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    images: imageRender,
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    properties: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = models.Product || model("Product", ProductSchema);
