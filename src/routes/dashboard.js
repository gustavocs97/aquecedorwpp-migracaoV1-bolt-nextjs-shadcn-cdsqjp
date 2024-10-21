const express = require('express');
const { instances } = require('../data/instances');
const { heatingHistory } = require('../data/history');

const router = express.Router();

router.get('/overview', (req, res) => {
  const totalInstances = instances.length;
  const connected = instances.filter(i => i.status === 'connected').length;
  const disconnected = totalInstances - connected;
  const totalMessagesSent = heatingHistory.reduce((sum, entry) => sum + entry.totalMessages, 0);

  res.json({
    totalInstances,
    connected,
    disconnected,
    totalMessagesSent
  });
});

module.exports = router;