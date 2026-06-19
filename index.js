require('dotenv').config();
const dns = require('dns');
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');

// Ensure uploads directory exists (Render ephemeral filesystem)
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads', { recursive: true });
if (!fs.existsSync('images')) fs.mkdirSync('images', { recursive: true });

// The system/ISP DNS resolver on this machine refuses Node's SRV queries
// (needed for mongodb+srv:// URIs) — public resolvers handle it fine.
dns.setServers(['8.8.8.8', '1.1.1.1']);
const path = require('path');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const bankRoutes = require('./routes/bankRoutes')
const scholarshipRoutes = require('./routes/scholarshipRoutes');
const contactRoutes = require("./routes/contactRoutes");
const adminRoutes = require('./routes/adminRoutes');
const config = require('./config/config');

const app = express();
const PORT = config.port;



console.log("PORT",PORT);


// // CORS configuration
// const corsOptions = {
//   origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
//   maxAge: 86400 // 24 hours
// };

// Apply CORS middleware
app.use(cors());

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// MongoDB connection
mongoose.connect(config.mongodbUri)
  .then(async () => {
    console.log('MongoDB connected successfully');

    // Drop old non-sparse unique index on secondRollNumber so null values don't conflict
    try {
      await mongoose.connection.collection('users').dropIndex('secondRollNumber_1');
      console.log('Dropped old secondRollNumber index — will be recreated as sparse');
    } catch (_) {
      // Index may not exist or already dropped — safe to ignore
    }

    // Start the server after successful MongoDB connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process on connection failure
  });

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Auth backend is running!');
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/bank', bankRoutes); 
app.use('/api/scholarship', scholarshipRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);


// app.use(express.static(path.join(__dirname, 'client/build')));

// // // All other GET requests (for React routes)
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
// });
