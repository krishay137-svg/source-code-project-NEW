# EduShare

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

A collaborative E-Learning Notes Sharing Platform that enables students to upload, discover, organize, and share study materials in a secure and user-friendly environment. EduShare promotes collaborative learning by allowing users to contribute educational resources, interact with the community, and access high-quality notes from fellow students.

---

## Overview

EduShare is a full-stack web application developed using Node.js, Express.js, MySQL, HTML, CSS, and JavaScript. The platform provides students with a centralized repository for academic resources while encouraging peer-to-peer learning through ratings, comments, bookmarks, and personalized dashboards.

The application follows a modular MVC architecture and is designed with scalability, security, and maintainability in mind.

---

## Features

### User Authentication

- Secure user registration and login
- Password hashing using bcrypt
- Session-based authentication
- Authentication middleware
- Input validation and sanitization
- Secure logout functionality

### Notes Management

- Upload study materials
- Download notes
- Edit uploaded notes
- Delete notes
- File type validation
- Organized file storage

### Dashboard & Profiles

- Personalized dashboard
- User profile management
- Profile picture upload
- Contribution statistics
- Download history
- Activity overview

### Search & Discovery

- Search notes by keyword
- Subject-based filtering
- Category filtering
- Tag-based search
- Trending notes
- Related note recommendations

### Community Features

- Rate uploaded notes
- Comment on study materials
- Bookmark favorite notes
- Report inappropriate content
- Notification system

### Leaderboard & Analytics

- Top contributors leaderboard
- Most downloaded notes
- Highest-rated notes
- Platform statistics
- User contribution analytics

### Admin Panel

- Administrator authentication
- User management
- Note moderation
- Report management
- Platform monitoring

### User Experience

- Fully responsive design
- Modern user interface
- Custom 404 page
- Dark mode
- Loading animations
- Toast notifications

### Security

- Password hashing
- Session management
- Input validation
- Data sanitization
- Secure file uploads
- Protected routes
- SQL injection prevention
- Error handling

---

# Technology Stack

## Backend

- Node.js
- Express.js

## Database

- MySQL

## Frontend

- HTML5
- CSS3
- Vanilla JavaScript

## Version Control

- Git
- GitHub

---

# Project Structure

```
EduShare/
│
├── config/
├── controllers/
├── database/
├── docs/
├── middleware/
├── models/
├── public/
│   ├── css/
│   ├── images/
│   └── js/
│
├── routes/
├── uploads/
│   ├── notes/
│   └── profilePictures/
│
├── utils/
├── views/
│
├── server.js
├── package.json
├── README.md
├── CONTRIBUTORS.md
├── .gitignore
└── .env
```

---

# Installation

## Clone the Repository

```bash
git clone https://github.com/your-username/EduShare.git

cd EduShare
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment Variables

Create a `.env` file in the project root.

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=edushare

SESSION_SECRET=your_secure_session_secret
```

---

## Create the Database

Execute the SQL schema using MySQL.

```sql
SOURCE database/schema.sql;
```

---

## Start the Application

Development

```bash
npm run dev
```

Production

```bash
npm start
```

The application will be available at:

```
http://localhost:3000
```

---

# Database Schema

The application uses the following database tables:

- users
- subjects
- notes
- tags
- note_tags
- ratings
- comments
- bookmarks
- notifications
- downloads
- views
- reports

---

# Application Workflow

1. Users create an account.
2. Secure authentication grants access to the platform.
3. Users upload academic resources.
4. Study materials become searchable by subject, category, and tags.
5. Other users can download, bookmark, rate, and comment on notes.
6. The leaderboard rewards active contributors.
7. Administrators moderate content and manage reports.

---

# Team

| Member | Responsibility |
|---------|----------------|
| Krishay | Project Foundation & Authentication |
| Nandan Kumar | Notes Management |
| Ashlyn | Dashboard & Profiles |
| Aditya | Search & Discovery |
| Nihar | Community Features |

---

# Future Enhancements

Potential future improvements include:

- Mobile application
- Real-time chat
- AI-powered note recommendations
- OCR for scanned documents
- Cloud storage integration
- Email verification
- Two-factor authentication
- Advanced analytics
- REST API for third-party integrations

---

# Acknowledgements

We would like to thank everyone who contributed to the development of EduShare. This project was created to encourage collaborative learning and make educational resources more accessible to students.