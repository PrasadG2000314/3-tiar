const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');
const { getIsConnected } = require('../config/db');

let inMemoryBills = [
  {
    _id: 'b1',
    patientName: 'Eleanor Vance',
    invoiceNo: 'INV-2026-0801',
    date: '2026-08-16',
    services: [
      { description: 'Appendectomy Surgical Fee', cost: 4500 },
      { description: 'ICU Stay (2 Days)', cost: 1200 },
      { description: 'Post-Op Antibiotics & IV Fluids', cost: 350 }
    ],
    totalAmount: 6050,
    discount: 250,
    netAmount: 5800,
    paymentStatus: 'Paid',
    paymentMethod: 'Insurance'
  },
  {
    _id: 'b2',
    patientName: 'Marcus Brody',
    invoiceNo: 'INV-2026-0802',
    date: '2026-08-15',
    services: [
      { description: 'Cardiology Consultation', cost: 250 },
      { description: '24-Hour Holter ECG Monitor', cost: 600 },
      { description: 'Blood Diagnostic Panel', cost: 300 }
    ],
    totalAmount: 1150,
    discount: 50,
    netAmount: 1100,
    paymentStatus: 'Pending',
    paymentMethod: 'Unpaid'
  },
  {
    _id: 'b3',
    patientName: 'Sophia Martinez',
    invoiceNo: 'INV-2026-0803',
    date: '2026-08-17',
    services: [
      { description: 'Neurology Consultation', cost: 200 },
      { description: 'Brain MRI Scan', cost: 850 }
    ],
    totalAmount: 1050,
    discount: 0,
    netAmount: 1050,
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card'
  }
];

// GET all bills
router.get('/', async (req, res) => {
  try {
    if (getIsConnected()) {
      const bills = await Bill.find().sort({ createdAt: -1 });
      return res.json(bills);
    }
    return res.json(inMemoryBills);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// CREATE bill
router.post('/', async (req, res) => {
  try {
    if (getIsConnected()) {
      const newBill = new Bill(req.body);
      const saved = await newBill.save();
      return res.status(201).json(saved);
    }
    const newBill = {
      _id: 'b' + (inMemoryBills.length + 1) + '_' + Date.now(),
      invoiceNo: 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
      ...req.body
    };
    inMemoryBills.unshift(newBill);
    return res.status(201).json(newBill);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// UPDATE bill payment status
router.put('/:id', async (req, res) => {
  try {
    if (getIsConnected()) {
      const updated = await Bill.findByIdAndUpdate(req.params.id, req.body, { new: true });
      return res.json(updated);
    }
    const index = inMemoryBills.findIndex(b => b._id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Bill not found' });
    inMemoryBills[index] = { ...inMemoryBills[index], ...req.body };
    return res.json(inMemoryBills[index]);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
