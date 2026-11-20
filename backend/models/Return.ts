import mongoose, { Schema, Document, Model } from "mongoose";

export interface ReturnDocument extends Document {
  booking: mongoose.Types.ObjectId;
  resource: mongoose.Types.ObjectId;
  returnedQuantity: number;
  returnDate: Date;
  condition: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReturnSchema = new Schema<ReturnDocument>(
  {
    booking: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    resource: { type: Schema.Types.ObjectId, ref: "Resource", required: true },
    returnedQuantity: { type: Number, required: true, min: 1 },
    returnDate: { type: Date, required: true },
    condition: {
      type: String,
      required: true,
      enum: ["Excellent", "Good", "Damaged", "Needs Maintenance"],
    },
    notes: { type: String },
  },
  { timestamps: true }
);

ReturnSchema.index({ booking: 1 });
ReturnSchema.index({ resource: 1 });
ReturnSchema.index({ createdAt: -1 });
ReturnSchema.index({ returnDate: -1 });

const Return: Model<ReturnDocument> =
  mongoose.models.Return ||
  mongoose.model<ReturnDocument>("Return", ReturnSchema);

export default Return;
