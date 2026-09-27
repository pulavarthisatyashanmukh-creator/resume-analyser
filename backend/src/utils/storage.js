/**
 * storage.js
 * In-memory development store for Phase 1.
 * MongoDB Atlas will replace this in Phase 2.
 * NOTE: Stored in process memory; cleared when backend server restarts.
 */

const analysisStore = new Map();
const contactMessagesStore = [];

module.exports = {
  analysisStore,
  contactMessagesStore
};
