# EduShare

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

A collaborative E-Learning Notes Sharing Platform that enables students to upload, discover, organize, and share study materials in a secure and user-friendly environment. EduShare promotes collaborative learning by allowing users to contribute educational resources, interact with the community, and access high-quality notes from fellow students.

---

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Database Schema](#database-schema)
- [Application Workflow](#application-workflow)
- [Team](#team)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)

---

## Overview

EduShare is a full-stack web application developed using Node.js, Express.js, MySQL, HTML, CSS, and JavaScript. The platform provides students with a centralized repository for academic resources while encouraging peer-to-peer learning through ratings, comments, bookmarks, and personalized dashboards.

The application follows a modular MVC architecture and is designed with scalability, security, and maintainability in mind.

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/EduShare.git
cd EduShare

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start the dev server
npm run dev
```

Visit `http://localhost:3000` to get started.

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

# Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTORS.md](CONTRIBUTORS.md) for project team details.

---

# License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

# Acknowledgements

We would like to thank everyone who contributed to the development of EduShare. This project was created to encourage collaborative learning and make educational resources more accessible to students.
