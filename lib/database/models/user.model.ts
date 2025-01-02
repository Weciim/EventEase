import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  clerkId: { type: String, unique: true },
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  photo: { type: String },
  role: {
    type: String,
    enum: ["admin", "user", "client", "provider"],
    default: "user",
  },
});

const User = models.User || model("User", UserSchema);

export default User;
