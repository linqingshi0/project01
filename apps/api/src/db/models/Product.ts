import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    merchantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant', required: true },
    title: String,
    images: [String],
    price: Number,
    unit: String,
    stock: Number,
    caloriesPerUnit: Number,
    proteinG: Number,
    fatG: Number,
    carbG: Number,
    tags: [String],
    ingredients: [String],
    status: { type: String, enum: ['on', 'off'], default: 'on' },
    externalUrl: String
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

export type ProductDocument = mongoose.InferSchemaType<typeof ProductSchema> & { _id: mongoose.Types.ObjectId };

export default mongoose.model<ProductDocument>('Product', ProductSchema);
