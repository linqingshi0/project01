import mongoose from 'mongoose';

const CategoryTagSchema = new mongoose.Schema(
  {
    name: String,
    kind: { type: String, enum: ['category', 'tag'], default: 'tag' }
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

export type CategoryTagDocument = mongoose.InferSchemaType<typeof CategoryTagSchema> & { _id: mongoose.Types.ObjectId };

export default mongoose.model<CategoryTagDocument>('CategoryTag', CategoryTagSchema);
