# 🧠 A Full-Stack Learning Backend

This is a robust, full-featured backend application built as a part of serious backend learning using Node.js, Express, and MongoDB. The project implements scalable APIs for managing users, videos, playlists, likes, subscriptions, comments, and even tweets.

---

## 📑 Table of Contents

- [Project Structure](#-project-structure)  
- [Features](#-features)  
- [Tech Stack](#-tech-stack)  
- [Setup Instructions](#-setup-instructions)  
- [API Routes Overview](#-api-routes-overview)  
- [Author](#-author)  

---

## 🏗️ Project Structure

```
mrastatine-backend-learning/
├── package.json
└── src/
    ├── app.js              # Express app setup & route bindings
    ├── index.js            # Entry point + DB connect
    ├── constants.js        # App-wide constants
    ├── controllers/        # All route logic
    ├── db/                 # MongoDB connection
    ├── middlewares/        # Auth, multer
    ├── models/             # Mongoose schemas
    ├── routes/             # Express routers
    └── utils/              # Custom utils (error, responses, etc.)
```

---

## 🚀 Features

- 🧑‍🎓 **User Management**: Registration, login, profile update, password change  
- 🧵 **Tweet System**: Create, update, delete tweets  
- 🎬 **Video Module**: Upload, manage, and toggle publish status of videos  
- 🎥 **Playlist Management**: Create, edit, and delete user playlists  
- 💬 **Commenting System**: Add/edit/delete comments under videos  
- ❤️ **Like System**: Toggle likes on tweets, videos, and comments  
- 📊 **Channel Dashboard**: Get channel-level stats like views and likes  
- 🔔 **Subscriptions**: Subscribe/unsubscribe to users  
- 🔁 **Token Refresh**: Full JWT-based auth with access/refresh token logic  
- ☁️ **File Upload**: Images & videos stored on Cloudinary  

---

## 🧰 Tech Stack

| Tech       | Purpose               |
|------------|-----------------------|
| Node.js    | Runtime environment   |
| Express    | Backend framework     |
| MongoDB    | NoSQL Database        |
| Mongoose   | ODM for MongoDB       |
| Cloudinary | File/media storage    |
| Multer     | File upload handling  |
| JWT        | Authentication system |
| bcrypt     | Password hashing      |
| Prettier   | Code formatting       |

---

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/mrastatine-backend-learning.git
cd mrastatine-backend-learning
npm install
```

### 2. Set Environment Variables

Create a `.env` file or set the following environment variables in your system:

```bash
PORT=8000
MONGODB_URI=mongodb://localhost:27017
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CORS_ORIGIN=http://localhost:3000
```

### 3. Run the Development Server

```
npm run dev
```

---

## 📡 API Routes Overview

All protected routes require a valid JWT in cookies or headers.

### 🧑‍💼 User

- `POST /api/v1/users/register` – Register user with avatar and cover image  
- `POST /api/v1/users/login` – Login with email or username  
- `POST /api/v1/users/logout` – Logout and clear tokens  
- `GET /api/v1/users/current-user` – Get current logged-in user  
- `PATCH /api/v1/users/avatar` – Update avatar  
- `PATCH /api/v1/users/cover-image` – Update cover image  
- `GET /api/v1/users/c/:username` – Get a user’s channel profile  
- `GET /api/v1/users/history` – Get user watch history  

### 🎞️ Video

- `POST /api/v1/video/` – Upload a new video  
- `GET /api/v1/video/` – List all videos  
- `PATCH /api/v1/video/:videoId` – Update video info  
- `DELETE /api/v1/video/:videoId` – Delete video  
- `PATCH /api/v1/video/toggle/publish/:videoId` – Toggle publish status  

### 📃 Tweet

- `POST /api/v1/tweet/` – Create a tweet  
- `GET /api/v1/tweet/:userId` – Get user's tweets  

### 💬 Comments

- `GET /api/v1/comment/:videoId` – Get comments under a video  
- `POST /api/v1/comment/:videoId` – Add a comment  
- `PATCH /api/v1/comment/c/:commentId` – Update comment  
- `DELETE /api/v1/comment/c/:commentId` – Delete comment  

### 🎼 Playlists

- `POST /api/v1/playlist/` – Create playlist  
- `GET /api/v1/playlist/user/:userId` – Get playlists of user  
- `POST /api/v1/playlist/:playlistId/videos` – Add video  
- `DELETE /api/v1/playlist/:playlistId/videos/:videoId` – Remove video  

### 🔔 Subscriptions

- `POST /api/v1/subscription/c/:channelId` – Subscribe/unsubscribe  
- `GET /api/v1/subscription/c/:channelId/subscribers` – Get subscribers  
- `GET /api/v1/subscription/c/:channelId/subscribed-channels` – Get followed channels  

### ❤️ Likes

- `POST /api/v1/like/toggle/v/:videoId` – Like/unlike a video  
- `POST /api/v1/like/toggle/c/:commentId` – Like/unlike a comment  
- `GET /api/v1/like/videos` – Get liked videos  

---

## ✍️ Author

Akshat Tripathi
