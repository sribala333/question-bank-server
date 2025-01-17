// const { connectDB } = require('./src/config/database');
// const app = require('./src/app');
// const PORT = process.env.PORT || 3000;


// // Connect to the database


// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });


const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
app.use(bodyParser.json());

const pool = new Pool({
    user: 'srirammp',
    host: 'localhost',
    database: 'rms',
    password: '',
    port: 5432,
});


const connectDB = async () => {
    try {
        await pool.connect();
        console.log('PostgreSQL database connected successfully');
    } catch (error) {
        console.error('Error connecting to the PostgreSQL database:', error.message);
        process.exit(1); // Exit with failure
    }
};

connectDB();

app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

app.get('/getDepartments', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM departments');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/saveDepartment', async(req,res)=>{
    const { deptName } = req.body;
    await pool.query('INSERT INTO departments(department_name) VALUES($1) RETURNING *',[deptName]);
    res.json({msg:'Departmetn added sucesfully'}) 
})


app.listen(3000, () => {
    console.log('Server started on port 3000');
});