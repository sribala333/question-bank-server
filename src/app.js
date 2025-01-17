const express = require('express');
const userRoutes = require('./routes/userRoutes'); 
const schemaRoutes = require('./routes/schemaRoutes'); 

// const ensureRedisReady = require('./middlewares/redisMiddleware');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const path = require('path');
// Middleware
// app.use(ensureRedisReady);
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/tables', schemaRoutes); 

app.use('/users', userRoutes); 


// Error Handling
app.use(errorHandler);

module.exports = app;
