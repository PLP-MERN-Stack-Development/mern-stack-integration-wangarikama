# MERN Blog — Fullstack Integration

This repository contains a full-stack MERN (MongoDB, Express, React, Node) blog application used for the Week 4 assignment.

The project demonstrates a simple blogging platform with user authentication, post CRUD, image uploads, categories, searching and commenting.

## Tech stack

- Frontend: React (Vite)
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)
- Auth: JWT-based authentication
- File uploads: multer (server-side)

## Project structure (top-level)

```
client/       # React front-end (Vite)
server/       # Express back-end
README.md     
```

## Quick start — setup and run

Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or Atlas)

1) Clone

    git clone <your-repo-url>
    cd mern-stack-integration-wangarikama

2) Environment variables

Create a `.env` file in the `server/` folder with at least:

- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_jwt_secret
- JWT_EXPIRE=30d
- PORT=5000 (optional)

3) Install dependencies and run server

    cd server
    npm install
    npm run dev

The server listens on the port defined in `.env` (default 5000).

4) Install and run the client

    cd ../client
    npm install
    npm run dev

Open the front-end in your browser (Vite will show the URL, typically http://localhost:5173).

## API Documentation

Base URL (development): http://localhost:5000/api

Authentication

- POST /api/auth/register
  - Description: Register a new user
  - Body (JSON): { "username": "jane", "email": "jane@example.com", "password": "secret" }
  - Success response: 201 Created
    {
      "success": true,
      "token": "<jwt>",
      "user": { "_id": "...", "username": "jane", "email": "jane@example.com" }
    }

- POST /api/auth/login
  - Description: Login existing user
  - Body (JSON): { "email": "jane@example.com", "password": "secret" }
  - Success response: 200 OK (same shape as register)

Posts

- GET /api/posts
  - Description: List posts with pagination and optional category filter
  - Query params: page (default 1), limit (default 10), category (category id)
  - Success: 200 OK
    {
      "success": true,
      "count": 2,
      "pagination": { "total": 20, "page": 1, "limit": 10, "totalPages": 2 },
      "data": [ /* array of posts */ ]
    }

- GET /api/posts/search?q=term
  - Description: Search posts by title or content (case-insensitive)
  - Query params: q (required)

- GET /api/posts/:id
  - Description: Get a single post by id or slug

- POST /api/posts
  - Description: Create a new post (protected)
  - Headers: Authorization: Bearer <token>
  - Content-Type: multipart/form-data
  - Body fields (multipart): title, content, category, excerpt (optional), featuredImage (file)
  - Success: 201 Created -> created post JSON

- PUT /api/posts/:id
  - Description: Update a post (protected)
  - Content-Type: multipart/form-data (optional file)

- DELETE /api/posts/:id
  - Description: Delete a post (protected)

Comments

- POST /api/posts/:id/comments
  - Description: Add a comment to a post (protected)
  - Headers: Authorization: Bearer <token>
  - Body (JSON): { "content": "Nice post!" }
  - Success: 201 Created -> returns new comment object

Categories

- GET /api/categories
  - Description: List all categories

- POST /api/categories
  - Description: Create a category
  - Body (JSON): { "name": "Tech" }

Error handling

The API uses standard HTTP status codes. On errors the server forwards an Error object; typical shape is an error message and status code.

## Features implemented

- User registration and login (JWT)
- Create, read, update, delete posts
- Image uploads for posts (multipart/form-data)
- Post categories and category listing
- Search posts by title/content
- Comments on posts (authenticated)
- Pagination support for posts listing

## Screenshots

Below are two example screens from the application (Register and Login). To show them in this README, save the corresponding images to the `client/public/` folder with the exact filenames below.

Register page

![Register page](client/public/register.png)

Login page

![Login page](client/public/login.png)

To add these screenshots locally:

1. Save the provided register screenshot as `client/public/register.png`.
2. Save the provided login screenshot as `client/public/login.png`.
3. Commit and push — GitHub will render the images in this README automatically.

If you'd like, I can add the two files into the repository for you if you upload the images here or tell me where they're stored; otherwise follow the steps above.

## Development notes & next steps

- Add role-based authorization for editing/deleting posts
- Improve image storage (S3 or dedicated storage) and remove old images on update/delete
- Add integration tests for API endpoints

## License

This project is provided for educational purposes.

