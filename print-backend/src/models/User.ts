import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  phone: string;
  name: string;
  firebaseUid?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      trim: true,
      default: ''
    },
      firebaseUid: {   // ✅ added
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);