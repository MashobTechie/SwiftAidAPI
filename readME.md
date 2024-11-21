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
Responder-Specific Endpoints
Middleware
Error Handling
Contributing
Next Steps
Features
User Authentication: Secure signup, login, and logout functionalities.
Email Verification: Verification emails are sent upon signup to confirm user email addresses.
Emergency Contact Management: Allows users to add, update, delete, and retrieve emergency contacts.
Role-Based Access Control: Restricts access to responder-specific endpoints.
JWT Authentication: Protects routes using JSON Web Tokens (JWT) and middleware.
Token-Based Sessions: Maintains sessions using JWT tokens stored in cookies.
Error Handling: Unified error-handling mechanism for both client- and server-side issues.
Profile Image Management: (Optional) Upload and store user profile images using Cloudinary.
Responder Dashboard: Features for responders to view and manage emergencies.
Technologies Used
Node.js: Server-side runtime.
Express.js: Web framework for building APIs.
MongoDB: NoSQL database for storing user data and emergency contacts.
Mongoose: ODM for MongoDB, enabling schema definitions and database interactions.
JWT: JSON Web Tokens for authentication and authorization.
Nodemailer: Email service for sending verification emails.
Bcrypt: Secure password hashing and verification.
Cloudinary: (Optional) Cloud storage for user profile images.
Multer: Middleware for handling file uploads.
Project Structure
bash
Copy code
project-root
├── controllers
│   ├── authController.js        # Handles authentication and authorization logic
│   └── responderController.js   # Manages responder-specific operations
│
├── middlewares
│   ├── authMiddleware.js        # Middleware for route protection and role-based access
│   └── roleCheck.js             # Middleware for verifying responder role
│
├── models
│   └── userModel.js             # User schema and model definition
│
├── repositories
│   └── user.js                  # Database functions related to user data
│
├── routes
│   ├── authRoutes.js            # Routes for authentication and authorization
│   └── responderRoutes.js       # Routes for responder-specific functionalities
│
├── utils
│   ├── AppError.js              # Custom error class for application-specific errors
│   ├── catchAsync.js            # Utility for handling async errors in controllers
│   ├── jwt.js                   # JWT functions for signing and verifying tokens
│   ├── encryption.js            # Utility for comparing and hashing strings
│   └── createVerificationToken.js # Utility for generating email verification tokens
│
├── validations
│   └── user.js                  # Joi validation schemas for user data
│
├── .env                         # Environment variables for JWT, database, etc.
└── server.js                    # Main entry point to start the Express server
Installation
Clone the repository:
bash
Copy code
git clone https://github.com/your-username/SwiftAid.git
Navigate to the project directory:
bash
Copy code
cd SwiftAid
Install dependencies:
bash
Copy code
npm install
Set up environment variables in a .env file (see Environment Variables for details).
Start the server:
bash
Copy code
npm start
Environment Variables
Create a .env file in the root directory and add the following:

env
Copy code
PORT=5000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRES_IN=7d
NODEMAILER_HOST=<your-email-smtp-host>
NODEMAILER_PORT=<smtp-port>
NODEMAILER_USER=<your-email>
NODEMAILER_PASS=<your-email-password>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
Usage
Start the server:
bash
Copy code
npm start
Use Postman or another API testing tool to test the available endpoints.
API Endpoints
Authentication
POST /api/v1/auth/signup - Sign up as a new user or responder.
POST /api/v1/auth/login - Log in to your account.
POST /api/v1/auth/resend-verification - Resend verification email.
GET /api/v1/auth/verify-email/:email/:token - Verify email address.
Emergency Contacts
GET /api/v1/emergency - Retrieve all emergency contacts.
POST /api/v1/emergency - Add a new emergency contact.
PATCH /api/v1/emergency/:id - Update an emergency contact.
DELETE /api/v1/emergency/:id - Delete an emergency contact.
Responder-Specific Endpoints
GET /api/v1/responder/initiated - Fetch emergencies with status initiated.
PATCH /api/v1/responder/update-status - Update emergency status to active.
GET /api/v1/responder/my-emergencies - Retrieve emergencies assigned to the logged-in responder.
PATCH /api/v1/responder/resolve - Mark an active emergency as resolved.
Middleware
Authentication: Protects private routes with JWT-based authentication.
Role-Based Access Control: Grants access to responder-specific routes based on user roles.
Error Handling
All errors are standardized and returned with:

json
Copy code
{
  "success": false,
  "message": "Error description here"
}


Next Steps
Testing Responder Endpoints:

Verify the functionality of responder-specific endpoints using Postman.
Ensure proper role-based access control.
Hospital Notification Service:

Develop a notification service to alert nearby hospitals during emergencies.
