import React, { useState } from 'react';
import { Calendar, Clock, Plus, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import Modal from '../components/Modal';

export default function Appointments({ appointments, onAddAppointment, onUpdateAppointmentStatus, doctors, searchTerm }) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    patientName: '',
    doctorName: doctors.length > 0 ? doctors[0].name : 'Dr. Sarah Jenkins',
    department: 'General Medicine',
    appointmentDate: new Date().toISOString().split('T')[0],
    appointmentTime: '10:00 AM',
    reason: '',
    priority: 'Normal'
  });

  const filteredAppointments = appointments.filter(a => {
    const matchesSearch = a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddAppointment({
      ...formData,
      status: 'Scheduled'
    });
    setIsModalOpen(false);
    setFormData({ patientName: '', doctorName: doctors[0]?.name || 'Dr. Sarah Jenkins', department: 'General Medicine', appointmentDate: new Date().toISOString().split('T')[0], appointmentTime: '10:00 AM', reason: '', priority: 'Normal' });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Appointment Consultations</h1>
          <p className="page-subtitle">Schedule OPD visits, specialist consultations, and procedure slots</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Book Appointment
        </button>
      </div>

      <div className="filter-bar">
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Scheduled">Scheduled</option>
          <option value="In-Progress">In-Progress</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <div style={{ fontSize: '0.85rem', color: '#64748b', marginLeft: 'auto' }}>
          <strong>{filteredAppointments.length}</strong> total consultations listed
        </div>
      </div>

      <div className="card-table">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Doctor & Dept</th>
              <th>Date & Time</th>
              <th>Reason for Visit</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  No appointments found matching your query.
                </td>
              </tr>
            ) : (
              filteredAppointments.map(app => (
                <tr key={app._id || app.patientName}>
                  <td style={{ fontWeight: 700, color: '#0f172a' }}>{app.patientName}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{app.doctorName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{app.department}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                      <Calendar size={14} color="#64748b" /> {app.appointmentDate}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.775rem', color: '#64748b' }}>
                      <Clock size={13} /> {app.appointmentTime}
                    </div>
                  </td>
                  <td style={{ maxWidth: '200px' }}>{app.reason}</td>
                  <td>
                    <span className={`badge ${
                      app.priority === 'Emergency' ? 'badge-danger' : 
                      app.priority === 'Urgent' ? 'badge-warning' : 'badge-info'
                    }`}>
                      {app.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${
                      app.status === 'Completed' ? 'badge-success' : 
                      app.status === 'In-Progress' ? 'badge-warning' : 
                      app.status === 'Cancelled' ? 'badge-danger' : 'badge-info'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td>
                    <select
                      className="filter-select"
                      style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                      value={app.status}
                      onChange={(e) => onUpdateAppointmentStatus(app._id, e.target.value)}
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="In-Progress">In-Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Book Appointment Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Book New Consultation">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Patient Full Name</label>
            <input
              type="text"
              className="form-control"
              required
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              placeholder="e.g. Arthur Pendelton"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Select Doctor</label>
              <select
                className="form-control"
                value={formData.doctorName}
                onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
              >
                {doctors.map(d => (
                  <option key={d._id || d.name} value={d.name}>{d.name} ({d.specialization})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                className="form-control"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="Cardiology"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                className="form-control"
                required
                value={formData.appointmentDate}
                onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Time Slot</label>
              <select
                className="form-control"
                value={formData.appointmentTime}
                onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
              >
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:30 AM">10:30 AM</option>
                <option value="11:45 AM">11:45 AM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="04:15 PM">04:15 PM</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Reason for Visit</label>
            <input
              type="text"
              className="form-control"
              required
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="e.g. Chest pain & routine ECG"
            />
          </div>

          <div className="form-group">
            <label>Priority Level</label>
            <select
              className="form-control"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="Normal">Normal Consultation</option>
              <option value="Urgent">Urgent Visit</option>
              <option value="Emergency">Emergency Triage</option>
            </select>
          </div>

          <div className="modal-footer" style={{ margin: '-24px -24px -24px -24px', marginTop: '16px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Confirm Booking</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
