const express = require('express');
const { instances } = require('../data/instances');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(instances);
});

router.post('/', (req, res) => {
  const { name, phoneNumber, startDate, endDate } = req.body;
  if (!name || !phoneNumber || !startDate || !endDate) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }
  
  const newInstance = {
    id: instances.length + 1,
    name,
    phoneNumber,
    startDate,
    endDate,
    status: 'disconnected'
  };
  
  instances.push(newInstance);
  res.status(201).json({ success: true, message: 'Instance created', instance: newInstance });
});

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const instance = instances.find(i => i.id === id);
  
  if (!instance) {
    return res.status(404).json({ success: false, message: 'Instance not found' });
  }
  
  Object.assign(instance, req.body);
  res.json({ success: true, message: 'Instance updated', instance });
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = instances.findIndex(i => i.id === id);
  
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Instance not found' });
  }
  
  instances.splice(index, 1);
  res.json({ success: true, message: 'Instance deleted' });
});

module.exports = router;