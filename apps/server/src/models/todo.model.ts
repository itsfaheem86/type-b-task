import { Schema, model } from "mongoose";

const todoSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    done: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default model("Todo", todoSchema);
