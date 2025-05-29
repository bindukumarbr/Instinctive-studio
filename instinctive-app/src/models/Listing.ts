import mongoose, { Schema, Document, Types } from "mongoose";

export interface IListing extends Document {
  title: string;
  description: string;
  price: number;
  location: string;
  categoryId: Types.ObjectId;
  attributes: Map<string, any>; // Using Map for mixed attributes
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ListingSchema: Schema<IListing> = new Schema<IListing>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    attributes: { type: Map, of: Schema.Types.Mixed, default: {} }, // Using Map for dynamic attributes
    images: [{ type: String, required: true }],
  },
  { timestamps: true }
);

ListingSchema.index({ title: "text", description: "text" });

const Listing =
  mongoose.models.Listing || mongoose.model<IListing>("Listing", ListingSchema);
export default Listing;
