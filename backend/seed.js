const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');
const Bill = require('./models/Bill');
const Inventory = require('./models/Inventory');

const samplePatients = [
  {
    name: 'Eleanor Vance',
    age: 42,
    gender: 'Female',
    bloodGroup: 'O+',
    phone: '+1 555-0192',
    email: 'eleanor.vance@example.com',
    disease: 'Acute Appendicitis',
    doctorAssigned: 'Dr. Sarah Jenkins',
    roomNo: 'ICU-104',
    admissionDate: '2026-08-15',
    status: 'ICU',
    notes: 'Post-operative monitoring required.'
  },
  {
    name: 'Marcus Brody',
    age: 58,
    gender: 'Male',
    bloodGroup: 'A+',
    phone: '+1 555-0344',
    email: 'marcus.brody@example.com',
    disease: 'Hypertension & Cardiac Arrhythmia',
    doctorAssigned: 'Dr. Robert Chen',
    roomNo: 'Ward-202',
    admissionDate: '2026-08-14',
    status: 'Admitted',
    notes: 'BP stabilized. Regular ECG check scheduled.'
  },
  {
    name: 'Sophia Martinez',
    age: 29,
    gender: 'Female',
    bloodGroup: 'B-',
    phone: '+1 555-0811',
    email: 'sophia.m@example.com',
    disease: 'Migraine & Vertigo',
    doctorAssigned: 'Dr. Emily Watson',
    roomNo: 'Outpatient',
    admissionDate: '2026-08-17',
    status: 'Outpatient',
    notes: 'Prescribed Sumatriptan. Follow up in 1 week.'
  },
  {
    name: 'David Kim',
    age: 35,
    gender: 'Male',
    bloodGroup: 'AB+',
    phone: '+1 555-0677',
    email: 'david.kim@example.com',
    disease: 'Fractured Femur',
    doctorAssigned: 'Dr. Michael Chang',
    roomNo: 'Ward-108',
    admissionDate: '2026-08-10',
    status: 'Discharged',
    notes: 'Cast applied. Physical therapy scheduled.'
  }
];

const sampleDoctors = [
  {
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
  }
];

const sampleAppointments = [
  {
    patientName: 'Sophia Martinez',
    doctorName: 'Dr. Emily Watson',
    department: 'Neurology',
    appointmentDate: '2026-08-17',
    appointmentTime: '10:30 AM',
    reason: 'Severe Migraine Follow-up',
    status: 'In-Progress',
    priority: 'Urgent'
  },
  {
    patientName: 'Arthur Pendelton',
    doctorName: 'Dr. Robert Chen',
    department: 'Cardiology',
    appointmentDate: '2026-08-17',
    appointmentTime: '11:45 AM',
    reason: 'Routine Cardiac Checkup & Lipid Profile',
    status: 'Scheduled',
    priority: 'Normal'
  }
];

const sampleBills = [
  {
    patientName: 'Eleanor Vance',
    invoiceNo: 'INV-2026-0801',
    date: '2026-08-16',
    services: [
      { description: 'Appendectomy Surgical Fee', cost: 4500 },
      { description: 'ICU Stay (2 Days)', cost: 1200 }
    ],
    totalAmount: 5700,
    discount: 200,
    netAmount: 5500,
    paymentStatus: 'Paid',
    paymentMethod: 'Insurance'
  }
];

const sampleInventory = [
  {
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
    name: 'Amoxicillin 250mg Injection',
    category: 'Medicine',
    quantity: 14,
    unit: 'vials',
    minThreshold: 30,
    supplier: 'BioCare Solutions',
    expiryDate: '2026-11-15',
    pricePerUnit: 45.0,
    status: 'Low Stock'
  }
];

const seedDB = async () => {
  const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital_management';
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await Patient.deleteMany({});
    await Doctor.deleteMany({});
    await Appointment.deleteMany({});
    await Bill.deleteMany({});
    await Inventory.deleteMany({});

    await Patient.insertMany(samplePatients);
    await Doctor.insertMany(sampleDoctors);
    await Appointment.insertMany(sampleAppointments);
    await Bill.insertMany(sampleBills);
    await Inventory.insertMany(sampleInventory);

    console.log('Sample hospital management data successfully seeded!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDB();
