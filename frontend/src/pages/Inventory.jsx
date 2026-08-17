import React, { useState } from 'react';
import { Package, AlertTriangle, Plus, RefreshCw, ShoppingCart } from 'lucide-react';
import Modal from '../components/Modal';

export default function Inventory({ inventory, onAddInventory, onUpdateQuantity, searchTerm }) {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Medicine',
    quantity: '',
    unit: 'boxes',
    minThreshold: '20',
    supplier: 'MedLife Pharma',
    pricePerUnit: ''
  });

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const lowStockCount = inventory.filter(i => i.status !== 'In Stock').length;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddInventory({
      ...formData,
      quantity: Number(formData.quantity),
      minThreshold: Number(formData.minThreshold),
      pricePerUnit: Number(formData.pricePerUnit)
    });
    setIsModalOpen(false);
    setFormData({ name: '', category: 'Medicine', quantity: '', unit: 'boxes', minThreshold: '20', supplier: 'MedLife Pharma', pricePerUnit: '' });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Pharmacy & Medical Inventory</h1>
          <p className="page-subtitle">Track pharmaceuticals, surgical equipment, and protective supplies</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Add Stock Item
        </button>
      </div>

      {lowStockCount > 0 && (
        <div className="alert-banner" style={{ background: '#fef3c7', borderColor: '#fde68a', color: '#92400e' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertTriangle size={20} color="#d97706" />
            <span><strong>Stock Warning:</strong> {lowStockCount} inventory items are below minimum threshold levels.</span>
          </div>
          <span className="badge badge-warning">Action Required</span>
        </div>
      )}

      <div className="filter-bar">
        <select
          className="filter-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Medicine">Pharmaceuticals / Medicine</option>
          <option value="Surgical">Surgical Gear</option>
          <option value="Consumable">Consumables & PPE</option>
          <option value="Equipment">Medical Devices</option>
        </select>
        <div style={{ fontSize: '0.85rem', color: '#64748b', marginLeft: 'auto' }}>
          <strong>{filteredInventory.length}</strong> stock items cataloged
        </div>
      </div>

      <div className="card-table">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Category</th>
              <th>Quantity in Stock</th>
              <th>Threshold Alert</th>
              <th>Unit Price</th>
              <th>Supplier</th>
              <th>Status</th>
              <th>Quick Stock Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  No items found in stock records.
                </td>
              </tr>
            ) : (
              filteredInventory.map(item => (
                <tr key={item._id || item.name}>
                  <td style={{ fontWeight: 700, color: '#0f172a' }}>{item.name}</td>
                  <td><span className="badge badge-info">{item.category}</span></td>
                  <td style={{ fontSize: '1rem', fontWeight: 800 }}>
                    {item.quantity} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b' }}>{item.unit}</span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: '#64748b' }}>Min {item.minThreshold} {item.unit}</td>
                  <td>${item.pricePerUnit?.toFixed(2)}</td>
                  <td style={{ fontSize: '0.85rem' }}>{item.supplier}</td>
                  <td>
                    <span className={`badge ${
                      item.status === 'In Stock' ? 'badge-success' : 
                      item.status === 'Low Stock' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => onUpdateQuantity(item._id, item.quantity + 10)}
                        title="Add 10 Units"
                      >
                        +10
                      </button>
                      <button
                        className="btn btn-outline btn-sm"
                        disabled={item.quantity <= 0}
                        onClick={() => onUpdateQuantity(item._id, Math.max(0, item.quantity - 1))}
                        title="Dispense 1 Unit"
                      >
                        -1
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Stock Item Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Catalog New Stock Item">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Item / Medicine Name</label>
            <input
              type="text"
              className="form-control"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Ciprofloxacin 500mg"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                className="form-control"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Medicine">Medicine</option>
                <option value="Surgical">Surgical</option>
                <option value="Consumable">Consumable</option>
                <option value="Equipment">Equipment</option>
              </select>
            </div>
            <div className="form-group">
              <label>Packaging Unit</label>
              <input
                type="text"
                className="form-control"
                required
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="boxes / vials / pairs"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Initial Quantity</label>
              <input
                type="number"
                className="form-control"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="100"
              />
            </div>
            <div className="form-group">
              <label>Low-Stock Alert Threshold</label>
              <input
                type="number"
                className="form-control"
                required
                value={formData.minThreshold}
                onChange={(e) => setFormData({ ...formData, minThreshold: e.target.value })}
                placeholder="20"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Unit Price ($)</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                required
                value={formData.pricePerUnit}
                onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
                placeholder="15.50"
              />
            </div>
            <div className="form-group">
              <label>Supplier Vendor</label>
              <input
                type="text"
                className="form-control"
                required
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="MedLife Pharma"
              />
            </div>
          </div>

          <div className="modal-footer" style={{ margin: '-24px -24px -24px -24px', marginTop: '16px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Inventory Item</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
