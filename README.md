# DevSync

## Overview

This project is a **full-stack social platform** designed to enable users to create posts, interact through likes and comments, and manage their profiles. The platform supports two main types of posts: normal posts and questions, similar to platforms like Twitter or Stack Overflow.

## This project was developed as part of the final project at Developers Institute.

## Features

### Core Features

- **Authentication:**
  - User registration and login with hashed passwords.
  - Token-based authentication (JWT) with httpOnly cookies.
  - Protected routes for authorized users only.
- **Post Management:**
  - Create, read, update, and delete posts.
  - Support for two types of posts: normal and questions.
  - Like functionality for posts.
  - Infinite scrolling for a seamless feed experience.
- **Comments:**
  - Commenting on posts.
  - Liking comments.
  - Sorting comments by popularity (most liked).
- **Profile Management:**
  - Edit profile details (username, email, profile picture, password).
  - Validation for updating sensitive information.

---

## Tech Stack

### Frontend

- **React (TypeScript):**
- **Redux Toolkit:**
- **TailwindCSS:**
- **React Router:**
- **ShadCN UI:**

### Backend

- **Node.js with Express:**
- **Knex.js:**
- **JWT Authentication:**
- **Bcrypt:**
- **Neon PostgreSQL:**

### Database Schema

#### Tables:

1. **Users**:
   - `id`, `username`, `email`, `password`, `profilePicture`, `createdAt`
2. **Posts**:
   - `id`, `userId`, `title`, `content`, `postType`, `createdAt`
3. **Likes**:
   - `id`, `userId`, `postId`
4. **Comments**:
   - `id`, `userId`, `postId`, `content`, `createdAt`
5. **Comments_likes**:
   - `id`, `userId`,`commentId`

---

## Installation

### Prerequisites

Ensure you have the following installed:

- Node.js (v16+)
- PostgreSQL
- npm or yarn

### Clone the Repository

```bash
$ git clone https://github.com/Eyal001/Final_Project.git
$ cd social-platform
```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   $ cd backend
   ```
2. Install dependencies:
   ```bash
   $ npm install
   ```
3. Configure environment variables:
   Create a `.env` file in the `backend/src` directory with the following:
   ```env
   PORT=5000
   CLIENT_URL=http://localhost:5173
   DATABASE_URL=your_database_url_here
   ACCESS_TOKEN_SECRET=your_secret_key
   ```
4. Run database migrations:
   ```bash
   $ npx knex migrate:latest
   ```
5. Start the backend server:
   ```bash
   $ npx ts-node server.ts
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   $ cd ../client
   ```
2. Install dependencies:
   ```bash
   $ npm install
   ```
3. Configure environment variables:
   Create a `.env` file in the `client` directory with the following:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```
4. Start the frontend development server:
   ```bash
   $ npm run dev
   ```

### Access the Application

Open your browser and navigate to:

- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:5000`
- **The link of the deployed project:** `https://devsync-0don.onrender.com`

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
