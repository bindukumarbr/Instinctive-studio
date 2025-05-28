import mongoose, { Schema, Document } from 'mongoose';

export interface IListing extends Document {
    title: string;
    description: string;
    price: number;
    location: string;
    categoryId: mongoose.Types.ObjectId;
    attributes: Record<string, any>; // Flexible key-value object
}

const ListingSchema: Schema = new Schema({
    title: { type: String, required: true, text: true }, // Enables MongoDB's built-in full-text search for title and description.
    description: { type: String, required: true, text: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    attributes: { type: Map, of: Schema.Types.Mixed }, // Allows Mongoose to handle arbitrary key-value pairs within the attributes object without strict validation, providing the necessary flexibility
}, { timestamps: true });

// Important: Create indexes for frequently queried attributes
ListingSchema.index({ 'attributes.size': 1 }, { sparse: true });
ListingSchema.index({ 'attributes.colour': 1 }, { sparse: true });
ListingSchema.index({ 'attributes.screen_size': 1 }, { sparse: true });
// For combined text search:
ListingSchema.index({ title: 'text', description: 'text' });


export default mongoose.models.Listing || mongoose.model<IListing>('Listing', ListingSchema);