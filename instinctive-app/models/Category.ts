import mongoose, { Schema, Document } from 'mongoose';

export interface IAttributeSchema {
    key: string;
    name: string;
    type: 'string' | 'number' | 'boolean' | 'enum';
    options?: string[]; // Only applicable for 'enum' type
}

export interface ICategory extends Document {
    name: string;
    slug: string;
    attributeSchema: IAttributeSchema[];
}

const AttributeSchema = new Schema<IAttributeSchema>({
    key: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ['string', 'number', 'boolean', 'enum'] },
    options: [{ type: String }],
});

const CategorySchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    attributeSchema: [AttributeSchema],
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);