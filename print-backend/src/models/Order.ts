import mongoose, { Document, Schema } from 'mongoose';

export interface IFile {
  url: string;
  type: 'document' | 'image';
  copies: number;
  pages: number;
  printType: 'bw' | 'color';
  sided: 'single' | 'double';
}

export interface IOrder extends Document {
  orderCode: string;
  customerSessionId?: string;
  shopId: string;
  files: IFile[];
  printType: 'bw' | 'color';
  totalAmount: number;
  platformFee: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentId: string;
  orderStatus: 'pending' | 'printed';
  createdAt: Date;
}

const FileSchema = new Schema<IFile>({
  url: { type: String, required: true },
  type: { type: String, enum: ['document', 'image'], required: true },
  copies: { type: Number, required: true, default: 1 },
  pages: { type: Number, default: 1 },
  printType: { type: String, enum: ['bw', 'color'], default: 'bw' },
  sided:  { type: String, enum: ['single', 'double'], default: 'single' }
});

const OrderSchema = new Schema<IOrder>(
  {
    orderCode: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    customerSessionId: {
      type: String,
      required: true,
      trim: true
    },
    shopId: {
      type: String,
      required: true,
      trim: true
    },
    files: {
      type: [FileSchema],
      required: true
    },
    printType: {
      type: String,
      enum: ['bw', 'color','mixed'],
      required: true
    },
    totalAmount: {
      type: Number,
      required: true
    },
    platformFee: {
      type: Number,
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    paymentId: {
      type: String,
      default: ''
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'printed'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', OrderSchema);