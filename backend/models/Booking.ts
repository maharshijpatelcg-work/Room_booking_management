import mongoose, { Schema, Document, Model } from "mongoose";

export interface BookingDocument extends Document {
  bookingReference: string;
  resource: mongoose.Types.ObjectId;
  requesterName: string;
  requesterEmail: string;
  purpose: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  quantity: number;
  status: string;
  managerNotes?: string;
  issuedQuantity: number;
  returnedQuantity: number;
  expectedReturnDate?: Date;
  actualReturnDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<BookingDocument>(
  {
    bookingReference: { type: String, required: true, unique: true },
    resource: { type: Schema.Types.ObjectId, ref: "Resource", required: true },
    requesterName: { type: String, required: true, trim: true },
    requesterEmail: { type: String, required: true, lowercase: true, trim: true },
    purpose: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Cancelled", "Completed"],
      default: "Pending",
    },
    managerNotes: { type: String },
    issuedQuantity: { type: Number, default: 0, min: 0 },
    returnedQuantity: { type: Number, default: 0, min: 0 },
    expectedReturnDate: { type: Date },
    actualReturnDate: { type: Date },
  },
  { timestamps: true }
);

BookingSchema.index({ resource: 1, startDate: 1, endDate: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ requesterEmail: 1 });
BookingSchema.index({ createdAt: -1 });
BookingSchema.index({ status: 1, expectedReturnDate: 1 });
BookingSchema.index({ status: 1, startDate: 1 });
BookingSchema.index({ status: 1, issuedQuantity: 1, returnedQuantity: 1 });

const Booking: Model<BookingDocument> =
  mongoose.models.Booking ||
  mongoose.model<BookingDocument>("Booking", BookingSchema);

export default Booking;
