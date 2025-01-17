const { connectDB } = require('./src/config/database');
const app = require('./src/app');
const PORT = process.env.PORT || 3000;


// Connect to the database
connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


// const express = require('express');
// const bodyParser = require('body-parser');
// const { Pool } = require('pg');

// const app = express();
// app.use(bodyParser.json());

// const pool = new Pool({
//     user: 'srirammp',
//     host: 'localhost',
//     database: 'rms',
//     password: '',
//     port: 5432,
// });



// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

// app.get('/getCountries', async (req, res) => {
//     try {
//         const result = await pool.query('SELECT * FROM country');
//         res.json(result.rows);
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// });



// app.listen(3000, () => {
//     console.log('Server started on port 3000');
// });