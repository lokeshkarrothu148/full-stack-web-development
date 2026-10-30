/**
 * ====================================================================
 * CollegeHub – Secure Administrator Account Creation Script
 * ====================================================================
 * Purpose:
 *   Creates a default administrator account or resets its password securely
 *   using bcrypt hashing. Useful for initial setup or password recovery.
 *
 * Usage:
 *   node create-admin.js
 * ====================================================================
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  console.log('----------------------------------------------------');
  console.log('CollegeHub: Initializing Secure Administrator Setup');
  console.log('----------------------------------------------------');

  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'collegehub',
    port: process.env.DB_PORT || 3306,
  };

  const adminName = 'System Administrator';
  const adminEmail = 'admin@collegehub.com';
  const rawPassword = 'admin123';
  const branch = 'Administration';
  const role = 'admin';

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log(` Connected to MySQL database "${dbConfig.database}".`);

    // Hash the password securely with 10 salt rounds
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(rawPassword, saltRounds);

    // Check if admin already exists
    const [existing] = await connection.execute(
      'SELECT id, email, role FROM students WHERE email = ?',
      [adminEmail]
    );

    if (existing.length > 0) {
      // Update existing admin account
      await connection.execute(
        'UPDATE students SET name = ?, password = ?, branch = ?, role = ? WHERE email = ?',
        [adminName, hashedPassword, branch, role, adminEmail]
      );
      console.log(` Administrator account (${adminEmail}) updated successfully with fresh password hash.`);
    } else {
      // Insert new admin account
      await connection.execute(
        'INSERT INTO students (name, email, password, branch, role) VALUES (?, ?, ?, ?, ?)',
        [adminName, adminEmail, hashedPassword, branch, role]
      );
      console.log(` Administrator account (${adminEmail}) created successfully.`);
    }

    // Also verify or create Rahul Sharma test student account
    const studentPassword = await bcrypt.hash('student123', saltRounds);
    const [existingStudent] = await connection.execute(
      'SELECT id FROM students WHERE email = ?',
      ['rahul.sharma@collegehub.com']
    );

    if (existingStudent.length > 0) {
      await connection.execute(
        'UPDATE students SET password = ? WHERE email = ?',
        [studentPassword, 'rahul.sharma@collegehub.com']
      );
    } else {
      await connection.execute(
        'INSERT INTO students (name, email, password, branch, role) VALUES (?, ?, ?, ?, ?)',
        ['Rahul Sharma', 'rahul.sharma@collegehub.com', studentPassword, 'Computer Science & Engineering', 'student']
      );
    }
    console.log(` Test student account (rahul.sharma@collegehub.com) verified.`);

    console.log('----------------------------------------------------');
    console.log('Setup Complete! Default Test Credentials:');
    console.log('  [ADMIN]');
    console.log(`   Email:    ${adminEmail}`);
    console.log(`   Password: ${rawPassword}`);
    console.log('  [STUDENT]');
    console.log('   Email:    rahul.sharma@collegehub.com');
    console.log('   Password: student123');
    console.log('----------------------------------------------------');
  } catch (error) {
    console.error(' Error creating administrator account:', error.message);
    console.error('Hint: Verify your MySQL server is running and check credentials in .env');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createAdmin();

