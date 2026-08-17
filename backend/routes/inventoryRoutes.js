const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const { getIsConnected } = require('../config/db');

let inMemoryInventory = [
  {
    _id: 'i1',
    name: 'Paracetamol 500mg Tabs',
    category: 'Medicine',
    quantity: 450,
    unit: 'boxes',
    minThreshold: 50,
    supplier: 'MedLife Pharma',
    expiryDate: '2027-05-30',
    pricePerUnit: 12.5,
    status: 'In Stock'
  },
  {
    _id: 'i2',
    name: 'Amoxicillin 250mg Injection',
    category: 'Medicine',
    quantity: 14,
    unit: 'vials',
    minThreshold: 30,
    supplier: 'BioCare Solutions',
    expiryDate: '2026-11-15',
    pricePerUnit: 45.0,
    status: 'Low Stock'
  },
  {
    _id: 'i3',
    name: 'Sterile Surgical Gloves (L)',
    category: 'Surgical',
    quantity: 1200,
    unit: 'pairs',
    minThreshold: 200,
    supplier: 'SafeSurge Supplies',
    expiryDate: '2028-01-01',
    pricePerUnit: 3.5,
    status: 'In Stock'
  },
  {
    _id: 'i4',
    name: 'N95 Respirator Masks',
    category: 'Consumable',
    quantity: 5,
    unit: 'boxes',
    minThreshold: 25,
    supplier: 'HealthShield Corp',
    expiryDate: '2029-03-20',
    pricePerUnit: 28.0,
    status: 'Out of Stock'
  }
];

// GET inventory items
router.get('/', async (req, res) => {
  try {
    if (getIsConnected()) {
      const items = await Inventory.find().sort({ createdAt: -1 });
      return res.json(items);
    }
    return res.json(inMemoryInventory);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// CREATE inventory item
router.post('/', async (req, res) => {
  try {
    if (getIsConnected()) {
      const newItem = new Inventory(req.body);
      const saved = await newItem.save();
      return res.status(201).json(saved);
    }
    const newItem = {
      _id: 'i' + (inMemoryInventory.length + 1) + '_' + Date.now(),
      ...req.body,
      status: req.body.quantity <= 0 ? 'Out of Stock' : (req.body.quantity < (req.body.minThreshold || 20) ? 'Low Stock' : 'In Stock')
    };
    inMemoryInventory.unshift(newItem);
    return res.status(201).json(newItem);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// UPDATE inventory item
router.put('/:id', async (req, res) => {
  try {
    if (getIsConnected()) {
      const updated = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
      return res.json(updated);
    }
    const index = inMemoryInventory.findIndex(i => i._id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Item not found' });
    const qty = req.body.quantity !== undefined ? req.body.quantity : inMemoryInventory[index].quantity;
    const thresh = req.body.minThreshold !== undefined ? req.body.minThreshold : inMemoryInventory[index].minThreshold;
    const status = qty <= 0 ? 'Out of Stock' : (qty < thresh ? 'Low Stock' : 'In Stock');

    inMemoryInventory[index] = { ...inMemoryInventory[index], ...req.body, status };
    return res.json(inMemoryInventory[index]);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
