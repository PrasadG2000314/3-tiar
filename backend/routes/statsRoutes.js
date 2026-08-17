const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Bill = require('../models/Bill');
const Inventory = require('../models/Inventory');
const { getIsConnected } = require('../config/db');

router.get('/', async (req, res) => {
  try {
    if (getIsConnected()) {
      const [totalPatients, totalDoctors, totalAppointments, totalBills, totalInventory] = await Promise.all([
        Patient.countDocuments(),
        Doctor.countDocuments(),
        Appointment.countDocuments(),
        Bill.find(),
        Inventory.find()
      ]);

      const availableDoctors = await Doctor.countDocuments({ status: 'Available' });
      const pendingAppointments = await Appointment.countDocuments({ status: 'Scheduled' });
      const totalRevenue = totalBills.reduce((acc, bill) => acc + (bill.paymentStatus === 'Paid' ? bill.netAmount : 0), 0);
      const lowStockItems = totalInventory.filter(i => i.status !== 'In Stock').length;

      return res.json({
        totalPatients,
        totalDoctors,
        availableDoctors,
        totalAppointments,
        pendingAppointments,
        totalRevenue,
        lowStockItems,
        bedOccupancyRate: '78%'
      });
    }

    // Default mock stats
    return res.json({
      totalPatients: 248,
      totalDoctors: 32,
      availableDoctors: 24,
      totalAppointments: 18,
      pendingAppointments: 7,
      totalRevenue: 48920,
      lowStockItems: 3,
      bedOccupancyRate: '78%'
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
