
const { connectToDatabase, getDb } = require('../config/database');
const { ObjectId } = require('mongodb');

// Get all clients
exports.getClients = async (req, res) => {
  try {
    const db = await connectToDatabase();
    const clients = await db.collection('clients').find({}).toArray();
    res.status(200).json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ message: 'Error fetching clients', error: error.message });
  }
};

// Get client by ID
exports.getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectToDatabase();
    
    let query = {};
    try {
      // Try to use ObjectId if it's a valid MongoDB ObjectId
      query = { _id: new ObjectId(id) };
    } catch (e) {
      // If not a valid ObjectId, search by string id
      query = { id: id };
    }
    
    const client = await db.collection('clients').findOne(query);
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    res.status(200).json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ message: 'Error fetching client', error: error.message });
  }
};

// Create new client
exports.createClient = async (req, res) => {
  try {
    const clientData = req.body;
    const db = await connectToDatabase();
    
    // Add timestamps
    const newClient = {
      ...clientData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const result = await db.collection('clients').insertOne(newClient);
    
    // Get the newly created client
    const createdClient = await db.collection('clients').findOne({ _id: result.insertedId });
    
    res.status(201).json(createdClient);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ message: 'Error creating client', error: error.message });
  }
};

// Update client
exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const db = await connectToDatabase();
    
    let query = {};
    try {
      // Try to use ObjectId if it's a valid MongoDB ObjectId
      query = { _id: new ObjectId(id) };
    } catch (e) {
      // If not a valid ObjectId, search by string id
      query = { id: id };
    }
    
    // Add updated timestamp
    updateData.updatedAt = new Date().toISOString();
    
    const result = await db.collection('clients').findOneAndUpdate(
      query,
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ message: 'Error updating client', error: error.message });
  }
};

// Delete client
exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectToDatabase();
    
    let query = {};
    try {
      // Try to use ObjectId if it's a valid MongoDB ObjectId
      query = { _id: new ObjectId(id) };
    } catch (e) {
      // If not a valid ObjectId, search by string id
      query = { id: id };
    }
    
    const result = await db.collection('clients').deleteOne(query);
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    res.status(200).json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ message: 'Error deleting client', error: error.message });
  }
};

// Get client appointments
exports.getClientAppointments = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectToDatabase();
    
    const appointments = await db.collection('appointments').find({ clientId: id }).toArray();
    
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching client appointments:', error);
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};

// Get client documents
exports.getClientDocuments = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectToDatabase();
    
    const documents = await db.collection('documents').find({ clientId: id }).toArray();
    
    res.status(200).json(documents);
  } catch (error) {
    console.error('Error fetching client documents:', error);
    res.status(500).json({ message: 'Error fetching documents', error: error.message });
  }
};

// Get client communications
exports.getClientCommunications = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectToDatabase();
    
    const communications = await db.collection('communications').find({ clientId: id }).toArray();
    
    res.status(200).json(communications);
  } catch (error) {
    console.error('Error fetching client communications:', error);
    res.status(500).json({ message: 'Error fetching communications', error: error.message });
  }
};
