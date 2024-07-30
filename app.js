const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();

app.use(express.json());
app.use(bodyParser.json());
const swaggerFilePath = path.join(__dirname, 'swagger.json');
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, 'utf8'));

const corsOptions = {
  origin: '*', // Allow all origins. Replace '*' with specific domains as needed
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Methods',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Credentials',
  ],
};

// Use CORS middleware with the configured options
app.use(cors(corsOptions));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const uri = process.env.MONGODB_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

// Import the routes index file
const routes = require('./routes'); // Ensure the path is correct
app.use('/', routes);
 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
