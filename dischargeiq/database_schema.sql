-- =========================================================================
-- DischargeIQ - PostgreSQL Database Schema & Initial Data
-- Purpose: Schema definitions for resume-grade backend deployment
-- Database: PostgreSQL (Neon compatible)
-- =========================================================================

-- Enable UUID extension if required
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables to ensure clean execution
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS risk_predictions CASCADE;
DROP TABLE IF EXISTS discharge_summaries CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop custom types if they exist
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS workflow_stage CASCADE;

-- 1. Create Enums
CREATE TYPE user_role AS ENUM (
    'CMO', 
    'ATTENDING', 
    'RESIDENT', 
    'NURSE', 
    'ADMIN'
);

CREATE TYPE workflow_stage AS ENUM (
    'READY', 
    'NURSE_REVIEW', 
    'AI_SUMMARY', 
    'DOCTOR_APPROVAL', 
    'BILLING_CLEARANCE', 
    'PHARMACY_CLEARANCE', 
    'DISCHARGED'
);

-- 2. Create Users Table (Clinicians & Admins)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Departments Table
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    total_beds INT NOT NULL DEFAULT 40,
    occupied_beds INT NOT NULL DEFAULT 0,
    readmission_threshold DECIMAL(5,2) NOT NULL DEFAULT 12.50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Patients Table (EHR Roster)
CREATE TABLE patients (
    id VARCHAR(20) PRIMARY KEY, -- e.g. 'PT-2041'
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL CHECK (age >= 0),
    gender VARCHAR(10) NOT NULL,
    department_id INT NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    current_diagnosis TEXT NOT NULL,
    attending_doctor_id INT REFERENCES users(id) ON DELETE SET NULL,
    admission_date DATE NOT NULL,
    workflow_stage workflow_stage DEFAULT 'READY' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create Discharge Summaries Table
CREATE TABLE discharge_summaries (
    id SERIAL PRIMARY KEY,
    patient_id VARCHAR(20) NOT NULL REFERENCES patients(id) ON DELETE CASCADE UNIQUE,
    overview TEXT,
    diagnosis_summary TEXT,
    medications_recon TEXT,
    followup_instructions TEXT,
    approved_by INT REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    pdf_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create Risk Predictions Table (FastAPI ML Outputs)
CREATE TABLE risk_predictions (
    id SERIAL PRIMARY KEY,
    patient_id VARCHAR(20) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    risk_score DECIMAL(5,2) NOT NULL CHECK (risk_score >= 0.00 AND risk_score <= 100.00),
    risk_level VARCHAR(10) NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
    factors JSONB NOT NULL, -- e.g., '["Advanced Age", "Comorbidities"]'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Create Notifications Table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'danger')),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE, -- target recipient, null if global broadcast
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Create HIPAA Audit Logs Table
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL, -- e.g. 'LOGIN', 'MED_RECON', 'DISCHARGE_SIGN_OFF'
    details TEXT NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
-- CREATE INDEXES FOR CRITICAL INQUIRIES & RELATIONSHIPS
-- =========================================================================
CREATE INDEX idx_patients_stage ON patients(workflow_stage);
CREATE INDEX idx_patients_dept ON patients(department_id);
CREATE INDEX idx_risk_predictions_patient ON risk_predictions(patient_id, created_at DESC);
CREATE INDEX idx_audit_logs_user_action ON audit_logs(user_id, action);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);

-- =========================================================================
-- SEED DATA SETUP
-- =========================================================================

-- Seed Departments
INSERT INTO departments (name, total_beds, occupied_beds, readmission_threshold) VALUES
('Cardiology', 40, 18, 10.00),
('Neurology', 40, 12, 12.00),
('Orthopedics', 40, 15, 8.00),
('Pediatrics', 40, 8, 5.00),
('General Medicine', 40, 30, 15.00);

-- Seed Users (Passwords are BCrypt hashes of 'admin123')
INSERT INTO users (name, email, password_hash, role) VALUES
('Dr. Amit Sharma', 'cmo@dischargeiq.com', '$2a$12$e0M2/c76JtP9gWqTfW1aOup/xP3fS2Z7V6o1.x7i/8/gYdI6y3LXe', 'CMO'),
('Dr. Rachel Sen', 'rachel.sen@dischargeiq.com', '$2a$12$e0M2/c76JtP9gWqTfW1aOup/xP3fS2Z7V6o1.x7i/8/gYdI6y3LXe', 'ATTENDING'),
('Dr. Vikram Mehta', 'vikram.mehta@dischargeiq.com', '$2a$12$e0M2/c76JtP9gWqTfW1aOup/xP3fS2Z7V6o1.x7i/8/gYdI6y3LXe', 'ATTENDING'),
('Dr. Susan Carter', 'susan.carter@dischargeiq.com', '$2a$12$e0M2/c76JtP9gWqTfW1aOup/xP3fS2Z7V6o1.x7i/8/gYdI6y3LXe', 'RESIDENT'),
('Nurse Linda Jones', 'linda.jones@dischargeiq.com', '$2a$12$e0M2/c76JtP9gWqTfW1aOup/xP3fS2Z7V6o1.x7i/8/gYdI6y3LXe', 'NURSE');

-- Seed Patients
INSERT INTO patients (id, name, age, gender, department_id, current_diagnosis, attending_doctor_id, admission_date, workflow_stage) VALUES
('PT-2041', 'James T. Harrison', 72, 'Male', 1, 'Congestive Heart Failure (CHF) Exacerbation', 1, '2026-06-18', 'READY'),
('PT-1988', 'Eleanor Vance', 64, 'Female', 2, 'Transient Ischemic Attack (TIA)', 1, '2026-06-20', 'NURSE_REVIEW'),
('PT-2099', 'Marcus Brody', 45, 'Male', 3, 'Left Tibia Fracture Post-Op Care', 2, '2026-06-19', 'DOCTOR_APPROVAL'),
('PT-1732', 'Sofia Rodriguez', 81, 'Female', 5, 'Severe Community-Acquired Pneumonia', 3, '2026-06-15', 'AI_SUMMARY'),
('PT-2155', 'David Kim', 58, 'Male', 1, 'Acute Coronary Syndrome (NSTEMI)', 1, '2026-06-21', 'READY'),
('PT-1999', 'Theresa Gallagher', 69, 'Female', 5, 'Cellulitis with Osteomyelitis Suspicion', 3, '2026-06-17', 'DISCHARGED');

-- Seed Risk Predictions
INSERT INTO risk_predictions (patient_id, risk_score, risk_level, factors) VALUES
('PT-2041', 78.00, 'HIGH', '["NT-proBNP > 4000 pg/ml", "Advanced age (>70)", "3 prior hospitalizations"]'),
('PT-1988', 24.00, 'LOW', '["Active tobacco user", "Mild carotid artery stenosis"]'),
('PT-2099', 15.00, 'LOW', '["Temporary immobility post-ORIF"]'),
('PT-1732', 82.00, 'HIGH', '["Stage III CKD", "COPD exacerbation history", "Cognitive impairment"]'),
('PT-2155', 48.00, 'MEDIUM', '["Post-stent (PCI) status", "Dual-antiplatelet (DAPT) compliance requirements"]');

-- Seed Discharge Summaries
INSERT INTO discharge_summaries (patient_id, overview, diagnosis_summary, medications_recon, followup_instructions, approved_by, approved_at) VALUES
('PT-2099', '45-year-old male admitted with tibia fracture, status post ORIF on June 19.', 'Closed fracture of left tibia-fibula, ORIF performed successfully.', 'Oxycodone 5mg every 6 hrs PRN, Acetaminophen 650mg every 6 hrs scheduled.', 'Non weight bearing, suture check scheduled in 10 days.', 2, '2026-06-24 10:30:00+00'),
('PT-1999', '69-year-old female with leg cellulitis, responded to IV Cefazolin.', 'Right lower leg cellulitis, resolved.', 'Cephalexin 500mg PO every 6 hours to complete 7-day course.', 'Follow up with wound clinic, elevate leg when sitting.', 3, '2026-06-23 15:45:00+00');

-- Seed Notifications
INSERT INTO notifications (title, description, type, is_read) VALUES
('Discharge Signed & Approved', 'Dr. Amit Sharma approved and signed off on the clinical summary for Marcus Brody (PT-2099).', 'success', FALSE),
('Risk Level Recalculated', 'AI Engine predicted a 78% readmission probability for James Harrison (PT-2041).', 'danger', FALSE);

-- Seed Audit Logs
INSERT INTO audit_logs (user_id, action, details, ip_address) VALUES
(1, 'USER_LOGIN', 'Chief Medical Officer logged in from web client.', '192.168.1.104'),
(1, 'DISCHARGE_SIGN_OFF', 'Approved summary for PT-2099 (Marcus Brody).', '192.168.1.104');
