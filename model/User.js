const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema(
  {
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
      validate: {
        validator: async function (req_value) {
          let count = await mongoose.models.User.countDocuments({
            phone: req_value,
          });

          if (count) {
            return false;
          }
          return true;
        },
        message: "This phone number is already used",
      },
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: async function (req_value) {
          let count = await mongoose.models.User.countDocuments({
            email: req_value,
          });

          if (count) {
            return false;
          }
          return true;
        },
        message: "This email is already used",
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
