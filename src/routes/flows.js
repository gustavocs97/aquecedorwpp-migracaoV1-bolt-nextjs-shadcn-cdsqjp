const express = require('express');
const { flows } = require('../data/flows');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(flows);
});

router.post('/', (req, res) => {
  const { name, duration } = req.body;
  if (!name || !duration) {
    return res.status(400).json({ success: false, message: 'Name and duration are required' });
  }
  
  const newFlow = {
    id: flows.length + 1,
    name,
    duration: parseFloat(duration)
  };
  
  flows.push(newFlow);
  res.status(201).json({ success: true, message: 'Flow created', id: newFlow.id });
});

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const flow = flows.find(f => f.id === id);
  
  if (!flow) {
    return res.status(404).json({ success: false, message: 'Flow not found' });
  }
  
  Object.assign(flow, req.body);
  res.json({ success: true, message: 'Flow updated' });
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = flows.findIndex(f => f.id === id);
  
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Flow not found' });
  }
  
  flows.splice(index, 1);
  res.json({ success: true, message: 'Flow deleted' });
});

module.exports = router;