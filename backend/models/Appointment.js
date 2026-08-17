const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  doctorName: { type: String, required: true },
  department: { type: String, required: true },
  appointmentDate: { type: String, required: true },
  appointmentTime: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['Scheduled', 'In-Progress', 'Completed', 'Cancelled'], default: 'Scheduled' },
  priority: { type: String, enum: ['Normal', 'Urgent', 'Emergency'], default: 'Normal' }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
