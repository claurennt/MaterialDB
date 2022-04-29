import mongoose from "mongoose";

import jwt from "jsonwebtoken";

const Schema = mongoose.Schema;

// the schema is the blueprint of our  model
const adminSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: {
    type: String,
    default: "admin",
  },
  topics: [{ type: Schema.Types.ObjectId, ref: "Topic" }],
});

const Admin = mongoose.models?.Admin || mongoose.model("Admin", adminSchema);

export default Admin;
