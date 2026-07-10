import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  type: {
    type: String,
    enum: ["string", "number", "boolean", "array", "object"],
    default: "string",
  },
  group: {
    type: String,
    default: "general",
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp before saving
SettingsSchema.pre("save", function () {
  this.updatedAt = new Date();
});

export default mongoose.models.Settings ||
  mongoose.model("Settings", SettingsSchema);