const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, getIsConnected } = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/bills', require('./routes/billRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Hospital Management System API',
    mongoDB: getIsConnected() ? 'Connected' : 'In-Memory Fallback Mode',
    timestamp: new Date()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`Hospital Management Backend running on port ${PORT}`);
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=================================================`);
});
