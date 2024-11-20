SwiftAid Emergency Response System
SwiftAid is an emergency rapid response system designed to manage emergency contacts, responder roles, and authenticated user interactions. Built using the MERN stack, this project provides functionality for user authentication, managing emergency contacts, email verification, and responder-specific access controls.

Table of Contents
Features
Technologies Used
Project Structure
Installation
Environment Variables
Usage
API Endpoints
Authentication
Emergency Contacts
Middleware
Error Handling
Contributing
Features


User Authentication: Users can sign up, log in, and log out securely.
Email Verification: Verification email is sent upon sign-up to confirm the user’s email.
Emergency Contact Management: Users can add, update, delete, and retrieve emergency contacts.
Role-Based Access: Responder role with restricted access to certain endpoints.
JWT Authentication: Protects routes using JSON Web Tokens (JWT) and middleware.
Token-Based Sessions: Sessions are maintained via JWT tokens stored in cookies.
Error Handling: Unified error handling to manage client- and server-side errors.
Technologies Used
Node.js: Server-side runtime. 
Express.js: Web framework for creating APIs.
MongoDB: Database for storing user data and emergency contacts.
Mongoose: ODM for MongoDB, facilitating schema definitions.
JWT: Used for token-based authentication.
Nodemailer: For sending verification emails.
Bcrypt: For hashing and verifying passwords.
Cloudinary: (Optional) For storing user profile images.
Multer: For handling file uploads.


project-root
├── controllers
│   ├── authController.js       # Handles authentication and authorization logic
│   └── emergencyController.js  # Manages emergency contacts for authenticated users
│
├── middlewares
│   └── authMiddleware.js       # Middleware for route protection and role-based access
│
├── models
│   └── userModel.js            # User schema and model definition
│
├── repositories
│   └── user.js                 # Database functions related to user data
│
├── routes
│   ├── authRoutes.js           # Routes for authentication and authorization
│   └── emergencyRoutes.js      # Routes for emergency contact management
│
├── utils
│   ├── AppError.js             # Custom error class for application-specific errors
│   ├── catchAsync.js           # Utility for handling async errors in controllers
│   ├── jwt.js                  # JWT functions for signing tokens
│   ├── encryption.js           # Utility for comparing and hashing strings
│   └── createVerificationToken.js # Utility for email verification token generation
│
├── validations
│   └── user.js                 # Joi validation schemas for user data
│
├── .env                        # Environment variables for JWT, DB, etc.
└── server.js                   # Main entry point to start the Express server
