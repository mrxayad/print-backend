import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomerSession extends Document {
  sessionId: string;
  shopId: string;
  createdAt: Date;
  expiresAt: Date;
}

const CustomerSessionSchema = new Schema<ICustomerSession>(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true
    },
    shopId: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 } // MongoDB TTL — auto deletes expired sessions
    }
  },
  { timestamps: true }
);

export default mongoose.model<ICustomerSession>('CustomerSession', CustomerSessionSchema);