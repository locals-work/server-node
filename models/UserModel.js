var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    active: { type: Boolean, default: true },
    created_by: { type: mongoose.Types.ObjectId },
    updated_by: { type: mongoose.Types.ObjectId },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", UserSchema);
