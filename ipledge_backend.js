// Setting up an API endpoint to interact with iPledge
const express = require('express');
const axios = require('axios');
const app = express();
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

// Middleware for security and logging
app.use(helmet()); // Set security-related HTTP headers
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(morgan('combined')); // Logging HTTP requests
app.use(express.json()); // Parse JSON requests

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});
app.use('/api/', limiter);

// Environment Variables for Security
const IPLEDGE_API_URL = process.env.IPLEDGE_API_URL;
const IPLEDGE_API_KEY = process.env.IPLEDGE_API_KEY;

// Route to handle iPledge actions
app.post('/api/ipledge', async (req, res) => {
  const { action, patientId, data } = req.body;

  // Input validation
  if (!action || !patientId) {
    return res.status(400).json({ message: 'Action and patientId are required.' });
  }

  try {
    const response = await axios.post(`${IPLEDGE_API_URL}/${action}`, {
      patientId,
      ...data
    }, {
      headers: {
        'Authorization': `Bearer ${IPLEDGE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('iPledge API error:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      res.status(error.response.status).json({
        message: error.response.data?.message || 'Error from iPledge API',
        details: error.response.data
      });
    } else if (error.request) {
      // The request was made but no response was received
      res.status(502).json({ message: 'No response from iPledge API.' });
    } else {
      // Something happened in setting up the request
      res.status(500).json({ message: 'An unexpected error occurred.' });
    }
  }
});

// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
