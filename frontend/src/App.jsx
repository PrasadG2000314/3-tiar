import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import Billing from './pages/Billing';
import Inventory from './pages/Inventory';
import * as api from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMongoConnected, setIsMongoConnected] = useState(true);

  const [stats, setStats] = useState({});
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [healthRes, statsRes, patientsRes, doctorsRes, apptsRes, billsRes, invRes] = await Promise.all([
        api.getHealth().catch(() => ({ data: { mongoDB: 'Fallback' } })),
        api.getStats().catch(() => ({ data: {} })),
        api.getPatients().catch(() => ({ data: [] })),
        api.getDoctors().catch(() => ({ data: [] })),
        api.getAppointments().catch(() => ({ data: [] })),
        api.getBills().catch(() => ({ data: [] })),
        api.getInventory().catch(() => ({ data: [] }))
      ]);

      setIsMongoConnected(healthRes?.data?.mongoDB === 'Connected');
      setStats((statsRes?.data && typeof statsRes.data === 'object' && !Array.isArray(statsRes.data)) ? statsRes.data : {});
      setPatients(Array.isArray(patientsRes?.data) ? patientsRes.data : []);
      setDoctors(Array.isArray(doctorsRes?.data) ? doctorsRes.data : []);
      setAppointments(Array.isArray(apptsRes?.data) ? apptsRes.data : []);
      setBills(Array.isArray(billsRes?.data) ? billsRes.data : []);
      setInventory(Array.isArray(invRes?.data) ? invRes.data : []);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers for Patient actions
  const handleAddPatient = async (newPatientData) => {
    try {
      const res = await api.createPatient(newPatientData);
      setPatients(prev => [res.data, ...prev]);
    } catch (err) {
      // Fallback local update
      setPatients(prev => [{ _id: Date.now().toString(), ...newPatientData }, ...prev]);
    }
  };

  const handleDeletePatient = async (id) => {
    try {
      await api.deletePatient(id);
      setPatients(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      setPatients(prev => prev.filter(p => p._id !== id));
    }
  };

  // Handlers for Doctor actions
  const handleAddDoctor = async (newDocData) => {
    try {
      const res = await api.createDoctor(newDocData);
      setDoctors(prev => [res.data, ...prev]);
    } catch (err) {
      setDoctors(prev => [{ _id: Date.now().toString(), ...newDocData }, ...prev]);
    }
  };

  // Handlers for Appointment actions
  const handleAddAppointment = async (newApptData) => {
    try {
      const res = await api.createAppointment(newApptData);
      setAppointments(prev => [res.data, ...prev]);
    } catch (err) {
      setAppointments(prev => [{ _id: Date.now().toString(), ...newApptData }, ...prev]);
    }
  };

  const handleUpdateAppointmentStatus = async (id, status) => {
    try {
      const res = await api.updateAppointment(id, { status });
      setAppointments(prev => prev.map(a => a._id === id ? res.data : a));
    } catch (err) {
      setAppointments(prev => prev.map(a => a._id === id ? { ...a, status } : a));
    }
  };

  // Handlers for Billing actions
  const handleAddBill = async (newBillData) => {
    try {
      const res = await api.createBill(newBillData);
      setBills(prev => [res.data, ...prev]);
    } catch (err) {
      setBills(prev => [{ _id: Date.now().toString(), invoiceNo: 'INV-2026-' + Math.floor(1000 + Math.random()*9000), ...newBillData }, ...prev]);
    }
  };

  const handleUpdatePaymentStatus = async (id, paymentStatus, paymentMethod) => {
    try {
      const res = await api.updateBill(id, { paymentStatus, paymentMethod });
      setBills(prev => prev.map(b => b._id === id ? res.data : b));
    } catch (err) {
      setBills(prev => prev.map(b => b._id === id ? { ...b, paymentStatus, paymentMethod } : b));
    }
  };

  // Handlers for Inventory actions
  const handleAddInventory = async (newItemData) => {
    try {
      const res = await api.createInventory(newItemData);
      setInventory(prev => [res.data, ...prev]);
    } catch (err) {
      setInventory(prev => [{ _id: Date.now().toString(), ...newItemData, status: 'In Stock' }, ...prev]);
    }
  };

  const handleUpdateQuantity = async (id, quantity) => {
    try {
      const res = await api.updateInventory(id, { quantity });
      setInventory(prev => prev.map(i => i._id === id ? res.data : i));
    } catch (err) {
      setInventory(prev => prev.map(i => {
        if (i._id === id) {
          const status = quantity <= 0 ? 'Out of Stock' : (quantity < i.minThreshold ? 'Low Stock' : 'In Stock');
          return { ...i, quantity, status };
        }
        return i;
      }));
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="main-wrapper">
        <Navbar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          isMongoConnected={isMongoConnected} 
        />

        <main className="content-body">
          {activeTab === 'dashboard' && (
            <Dashboard 
              stats={stats} 
              patients={patients} 
              doctors={doctors} 
              appointments={appointments}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'patients' && (
            <Patients 
              patients={patients}
              onAddPatient={handleAddPatient}
              onDeletePatient={handleDeletePatient}
              searchTerm={searchTerm}
            />
          )}

          {activeTab === 'doctors' && (
            <Doctors 
              doctors={doctors}
              onAddDoctor={handleAddDoctor}
              searchTerm={searchTerm}
            />
          )}

          {activeTab === 'appointments' && (
            <Appointments 
              appointments={appointments}
              onAddAppointment={handleAddAppointment}
              onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
              doctors={doctors}
              searchTerm={searchTerm}
            />
          )}

          {activeTab === 'billing' && (
            <Billing 
              bills={bills}
              onAddBill={handleAddBill}
              onUpdatePaymentStatus={handleUpdatePaymentStatus}
              searchTerm={searchTerm}
            />
          )}

          {activeTab === 'inventory' && (
            <Inventory 
              inventory={inventory}
              onAddInventory={handleAddInventory}
              onUpdateQuantity={handleUpdateQuantity}
              searchTerm={searchTerm}
            />
          )}
        </main>
      </div>
    </div>
  );
}
