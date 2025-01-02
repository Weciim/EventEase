import { Document, Schema, model, models } from "mongoose";

export interface IFurniture extends Document {
  _id: string;
  name: string;
  description?: string;
  location?: string;
  createdAt: Date;
  imageUrl: string;
  price: number;
  isFree: boolean;
  categories: { _id: string; name: string }[];
  provider: { _id: string; firstName: string; lastName: string };
  availableQuantity: number;
  availabilityDate: Date;
}

const FurnitureSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  createdAt: { type: Date, default: Date.now },
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true },
  isFree: { type: Boolean, default: false },
  categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  provider: { type: String, required: true },
  availableQuantity: { type: Number, default: 0 },
  availabilityDate: { type: Date, default: Date.now },
});

const Furniture =
  models.Furniture || model<IFurniture>("Furniture", FurnitureSchema);

export default Furniture;
