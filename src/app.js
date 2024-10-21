const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const { authMiddleware, adminMiddleware } = require('./middleware/auth');
const { errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const instanceRoutes = require('./routes/instances');
const flowRoutes = require('./routes/flows');
const historyRoutes = require('./routes/history');
const adminRoutes = require('./routes/admin');
const dashboardRoutes = require('./routes/dashboard');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', authMiddleware);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/instances', instanceRoutes);
app.use('/api/flows', flowRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/admin', adminMiddleware, adminRoutes);

// Catch-all route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});