# EduShare - Project Development Plan

---

# Project Information

**Project Name**

EduShare

**Project Type**

Collaborative E-Learning Notes Sharing Platform

**Purpose**

EduShare is a collaborative platform that enables students to upload, search, download, rate and discuss study materials in order to promote collaborative learning.

---

# Technology Stack

The following technologies are FINAL and must never be changed unless explicitly approved.

## Backend

- Node.js
- Express.js

## Database

- MySQL

## Frontend

- HTML5
- CSS3
- JavaScript (Vanilla)

## Version Control

- Git
- GitHub

No other frameworks or libraries (React, Angular, Vue, Django, etc.) will be used unless explicitly requested.

---

# Development Philosophy

This project must be developed like a production software project rather than a college CRUD project.

Rules:

- Every feature must be production quality.
- Every file must be complete.
- No placeholder code.
- No unfinished functions.
- Every part must compile before moving to the next.
- Never break previously working code.
- Maintain clean code and proper formatting.
- Use meaningful variable and function names.
- Keep the code modular.
- Follow the MVC folder structure.
- Security and error handling should be considered throughout development.

---

# ChatGPT Development Rules

The following rules must be followed throughout the entire project.

## Rule 1

Never change the project plan.

## Rule 2

Never add new website features unless explicitly requested by the user.

## Rule 3

Do not remove any planned feature.

## Rule 4

Suggestions are allowed ONLY for:

- Code quality
- Performance
- Security
- Maintainability
- Git workflow

Suggestions for changing website functionality are NOT allowed unless requested.

## Rule 5

Always provide COMPLETE paste-ready code.

Never provide snippets.

Whenever a file changes:

Provide the ENTIRE updated file.

## Rule 6

Always specify:

- File path
- Action (Create / Replace)
- Complete code

## Rule 7

Never continue to the next part until the current part has been fully completed and verified.

## Rule 8

If response length prevents sending an entire part:

Remain inside the current part until every required file has been completed.

---

# Folder Structure

EduShare/

```
config/
controllers/
database/
docs/
middleware/
models/
public/
routes/
uploads/
utils/
views/

server.js
package.json
README.md
CONTRIBUTORS.md
.gitignore
.env
```

---

# Development Plan

## Part 1

Project Setup & Landing Page

Includes

- Folder structure
- Express setup
- MySQL connection
- Landing page
- Global CSS
- Global JavaScript
- Routing
- Database foundation
- README
- CONTRIBUTORS
- Git configuration

---

## Part 2

Authentication

Includes

- Registration
- Login
- Logout
- Sessions
- Password hashing
- Authentication middleware
- Validation

---

## Part 3

Notes Management

Includes

- Upload notes
- Download notes
- Edit notes
- Delete notes
- File validation
- File uploads

---

## Part 4

Dashboard & Profiles

Includes

- Dashboard
- Profile page
- Edit profile
- Profile picture
- Statistics

---

## Part 5

Search & Discovery

Includes

- Search
- Filters
- Categories
- Tags
- Related notes
- Trending notes

---

## Part 6

Community Features

Includes

- Ratings
- Comments
- Bookmarks
- Notifications
- Report note

---

## Part 7

Leaderboard & Analytics

Includes

- Leaderboard
- Statistics
- Top contributors
- Most downloaded
- Highest rated

---

## Part 8

Admin Panel

Includes

- Admin authentication
- User management
- Note management
- Report management

---

## Part 9

UI Polish

Includes

- Responsive improvements
- Animations
- Dark mode
- Loading screens
- Toast notifications

---

## Part 10

Security & Optimization

Includes

- Validation
- Sanitization
- Performance improvements
- Security improvements

---

## Part 11

Documentation

Includes

- Final README
- API documentation
- Screenshots
- Demo preparation

---

## Part 12

Testing & Deployment

Includes

- Testing
- Bug fixes
- Deployment
- Final presentation

---

# Database Strategy

The database will be built progressively.

Tables will only be introduced when required by the corresponding project part.

The final database will include:

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

No unnecessary tables should be introduced early.

---

# Git Workflow

Development takes place on the main branch until another team member begins work on their assigned part.

Feature branches are created only when development begins for that assigned feature.

Example:

Member 2

authentication

Member 3

notes

Member 4

dashboard

Member 5

search

All feature branches must be merged using Pull Requests.

---

# Commit Policy

Every commit must represent meaningful progress.

Artificial commits should never be created.

Each completed part should naturally produce approximately five meaningful commits.

Example:

Authentication

- Create user model
- Implement registration
- Implement login
- Add authentication middleware
- Improve validation

---

# Team Responsibilities

Member 1

Project foundation

Authentication

Git management

---

Member 2

Notes Management

---

Member 3

Dashboard

Profiles

---

Member 4

Search

Discovery

---

Member 5

Community Features

---

# Project Status

Current Part

Part 1

Status

In Progress

Completed Parts

None

---

# Completion Rule

A part is considered complete only when:

- All planned files are finished.
- The application compiles.
- All routes work.
- Database changes are verified.
- Git commit has been created.
- Progress has been tested.

Only then may development proceed to the next part.

---

# Important Rule

This document is the master reference for the project.

Unless the user explicitly requests otherwise, neither the development plan nor the project requirements may be modified.