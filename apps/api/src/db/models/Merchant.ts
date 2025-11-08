import mongoose from 'mongoose';

const MerchantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contact: String,
    ownerUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    address: String,
    licenseImgs: [String]
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

export type MerchantDocument = mongoose.InferSchemaType<typeof MerchantSchema> & { _id: mongoose.Types.ObjectId };

export default mongoose.model<MerchantDocument>('Merchant', MerchantSchema);
