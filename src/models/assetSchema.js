const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  serialNumber: { type: String },
  brand: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
  companyId: { type: String, required: true },
  assignTo: { type: Object, default: null },
  status: { type: String, enum: ['available', 'assigned', 'pending'], default: 'available' },

});

const Asset = mongoose.model("ASSET", assetSchema);

module.exports = Asset;
