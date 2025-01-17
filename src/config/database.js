const { Pool } = require('pg');
require('dotenv').config(); // Load environment variables

const pool = new Pool({
    user: process.env.PG_USER,       // PostgreSQL username
    host: process.env.PG_HOST,       // PostgreSQL server address
    database: process.env.PG_DATABASE, // PostgreSQL database name
    password: process.env.PG_PASSWORD, // PostgreSQL password
    port: process.env.PG_PORT,       // PostgreSQL port (default: 5432)
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

// Export the pool to use in other modules
module.exports = {
    connectDB,
    query: (text, params) => pool.query(text, params), // Wrapper for queries
};