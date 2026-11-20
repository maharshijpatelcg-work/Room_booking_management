import mongoose, { Schema, Document, Model } from "mongoose";

export interface ResourceDocument extends Document {
  name: string;
  description: string;
  category: string;
  images: string[];
  location: string;
  totalQuantity: number;
  available: number;
  instructions?: string;
  maintenanceNotes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new Schema<ResourceDocument>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Cameras",
        "Laptops",
        "Projectors",
        "Laboratory Equipment",
        "Meeting Rooms",
        "Sports Equipment",
        "Audio Equipment",
        "Other",
      ],
    },
    images: { type: [String], default: [] },
    location: { type: String, required: true },
    totalQuantity: { type: Number, required: true, min: 1 },
    available: { type: Number, required: true, min: 0 },
    instructions: { type: String },
    maintenanceNotes: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ResourceSchema.index({ name: "text", description: "text" });
ResourceSchema.index({ category: 1 });
ResourceSchema.index({ isActive: 1 });
ResourceSchema.index({ isActive: 1, createdAt: -1 });
ResourceSchema.index({ isActive: 1, available: 1 });
ResourceSchema.index({ isActive: 1, category: 1 });

const Resource: Model<ResourceDocument> =
  mongoose.models.Resource ||
  mongoose.model<ResourceDocument>("Resource", ResourceSchema);

export default Resource;
