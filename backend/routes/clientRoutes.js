
const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

// Client management routes
router.get('/', clientController.getClients);
router.get('/:id', clientController.getClientById);
router.post('/', clientController.createClient);
router.put('/:id', clientController.updateClient);
router.delete('/:id', clientController.deleteClient);

// Client related data routes
router.get('/:id/appointments', clientController.getClientAppointments);
router.get('/:id/documents', clientController.getClientDocuments);
router.get('/:id/communications', clientController.getClientCommunications);

module.exports = router;
