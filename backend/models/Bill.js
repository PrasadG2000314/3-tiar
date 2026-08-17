const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  invoiceNo: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  services: [
    {
      description: { type: String, required: true },
      cost: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  netAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['Paid', 'Pending', 'Overdue'], default: 'Pending' },
  paymentMethod: { type: String, enum: ['Cash', 'Credit Card', 'Insurance', 'UPI', 'Unpaid'], default: 'Unpaid' }
}, { timestamps: true });

module.exports = mongoose.model('Bill', BillSchema);
