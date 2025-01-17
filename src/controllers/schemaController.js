const { query } = require('../config/database');


const createTables = async () => {
    try {
        await query(` 
        -- Users table
        CREATE TABLE IF NOT EXISTS users (
            user_id SERIAL PRIMARY KEY,
            user_name VARCHAR(100) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            active BOOL NULL, 
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Departments table
        CREATE TABLE IF NOT EXISTS departments (
            department_id SERIAL PRIMARY KEY,
            department_name VARCHAR(255) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Roles table
        CREATE TABLE IF NOT EXISTS roles (
            role_id SERIAL PRIMARY KEY,
            role_name VARCHAR(100) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Department-Role Mapping table
        CREATE TABLE IF NOT EXISTS department_role_trans (
            dept_role_id SERIAL PRIMARY KEY,
            department_id INT NOT NULL REFERENCES departments(department_id) ON DELETE CASCADE,
            role_id INT NOT NULL REFERENCES roles(role_id) ON DELETE CASCADE,
            UNIQUE(department_id, role_id)
        );

        -- User-Department-Role Mapping table
        CREATE TABLE IF NOT EXISTS user_department_role_trans (
            user_dept_role_id SERIAL PRIMARY KEY,
            user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
            dept_role_id INT NOT NULL REFERENCES department_role_trans(dept_role_id) ON DELETE CASCADE,
            UNIQUE(user_id, dept_role_id)
        );

        -- Modules table
        CREATE TABLE IF NOT EXISTS modules (
            module_id SERIAL PRIMARY KEY,
            module_name VARCHAR(255) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Screens table
        CREATE TABLE IF NOT EXISTS screens (
            screen_id SERIAL PRIMARY KEY,
            screen_name VARCHAR(255) UNIQUE NOT NULL,
            module_id INT NOT NULL REFERENCES modules(module_id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Role Permissions table
        CREATE TABLE IF NOT EXISTS role_permissions (
            role_permission_id SERIAL PRIMARY KEY,
            screen_id INT NOT NULL REFERENCES screens(screen_id) ON DELETE CASCADE,
            dept_role_id INT NOT NULL REFERENCES department_role_trans(dept_role_id) ON DELETE CASCADE,
            can_create BOOLEAN DEFAULT FALSE,
            can_edit BOOLEAN DEFAULT FALSE,
            can_view BOOLEAN DEFAULT TRUE,
            can_delete BOOLEAN DEFAULT FALSE,
            UNIQUE(screen_id, dept_role_id)
        );

      `);

        console.log('Tables created successfully.');
    } catch (err) {
        console.error('Error creating tables:', err);
    }
};

exports.createTables = async (req, res) => {
    try {
        await createTables();
        res.send('Tables created successfully.');
    } catch (err) {
        res.status(500).send('Error creating tables: ' + err.message);
    }
}