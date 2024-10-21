const express = require('express');
const { heatingHistory } = require('../data/history');
const { instances } = require('../data/instances');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(heatingHistory);
});

router.get('/:phoneNumber', (req, res) => {
  const phoneNumber = req.params.phoneNumber;
  const history = heatingHistory.filter(h => h.phoneNumber === phoneNumber);
  
  const groupedByDate = history.reduce((acc, curr) => {
    const date = curr.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(curr);
    return acc;
  }, {});
  
  res.json(groupedByDate);
});

router.post('/increment', (req, res) => {
  const { messages } = req.body;
  if (!Array.isArray(messages)) {
    return res.status(400).json({ success: false, message: 'Invalid format' });
  }
  
  messages.forEach(({ phone, message }) => {
    const instance = instances.find(inst => inst.phoneNumber === phone);
    if (instance) {
      instance.messagesSent = (instance.messagesSent || 0) + 1;
      const currentDate = new Date().toISOString().split('T')[0];
      heatingHistory.push({
        instanceId: instance.id,
        phoneNumber: instance.phoneNumber,
        totalMessages: instance.messagesSent,
        date: currentDate,
        message
      });
    }
  });
  
  res.json({ success: true, message: 'Message counter incremented' });
});

module.exports = router;