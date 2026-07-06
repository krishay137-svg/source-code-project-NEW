-- =====================================================
-- EduShare Database Schema (SQLite)
-- Part 2 - Authentication Foundation
-- =====================================================

CREATE TABLE IF NOT EXISTS users (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    full_name TEXT NOT NULL,

    email TEXT NOT NULL UNIQUE,

    password TEXT NOT NULL,

    created_at TEXT DEFAULT (datetime('now')),

    updated_at TEXT DEFAULT (datetime('now'))

);

-- =====================================================
-- Part 3 - Notes Management
-- =====================================================

CREATE TABLE IF NOT EXISTS notes (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id INTEGER NOT NULL,

    title TEXT NOT NULL,

    subject TEXT NOT NULL,

    description TEXT NOT NULL,

    file_name TEXT NOT NULL,

    file_path TEXT NOT NULL,

    file_size INTEGER NOT NULL,

    file_type TEXT NOT NULL,

    downloads INTEGER DEFAULT 0,

    rating REAL DEFAULT 0,

    created_at TEXT DEFAULT (datetime('now')),

    updated_at TEXT DEFAULT (datetime('now')),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

);
