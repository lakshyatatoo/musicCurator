# 🎵 MusicCurator

A backend for a music streaming platform that manages users, artists, music, and albums.

The project provides authentication using JWT, role-based access for artists, music and album management, and cloud-based music file storage.

## 🚀 Features

- User registration and login
- JWT-based authentication
- Authentication using HTTP cookies
- Password hashing with bcrypt
- Role-based authorization
- Artist-only music creation
- Artist-only album creation
- Music and album management
- MongoDB database integration using Mongoose
- Cloud storage for music files
- Protected API routes
- Middleware-based authentication and authorization

## 🛠️ Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Multer

### Storage

- ImageKit / Cloud storage

## 📁 Project Structure

```text
musicCurator/
│
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── music.controller.js
│   │
│   ├── db/
│   │   └── db.js
│   │
│   ├── middlewares/
│   │   └── auth.middleware.js
│   │
│   ├── models/
│   │   ├── album.model.js
│   │   ├── music.model.js
│   │   └── user.model.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── music.routes.js
│   │
│   └── services/
│       └── storage.service.js
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md
