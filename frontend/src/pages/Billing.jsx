import React, { useState } from 'react';
import { DollarSign, Receipt, Plus, Check, FileText, CreditCard } from 'lucide-react';
import Modal from '../components/Modal';

export default function Billing({ bills, onAddBill, onUpdatePaymentStatus, searchTerm }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    patientName: '',
    service1Name: '',
    service1Cost: '',
    service2Name: '',
    service2Cost: '',
    discount: '0',
    paymentStatus: 'Pending',
    paymentMethod: 'Unpaid'
  });

  const filteredBills = bills.filter(b => {
    return b.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           b.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalCollected = bills.reduce((acc, b) => acc + (b.paymentStatus === 'Paid' ? (b.netAmount || 0) : 0), 0);
  const totalPending = bills.reduce((acc, b) => acc + (b.paymentStatus === 'Pending' ? (b.netAmount || 0) : 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const services = [];
    if (formData.service1Name) {
      services.push({ description: formData.service1Name, cost: Number(formData.service1Cost) || 0 });
    }
    if (formData.service2Name) {
      services.push({ description: formData.service2Name, cost: Number(formData.service2Cost) || 0 });
    }
    const totalAmount = services.reduce((a, s) => a + s.cost, 0);
    const discount = Number(formData.discount) || 0;
    const netAmount = Math.max(0, totalAmount - discount);

    onAddBill({
      patientName: formData.patientName,
      date: new Date().toISOString().split('T')[0],
      services,
      totalAmount,
      discount,
      netAmount,
      paymentStatus: formData.paymentStatus,
      paymentMethod: formData.paymentMethod
    });
    setIsModalOpen(false);
    setFormData({ patientName: '', service1Name: '', service1Cost: '', service2Name: '', service2Cost: '', discount: '0', paymentStatus: 'Pending', paymentMethod: 'Unpaid' });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Billing & Accounts Ledger</h1>
          <p className="page-subtitle">Generate patient invoices, track payments, and review insurance claims</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Generate Invoice
        </button>
      </div>

      {/* Revenue Summary Cards */}
      <div className="grid-4" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#d1fae5', color: '#059669' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div className="stat-val">${totalCollected.toLocaleString()}</div>
            <div className="stat-label">Total Revenue Collected</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
            <Receipt size={24} />
          </div>
          <div>
            <div className="stat-val">${totalPending.toLocaleString()}</div>
            <div className="stat-label">Pending Receivable Balance</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
            <FileText size={24} />
          </div>
          <div>
            <div className="stat-val">{bills.length}</div>
            <div className="stat-label">Invoices Issued</div>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="card-table">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Patient Name</th>
              <th>Date</th>
              <th>Billed Line Items</th>
              <th>Net Total</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  No invoices found.
                </td>
              </tr>
            ) : (
              filteredBills.map(b => (
                <tr key={b._id || b.invoiceNo}>
                  <td><strong>{b.invoiceNo}</strong></td>
                  <td style={{ fontWeight: 700, color: '#0f172a' }}>{b.patientName}</td>
                  <td>{b.date}</td>
                  <td style={{ fontSize: '0.825rem' }}>
                    {b.services?.map((s, idx) => (
                      <div key={idx}>• {s.description} (${s.cost})</div>
                    ))}
                  </td>
                  <td style={{ fontWeight: 800, color: '#0d9488', fontSize: '1rem' }}>
                    ${b.netAmount?.toLocaleString()}
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CreditCard size={14} /> {b.paymentMethod}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${
                      b.paymentStatus === 'Paid' ? 'badge-success' : 
                      b.paymentStatus === 'Pending' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td>
                    {b.paymentStatus !== 'Paid' ? (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => onUpdatePaymentStatus(b._id, 'Paid', 'Credit Card')}
                      >
                        <Check size={14} /> Mark Paid
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>Settled</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Generate Bill Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Generate Patient Invoice">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Patient Full Name</label>
            <input
              type="text"
              className="form-control"
              required
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              placeholder="e.g. Eleanor Vance"
            />
          </div>

          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '12px', color: '#475569' }}>Service Charges & Fees</h4>
            
            <div className="form-row" style={{ marginBottom: '10px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Service 1 Description (e.g. Surgery Fee)"
                value={formData.service1Name}
                onChange={(e) => setFormData({ ...formData, service1Name: e.target.value })}
              />
              <input
                type="number"
                className="form-control"
                placeholder="Cost ($)"
                value={formData.service1Cost}
                onChange={(e) => setFormData({ ...formData, service1Cost: e.target.value })}
              />
            </div>

            <div className="form-row">
              <input
                type="text"
                className="form-control"
                placeholder="Service 2 Description (e.g. ICU Stay)"
                value={formData.service2Name}
                onChange={(e) => setFormData({ ...formData, service2Name: e.target.value })}
              />
              <input
                type="number"
                className="form-control"
                placeholder="Cost ($)"
                value={formData.service2Cost}
                onChange={(e) => setFormData({ ...formData, service2Cost: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Discount Amount ($)</label>
              <input
                type="number"
                className="form-control"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Payment Method</label>
              <select
                className="form-control"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              >
                <option value="Unpaid">Unpaid</option>
                <option value="Insurance">Insurance Claim</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI / Digital</option>
              </select>
            </div>
          </div>

          <div className="modal-footer" style={{ margin: '-24px -24px -24px -24px', marginTop: '16px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Invoice</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
