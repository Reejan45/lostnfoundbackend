const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const LostItemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    created_by: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("LostItem", LostItemSchema);