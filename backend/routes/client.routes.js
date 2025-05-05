
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { db } = require('../../server');

// Get all clients
router.get('/', async (req, res) => {
  try {
    const clients = await db.collection('clients').find({}).toArray();
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a single client by ID
router.get('/:id', async (req, res) => {
  try {
    const client = await db.collection('clients').findOne({ id: req.params.id });
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    res.json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new client
router.post('/', async (req, res) => {
  try {
    // Generate a unique account number for new clients
    const clientsCount = await db.collection('clients').countDocuments();
    const accountNumber = `A${(clientsCount + 1).toString().padStart(3, '0')}`;
    
    const newClient = {
      ...req.body,
      id: uuidv4(),
      accountNumber: req.body.accountNumber || accountNumber,
      dateRegistered: req.body.dateRegistered || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await db.collection('clients').insertOne(newClient);
    res.status(201).json(newClient);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update an existing client
router.put('/:id', async (req, res) => {
  try {
    const updatedData = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    const result = await db.collection('clients').updateOne(
      { id: req.params.id },
      { $set: updatedData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    const updatedClient = await db.collection('clients').findOne({ id: req.params.id });
    res.json(updatedClient);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a client
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.collection('clients').deleteOne({ id: req.params.id });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get client appointments (mock)
router.get('/:id/appointments', async (req, res) => {
  try {
    // Mock implementation - in a real app this would fetch from DB
    res.json([
      {
        id: 'apt1',
        clientId: req.params.id,
        doctorFacilityName: 'Dr. Michael Johnson',
        visitDate: '2025-05-10',
        visitTime: '10:30 AM',
        visitStatus: 'scheduled',
        treatmentDescription: 'Follow-up consultation',
        location: 'PT Associates',
        type: 'Physical Therapy'
      }
    ]);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get client documents (mock)
router.get('/:id/documents', async (req, res) => {
  try {
    // Mock implementation - in a real app this would fetch from DB
    res.json([
      {
        id: 'doc1',
        clientId: req.params.id,
        name: 'Initial Medical Evaluation',
        type: 'medical',
        category: 'Medical Reports',
        uploadDate: '2025-04-05',
        fileType: 'pdf',
        url: '/documents/initial-evaluation.pdf',
        uploadedBy: 'Dr. Smith'
      }
    ]);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get client communications (mock)
router.get('/:id/communications', async (req, res) => {
  try {
    // Mock implementation - in a real app this would fetch from DB
    res.json([
      {
        id: 'comm1',
        clientId: req.params.id,
        date: '2025-04-20',
        time: '10:15 AM',
        type: 'email',
        sender: 'Jane Doelawyer',
        subject: 'Case Update - Treatment Progress',
        content: 'Your case is progressing as expected...',
        read: true,
        actionRequired: false
      }
    ]);
  } catch (error) {
    console.error('Error fetching communications:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
