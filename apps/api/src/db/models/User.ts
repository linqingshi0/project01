import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: String,
    avatar: String,
    gender: String,
    birthday: Date,
    heightCm: Number,
    weightKg: Number,
    targetWeightKg: Number,
    dietPref: [String],
    allergies: [String],
    dislikes: [String],
    budgetPerDay: Number
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

export type UserDocument = mongoose.InferSchemaType<typeof UserSchema> & { _id: mongoose.Types.ObjectId };

export default mongoose.model<UserDocument>('User', UserSchema);
