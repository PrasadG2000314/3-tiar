const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const { getIsConnected } = require('../config/db');

let inMemoryDoctors = [
  {
    _id: 'd1',
    name: 'Dr. Sarah Jenkins',
    specialization: 'General Surgery & Trauma',
    qualification: 'MD, FACS',
    experience: '14 Years',
    phone: '+1 555-9011',
    email: 'sarah.jenkins@hospital.org',
    department: 'Surgery',
    availableDays: ['Mon', 'Wed', 'Fri'],
    timing: '08:00 AM - 04:00 PM',
    status: 'Available',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'
  },
  {
    _id: 'd2',
    name: 'Dr. Robert Chen',
    specialization: 'Cardiology & Electrophysiology',
    qualification: 'MD, DM Cardiology',
    experience: '18 Years',
    phone: '+1 555-9022',
    email: 'robert.chen@hospital.org',
    department: 'Cardiology',
    availableDays: ['Mon', 'Tue', 'Thu', 'Sat'],
    timing: '09:00 AM - 05:00 PM',
    status: 'Consulting',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'
  },
  {
    _id: 'd3',
    name: 'Dr. Emily Watson',
    specialization: 'Neurology',
    qualification: 'MD, Ph.D. Neuroscience',
    experience: '10 Years',
    phone: '+1 555-9033',
    email: 'emily.watson@hospital.org',
    department: 'Neurology',
    availableDays: ['Tue', 'Wed', 'Fri'],
    timing: '10:00 AM - 06:00 PM',
    status: 'Available',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813566-88855ce78907?auto=format&fit=crop&q=80&w=200'
  },
  {
    _id: 'd4',
    name: 'Dr. Michael Chang',
    specialization: 'Orthopedic Surgery',
    qualification: 'MS Ortho, MCh',
    experience: '12 Years',
    phone: '+1 555-9044',
    email: 'michael.chang@hospital.org',
    department: 'Orthopedics',
    availableDays: ['Mon', 'Thu', 'Fri'],
    timing: '09:00 AM - 03:00 PM',
    status: 'In Surgery',
    avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200'
  },
  {
    _id: 'd5',
    name: 'Dr. Olivia Thorne',
    specialization: 'Pediatrics',
    qualification: 'MD Pediatrics',
    experience: '8 Years',
    phone: '+1 555-9055',
    email: 'olivia.thorne@hospital.org',
    department: 'Pediatrics',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    timing: '09:00 AM - 05:00 PM',
    status: 'Available',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'
  }
];

// GET all doctors
router.get('/', async (req, res) => {
  try {
    if (getIsConnected()) {
      const doctors = await Doctor.find().sort({ createdAt: -1 });
      return res.json(doctors);
    }
    return res.json(inMemoryDoctors);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// CREATE doctor
router.post('/', async (req, res) => {
  try {
    if (getIsConnected()) {
      const newDoctor = new Doctor(req.body);
      const saved = await newDoctor.save();
      return res.status(201).json(saved);
    }
    const newDoc = {
      _id: 'd' + (inMemoryDoctors.length + 1) + '_' + Date.now(),
      ...req.body
    };
    inMemoryDoctors.unshift(newDoc);
    return res.status(201).json(newDoc);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// UPDATE doctor
router.put('/:id', async (req, res) => {
  try {
    if (getIsConnected()) {
      const updated = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
      return res.json(updated);
    }
    const index = inMemoryDoctors.findIndex(d => d._id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Doctor not found' });
    inMemoryDoctors[index] = { ...inMemoryDoctors[index], ...req.body };
    return res.json(inMemoryDoctors[index]);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// DELETE doctor
router.delete('/:id', async (req, res) => {
  try {
    if (getIsConnected()) {
      await Doctor.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Doctor deleted' });
    }
    inMemoryDoctors = inMemoryDoctors.filter(d => d._id !== req.params.id);
    return res.json({ message: 'Doctor deleted' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
