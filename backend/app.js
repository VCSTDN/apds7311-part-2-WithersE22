const express = require('express');
const connectDB = require('./config/db');         // MongoDB connection
const authRoutes = require('./routes/auth');      // Import authentication routes
const userRoutes = require('./routes/user');      // Import user routes
const transactionRoutes = require('./routes/transaction'); // Import transaction routes
const helmet = require('helmet');                 // For adding security HTTP headers
const expressBrute = require('express-brute');    // For rate-limiting and brute-force protection
const cors = require('cors');                     // For enabling CORS
const fs = require('fs');                         // For file system operations (SSL)
const https = require('https');                   // For creating an HTTPS server
require('dotenv').config();                       // To load environment variables from a .env file

// SSL credentials
const privateKey = fs.readFileSync('/Users/Ethan/Downloads/P2_APDS_Final/backend/private.key', 'utf8');
const certificate = fs.readFileSync('/Users/Ethan/Downloads/P2_APDS_Final/backend/certificate.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const app = express();
const store = new expressBrute.MemoryStore();     // Store for express-brute
const bruteforce = new expressBrute(store);       // Brute force prevention middleware

// Connect to the MongoDB database
connectDB();

// Middleware: Security headers
app.use(helmet());  // Adds security-related HTTP headers

// Middleware: JSON parsing
app.use(express.json()); // To parse incoming JSON requests

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',  // Frontend running on localhost:3000
  credentials: true                 // Allow credentials (cookies, headers)
}));

// Handle preflight requests for all routes (CORS)
app.options('*', cors());

// Middleware: Custom CORS headers (additional control if needed)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');  // Allow requests from frontend
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specific headers
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allowed methods
  res.header('Access-Control-Allow-Credentials', 'true'); // Allow cookies or other credentials
  next(); // Pass to next middleware or route handler
});

// Root route for API status check
app.get('/', (req, res) => {
  res.send('API is running with CORS and security middleware active!');
});

// Use Routes with brute force protection applied
app.use('/api/auth', bruteforce.prevent, authRoutes);             // Authentication routes
app.use('/api/user', bruteforce.prevent, userRoutes);             // Protected user routes
app.use('/api/transactions', bruteforce.prevent, transactionRoutes); // Transaction routes

// HTTPS server
https.createServer(credentials, app).listen(5001, () => {
  console.log('Server running securely on https://localhost:5001');
});

// Optional: HTTP server (e.g., for non-secure traffic, testing)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`HTTP server running on http://localhost:${port}`);
});
