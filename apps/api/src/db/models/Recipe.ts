import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dateRange: {
      start: Date,
      end: Date
    },
    totalCalories: Number,
    macro: {
      proteinG: Number,
      fatG: Number,
      carbG: Number
    },
    days: [
      {
        date: Date,
        meals: [
          {
            name: String,
            items: [
              {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
                title: String,
                qty: Number,
                unit: String,
                calories: Number,
                proteinG: Number,
                fatG: Number,
                carbG: Number,
                description: String,
                externalUrl: String
              }
            ]
          }
        ]
      }
    ],
    createdFrom: {
      prompt: String,
      params: mongoose.Schema.Types.Mixed
    }
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

export type RecipeDocument = mongoose.InferSchemaType<typeof RecipeSchema> & { _id: mongoose.Types.ObjectId };

export default mongoose.model<RecipeDocument>('Recipe', RecipeSchema);
