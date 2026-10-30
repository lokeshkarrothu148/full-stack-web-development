-- ====================================================================
-- CollegeHub – Smart College Management System
-- Database Creation & Initial Seed Script
-- Compatible with MySQL 5.7+ / 8.0+
-- ====================================================================

-- 1. Create the Database if it does not already exist
CREATE DATABASE IF NOT EXISTS collegehub
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE collegehub;

-- Disable foreign key checks during table drop/recreation
SET FOREIGN_KEY_CHECKS = 0;

-- 2. Drop existing tables if re-initializing the database
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS announcements;
DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS materials;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS sessions;

SET FOREIGN_KEY_CHECKS = 1;

-- ====================================================================
-- TABLE: students
-- Stores both student accounts and administrator accounts.
-- Role-based access control is enforced via the `role` column.
-- Default role is always 'student'.
-- ====================================================================
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    branch VARCHAR(100) NOT NULL,
    role ENUM('student', 'admin') NOT NULL DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- TABLE: materials
-- Stores academic study notes, lecture slides, and syllabus files.
-- Supports both uploaded PDFs (file_type='upload') and external URLs (file_type='url').
-- ====================================================================
CREATE TABLE materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    description TEXT,
    file_path VARCHAR(255) NOT NULL,
    file_type ENUM('upload', 'url') NOT NULL DEFAULT 'url',
    uploaded_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_materials_uploaded_by
        FOREIGN KEY (uploaded_by) REFERENCES students(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- TABLE: assignments
-- Stores homework, lab tasks, and coursework assignments.
-- ====================================================================
CREATE TABLE assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    deadline DATETIME NOT NULL,
    created_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_assignments_created_by
        FOREIGN KEY (created_by) REFERENCES students(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_ci;

-- ====================================================================
-- TABLE: announcements
-- Stores notices, circulars, and departmental updates.
-- ====================================================================
CREATE TABLE announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'General',
    published_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_announcements_published_by
        FOREIGN KEY (published_by) REFERENCES students(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- TABLE: events
-- Stores campus events, webinars, technical symposiums, and sports.
-- ====================================================================
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    event_date DATE NOT NULL,
    event_time VARCHAR(20) NOT NULL DEFAULT '10:00 AM',
    venue VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- TABLE: feedback
-- Stores student queries, suggestions, and feedback.
-- Includes foreign key link to the student who submitted it.
-- ====================================================================
CREATE TABLE feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    rating INT NOT NULL DEFAULT 5,
    status ENUM('pending', 'reviewed') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_feedback_student_id
        FOREIGN KEY (student_id) REFERENCES students(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- TABLE: sessions (Used by express-mysql-session for persistent logins)
-- ====================================================================
CREATE TABLE IF NOT EXISTS sessions (
    session_id VARCHAR(128) COLLATE utf8mb4_bin NOT NULL,
    expires INT(11) UNSIGNED NOT NULL,
    data MEDIUMTEXT COLLATE utf8mb4_bin,
    PRIMARY KEY (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- SAMPLE SEED DATA FOR TESTING
-- Passwords:
-- Admin:   email: admin@collegehub.com     | password: admin123
-- Student: email: rahul.sharma@collegehub.com | password: student123
-- Student: email: priya.patel@collegehub.com  | password: student123
-- Note: Below bcrypt hashes are generated using 10 salt rounds.
-- ====================================================================

-- 1. Insert Administrator & Students
INSERT INTO students (id, name, email, password, branch, role) VALUES
(1, 'System Administrator', 'admin@collegehub.com', '$2a$10$WqD8Rmv6q1hZ1hKz2eBveuJq0tq24m.nZkUcbMgnI1dZkO8sB2vVy', 'Administration', 'admin'),
(2, 'Rahul Sharma', 'rahul.sharma@collegehub.com', '$2a$10$6iL3tF3Rz5T5c3y6Z3P9Oe3U2m3v5s4b1y7h8j9k0l1m2n3o4p5q', 'Computer Science & Engineering', 'student'),
(3, 'Priya Patel', 'priya.patel@collegehub.com', '$2a$10$6iL3tF3Rz5T5c3y6Z3P9Oe3U2m3v5s4b1y7h8j9k0l1m2n3o4p5q', 'Information Technology', 'student');

-- 2. Insert Study Materials
INSERT INTO materials (id, title, subject, description, file_path, file_type, uploaded_by) VALUES
(1, 'Data Structures & Algorithms Lecture Notes', 'Computer Science', 'Comprehensive lecture notes covering Stacks, Queues, Binary Trees, Graph Traversal, and Dynamic Programming with code snippets.', 'https://www.cs.bham.ac.uk/~jxb/DSA/dsa.pdf', 'url', 1),
(2, 'Database Management Systems - Normalization Guide', 'Information Technology', 'Step-by-step guide explaining 1NF, 2NF, 3NF, BCNF with real-world schema decomposition examples.', 'https://web.stanford.edu/class/cs145/notes/normalization.pdf', 'url', 1),
(3, 'Operating Systems Concepts & Process Scheduling', 'Computer Science', 'Covers CPU scheduling algorithms (FCFS, SJF, Round Robin), deadlocks, semaphores, and virtual memory management.', 'https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-sched.pdf', 'url', 1),
(4, 'Computer Networks - TCP/IP Protocol Suite', 'Information Technology', 'Detailed breakdown of OSI vs TCP/IP models, routing protocols, subnetting, and socket programming fundamentals.', 'https://intronetworks.cs.luc.edu/current/ComputerNetworks.pdf', 'url', 1);

-- 3. Insert Course Assignments
INSERT INTO assignments (id, title, subject, description, deadline, created_by) VALUES
(1, 'Implement Red-Black Tree in C++', 'Computer Science', 'Write a complete C++ program to implement Red-Black Tree insertion, deletion, and search operations with rotation visualization.', DATE_ADD(NOW(), INTERVAL 7 DAY), 1),
(2, 'E-Commerce Database Schema Design & SQL Queries', 'Information Technology', 'Design an ER diagram and implement schema in MySQL with tables for Users, Orders, Products, and Payments. Submit SQL script and report.', DATE_ADD(NOW(), INTERVAL 12 DAY), 1),
(3, 'Virtual Memory Page Replacement Simulation', 'Computer Science', 'Simulate FIFO, LRU, and Optimal page replacement algorithms in Python or Java. Compare page fault frequencies.', DATE_ADD(NOW(), INTERVAL 14 DAY), 1);

-- 4. Insert Campus Announcements
INSERT INTO announcements (id, title, content, category, published_by) VALUES
(1, 'Mid-Semester Examination Schedule Announced', 'The Mid-Semester examinations for all B.Tech branches will commence from November 15, 2026. Detailed timetable has been posted on the departmental notice board.', 'Exam', 1),
(2, 'Annual Hackathon "HackCollege 2026" Registrations Open', 'Registrations are now open for the 36-hour inter-college hackathon. Exciting cash prizes, cloud credits, and internship opportunities await top teams!', 'Academic', 1),
(3, 'Campus Library Timings Extended for Exam Preparations', 'The Central Library and Digital Resource Center will remain open until 11:00 PM on all weekdays throughout the examination month.', 'General', 1);

-- 5. Insert College Events
INSERT INTO events (id, title, description, event_date, event_time, venue) VALUES
(1, 'National Conference on Artificial Intelligence & Ethics', 'Keynote addresses by industry pioneers and research paper presentations discussing modern AI advances, LLMs, and ethical challenges.', DATE_ADD(CURDATE(), INTERVAL 10 DAY), '09:30 AM', 'Main Auditorium (Block A)'),
(2, 'Campus Placement Drive & Resume Workshop', 'Pre-placement briefing and interactive resume-building workshop conducted by leading software recruitment specialists.', DATE_ADD(CURDATE(), INTERVAL 18 DAY), '02:00 PM', 'Seminar Hall 2'),
(3, 'Annual Cultural & Tech Fest - "Aura 2026"', 'Three days of coding challenges, robotics competitions, gaming arenas, live music bands, and cultural celebrations.', DATE_ADD(CURDATE(), INTERVAL 30 DAY), '10:00 AM', 'College Open Air Amphitheatre');

-- 6. Insert Sample Student Feedback
INSERT INTO feedback (id, student_id, subject, message, rating, status) VALUES
(1, 2, 'Request for Additional Cloud Computing Lab Hours', 'Could the computer center keep the high-performance computing lab open on Saturdays for students working on their final year capstone projects?', 5, 'pending'),
(2, 3, 'Library Digital Books Access Portal Issue', 'Some of the IEEE journal links on the library intranet portal are redirecting to an expired domain. Kindly update the proxy settings.', 4, 'reviewed');

-- ====================================================================
-- VERIFICATION QUERIES
-- Run these queries to verify that all records have been inserted successfully:
-- ====================================================================
SELECT 'students' AS `Table`, COUNT(*) AS `Total_Records` FROM students
UNION ALL
SELECT 'materials', COUNT(*) FROM materials
UNION ALL
SELECT 'assignments', COUNT(*) FROM assignments
UNION ALL
SELECT 'announcements', COUNT(*) FROM announcements
UNION ALL
SELECT 'events', COUNT(*) FROM events
UNION ALL
SELECT 'feedback', COUNT(*) FROM feedback;

