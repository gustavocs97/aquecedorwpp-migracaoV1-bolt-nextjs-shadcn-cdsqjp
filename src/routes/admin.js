const express = require('express');
const { users } = require('../data/users');

const router = express.Router();

router.get('/users', (req, res) => {
  res.json(users);
});

router.post('/users', (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }
  
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ success: false, message: 'Username already exists' });
  }
  
  const newUser = { id: users.length + 1, username, password, role };
  users.push(newUser);
  res.status(201).json({ success: true, message: 'User created', user: newUser });
});

router.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  
  Object.assign(user, req.body);
  res.json({ success: true, message: 'User updated', user });
});

router.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  
  if (users[index].username === req.user.username) {
    return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
  }
  
  users.splice(index, 1);
  res.json({ success: true, message: 'User deleted' });
});

module.exports = router;