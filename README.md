# Reddit Clone API

This project is a Reddit-like API developed using Node.js, Express, and Firebase Realtime Database to manage posts, comments, upvotes, and downvotes. It provides functionalities similar to Reddit where users can create, update, delete posts, comment on posts, and upvote or downvote posts and comments.

---

## Features

- Usesr Firestore database to manage posts
- Create, retrieve, update, and delete posts.
- Upvote or downvote posts and comments.
- Add comments to posts.
- Query posts created by a specific user.
- Get posts upvoted or downvoted by a user.

## Prerequisites

Before running the project locally, ensure you have the following installed:

- Node.js
- Firebase project with Firestore enabled
- Have Postman installed
- Clone this repository

## Installation  
1. Clone this repository:

   ```bash
   git clone https://github.com/your-username/reddit-clone-api.git
   cd reddit-clone-api
2. Install dependencies

    ```bash
    npm install

3. Set up Firebase configuration

Create a .env file at the root of the project and add the Firebase configuration variables:

    ```bash
    PORT=5000
    HOST=localhost
    HOST_URL=http://localhost:5000

    # Firebase config
    API_KEY=your_api_key
    AUTH_DOMAIN=your_auth_domain
    PROJECT_ID=your_project_id
    STORAGE_BUCKET=your_storage_bucket
    MESSAGING_SENDER_ID=your_messaging_sender_id
    APP_ID=your_app_id`

4. Run the project
    ```bash
    npm start

5. Usage
To use this Reddit-like API, follow the API endpoints documented below. Ensure you are connected to firebase.

API Endpoints:

Get all posts
GET /

 ##Create a new post
POST /new
 ##Get a post by ID
GET /post/:id
 ##Update a post by ID
PUT /update/:id
 ##Delete a post by ID
DELETE /delete/:id
##Get posts by a specific user
GET /user/:userId

 ##Upvote a post by ID
POST /post/upvote/:id
 ##Downvote a post by ID
POST /post/downvote/:id
 ##Add a comment to a post by ID
POST /post/comment/:id
 ##Upvote a comment by ID within a specific post
POST /post/:postId/comment/:commentId/upvote
 ##Downvote a comment by ID within a specific post
POST /post/:postId/comment/:commentId/downvote

 #Get posts upvoted by a user
GET /user/:userId/upvoted-posts

6. Postman Collection
A Postman collection containing sample API requests is included in the POSTMAN DIRECTORY.

###Thank you

