import { Schema, model, models, Document } from "mongoose";

export interface IOrder extends Document {
  stripeId: string;
  userId: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: string;
  startDate: Date;
  endDate: Date;
  deliveryOption: string;
  status: string;
  createdAt: Date;
}

const OrderSchema = new Schema({
  stripeId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  items: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  deliveryOption: { type: String, required: true },
  status: { type: String, required: true, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

const Order = models.Order || model("Order", OrderSchema);

export default Order;
