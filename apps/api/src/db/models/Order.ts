import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        qty: Number,
        priceSnapshot: Number
      }
    ],
    amount: Number,
    status: { type: String, enum: ['pending', 'paid', 'shipped', 'completed', 'cancelled'], default: 'paid' },
    address: String,
    payment: {
      method: String,
      txnId: String
    }
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

export type OrderDocument = mongoose.InferSchemaType<typeof OrderSchema> & { _id: mongoose.Types.ObjectId };

export default mongoose.model<OrderDocument>('Order', OrderSchema);
