import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
      trim: true,
    },
    section: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      default: "",
      trim: true,
    },
    content: {
      type: String,
      default: "",
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    images: [
      {
        type: String,
      },
    ],
    order: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Compound index for faster lookups
ContentSchema.index({ page: 1, section: 1 });

// Modern Mongoose pre-save middleware
ContentSchema.pre("save", function () {
  if (this.section) {
    this.section = this.section
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");
  }
});

const Content =
  mongoose.models.Content ||
  mongoose.model("Content", ContentSchema);

export default Content;