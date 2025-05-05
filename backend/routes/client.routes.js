
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
    const newClient = {
      ...req.body,
      id: uuidv4(),
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

module.exports = router;
