import { Document, Schema, model, models } from "mongoose";

export interface IPack extends Document {
  _id: string;
  name: string;
  description?: string;
  createdAt: Date;
  provider: { _id: string; firstName: string; lastName: string };
  category: { _id: string; name: string };
  furnitures: { _id: string; name: string }[];
  price: number;
  imageUrl: string;
}

const PackSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  provider: { type: Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  furnitures: [
    { type: Schema.Types.ObjectId, ref: "Furniture", required: true },
  ],
  price: { type: Number, required: true },
  imageUrl: { type: String },
});

const Pack = models.Pack || model<IPack>("Pack", PackSchema);

export default Pack;
