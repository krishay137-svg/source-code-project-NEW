-- =====================================================
-- EduShare Database Schema (SQLite)
-- Part 2 - Authentication Foundation
-- =====================================================

CREATE TABLE IF NOT EXISTS users (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

-- =====================================================
-- Part 2 — Authentication
-- =====================================================

CREATE TABLE IF NOT EXISTS users (

    id          INT AUTO_INCREMENT PRIMARY KEY,

    full_name   VARCHAR(100) NOT NULL,

    email       VARCHAR(150) NOT NULL UNIQUE,

    password    VARCHAR(255) NOT NULL,

    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP

);

-- =====================================================
-- Part 5 — Search & Discovery
-- =====================================================

CREATE TABLE IF NOT EXISTS subjects (

    id          INT AUTO_INCREMENT PRIMARY KEY,

    name        VARCHAR(100) NOT NULL UNIQUE,

    code        VARCHAR(20),

    description TEXT,

    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE IF NOT EXISTS notes (

    id                INT AUTO_INCREMENT PRIMARY KEY,

    user_id           INT NOT NULL,

    subject_id        INT,

    title             VARCHAR(255) NOT NULL,

    description       TEXT,

    filename          VARCHAR(255) NOT NULL,

    original_filename VARCHAR(255) NOT NULL,

    file_type         VARCHAR(50)  NOT NULL,

    file_size         INT          NOT NULL,

    semester          VARCHAR(20),

    download_count    INT DEFAULT 0,

    view_count        INT DEFAULT 0,

    is_approved       TINYINT(1) DEFAULT 1,

    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                          ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,

    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL

);

CREATE TABLE IF NOT EXISTS tags (

    id         INT AUTO_INCREMENT PRIMARY KEY,

    name       VARCHAR(50) NOT NULL UNIQUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE IF NOT EXISTS note_tags (

    note_id INT NOT NULL,

    tag_id  INT NOT NULL,

    PRIMARY KEY (note_id, tag_id),

    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,

    FOREIGN KEY (tag_id)  REFERENCES tags(id)  ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS downloads (

    id            INT AUTO_INCREMENT PRIMARY KEY,

    note_id       INT NOT NULL,

    user_id       INT,

    downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (note_id) REFERENCES notes(id)  ON DELETE CASCADE,

    FOREIGN KEY (user_id) REFERENCES users(id)  ON DELETE SET NULL

);

CREATE TABLE IF NOT EXISTS views (

    id        INT AUTO_INCREMENT PRIMARY KEY,

    note_id   INT NOT NULL,

    user_id   INT,

    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (note_id) REFERENCES notes(id)  ON DELETE CASCADE,

    FOREIGN KEY (user_id) REFERENCES users(id)  ON DELETE SET NULL

);

-- =====================================================
-- Seed Data — Subjects & Tags
-- (INSERT IGNORE is safe to re-run on restart)
-- =====================================================

INSERT IGNORE INTO subjects (name, code, description) VALUES
    ('Mathematics',     'MTH', 'Algebra, Calculus, Statistics and more'),
    ('Physics',         'PHY', 'Mechanics, Optics, Thermodynamics'),
    ('Chemistry',       'CHM', 'Organic, Inorganic, Physical Chemistry'),
    ('Computer Science','CSE', 'Programming, Data Structures, Algorithms'),
    ('English',         'ENG', 'Literature, Grammar, Communication'),
    ('Economics',       'ECO', 'Micro and Macro Economics'),
    ('Biology',         'BIO', 'Botany, Zoology, Genetics'),
    ('History',         'HIS', 'Ancient, Medieval, Modern History');

INSERT IGNORE INTO tags (name) VALUES
    ('exam-prep'),
    ('short-notes'),
    ('detailed'),
    ('previous-year'),
    ('formula-sheet'),
    ('diagrams'),
    ('important'),
    ('revision');
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
