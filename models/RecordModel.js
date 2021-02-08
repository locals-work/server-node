var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var RecordSchema = new Schema(
  {
    entity: { type: String, required: true },
    data: mongoose.Schema.Types.Mixed,
    created_by: { type: mongoose.Types.ObjectId },
    updated_by: { type: mongoose.Types.ObjectId },
  },
  { timestamps: true }
);

module.exports = mongoose.model("record", RecordSchema);
