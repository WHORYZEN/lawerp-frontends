
// Backend API entry point
import { messagingApi } from './messaging-api';
import { adminApi } from './admin-api';
import { billingApi } from './billing-api';
import { settingsApi } from './settings-api';
import { medicalApi } from './medical-api';
import { depositionsApi } from '../lib/api/depositions-api';
import { attorneysApi } from '../lib/api/attorneys-api';

// Export all backend APIs
export {
  messagingApi,
  adminApi,
  billingApi,
  settingsApi,
  medicalApi,
  depositionsApi,
  attorneysApi
};
