import mongoose, { Schema, Document, Model } from "mongoose";

export interface UsageHistoryDocument extends Document {
  resource: mongoose.Types.ObjectId;
  booking: mongoose.Types.ObjectId;
  returnRecord?: mongoose.Types.ObjectId;
  action: string;
  details?: string;
  createdAt: Date;
}

const UsageHistorySchema = new Schema<UsageHistoryDocument>(
  {
    resource: { type: Schema.Types.ObjectId, ref: "Resource", required: true },
    booking: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    returnRecord: { type: Schema.Types.ObjectId, ref: "Return" },
    action: { type: String, required: true },
    details: { type: String },
  },
  { timestamps: true }
);

UsageHistorySchema.index({ resource: 1 });
UsageHistorySchema.index({ booking: 1 });
UsageHistorySchema.index({ createdAt: -1 });
UsageHistorySchema.index({ booking: 1, resource: 1 });

const UsageHistory: Model<UsageHistoryDocument> =
  mongoose.models.UsageHistory ||
  mongoose.model<UsageHistoryDocument>("UsageHistory", UsageHistorySchema);

export default UsageHistory;
