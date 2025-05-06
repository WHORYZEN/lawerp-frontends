
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { connectToDatabase, closeConnection } = require('./config/database');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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
} = require('./routes');

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

// Setup graceful shutdown
process.on('SIGINT', async () => {
  console.log('Closing MongoDB connection due to application termination');
  await closeConnection();
  process.exit(0);
});

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB when server starts
    await connectToDatabase();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app; // Export for testing
