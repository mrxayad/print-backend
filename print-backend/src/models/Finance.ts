import mongoose, { Document, Schema } from 'mongoose';

export interface IFinance extends Document {
  shopId: string;
  orderId: mongoose.Types.ObjectId;
  orderCode: string;
  totalAmount: number;
  platformFee: number;
  netEarning: number;
  date: Date;
}

const FinanceSchema = new Schema<IFinance>(
  {
    shopId: {
      type: String,
      required: true,
      trim: true
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true
    },
    orderCode: {
      type: String,
      required: true,
      trim: true
    },
    totalAmount: {
      type: Number,
      required: true
    },
    platformFee: {
      type: Number,
      required: true
    },
    netEarning: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model<IFinance>('Finance', FinanceSchema);