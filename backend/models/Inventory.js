const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, enum: ['Medicine', 'Equipment', 'Consumable', 'Surgical'] },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'units' },
  minThreshold: { type: Number, default: 20 },
  supplier: { type: String, default: 'PharmaDistributors Ltd' },
  expiryDate: { type: String, default: '2026-12-31' },
  pricePerUnit: { type: Number, required: true },
  status: { type: String, enum: ['In Stock', 'Low Stock', 'Out of Stock'], default: 'In Stock' }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', InventorySchema);
