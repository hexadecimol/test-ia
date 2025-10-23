import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "68ef53c167f0a0a2633a9ea0", 
  requiresAuth: true // Ensure authentication is required for all operations
});
