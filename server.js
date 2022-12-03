const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorMiddleware')
require('colors')
require('dotenv').config();

const connectDB = require('./config/db.js');


const port = process.env.PORT || 5000;

// Calling database
connectDB();

// Initialize express
const app = express();

// Initializing Cross-Origin Resource Sharing
app.use(cors());

// Middleware  :: to read body data
app.use(express.json())  // bodyParse for raw json
app.use(express.urlencoded({ extended: false }))

// Auth Routes
app.use('/api/auth', require('./routes/authRoutes'));

// User Routes
app.use('/api/users', require('./routes/userRoutes'));

// Posts Routes
app.use('/api/posts', require('./routes/postRoutes'));


app.get('/', (req, res) => {
  res.send('app is running');
})

app.use(errorHandler);

// Listening
app.listen(port, () => console.log(`Server start at port http://localhost:${port}`))