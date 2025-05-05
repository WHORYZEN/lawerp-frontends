
const clientRoutes = require('./clientRoutes');

// Import other route files here when they're created
// For example: const caseRoutes = require('./caseRoutes');

module.exports = {
  clientRoutes,
  // Export other routes here when they're created
  // For example: caseRoutes,
  // Add empty placeholders for routes referenced in server.js but not implemented yet
  caseRoutes: require('express').Router(),
  medicalRoutes: require('express').Router(),
  chatbotRoutes: require('express').Router(),
  depositionRoutes: require('express').Router(),
  attorneyRoutes: require('express').Router(),
  messageRoutes: require('express').Router(),
  calendarRoutes: require('express').Router()
};
