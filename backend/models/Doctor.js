const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  qualification: { type: String, required: true },
  experience: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  department: { type: String, required: true },
  availableDays: { type: [String], default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
  timing: { type: String, default: '09:00 AM - 05:00 PM' },
  status: { type: String, enum: ['Available', 'On Leave', 'In Surgery', 'Consulting'], default: 'Available' },
  avatarUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', DoctorSchema);
