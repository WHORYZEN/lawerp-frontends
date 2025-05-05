
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
let db;
const connectToMongoDB = async () => {
  try {
    const client = new MongoClient(process.env.VITE_MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    db = client.db(process.env.VITE_MONGODB_DB_NAME || 'lyzLawFirm');
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Import route files
const { 
  clientRoutes, 
  caseRoutes, 
  medicalRoutes,
  chatbotRoutes,
  depositionRoutes,
  attorneyRoutes,
  messageRoutes,
  calendarRoutes
} = require('./backend/routes');

// API Routes
app.use('/api/clients', clientRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/medical', medicalRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/depositions', depositionRoutes);
app.use('/api/attorneys', attorneyRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/calendar', calendarRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

// Start server only after connecting to MongoDB
const startServer = async () => {
  await connectToMongoDB();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

module.exports = { app, db }; // Export for testing
