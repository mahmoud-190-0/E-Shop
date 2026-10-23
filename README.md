# E-Shop Backend API

A RESTful API for an e-commerce application built with Node.js, Express.js, and MongoDB.

## 🚀 Technologies

- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication & Authorization
- Stripe Checkout Integration
- Cloudinary / Image Upload Processing
- Express Middleware & Request Validation

## ✨ Features

- User registration, login, and password reset
- Role-based access control
- Products, categories, subcategories, and brands management
- Product reviews and ratings
- Shopping cart management
- Wishlist management
- Customer address management
- Coupon management
- Cash orders and Stripe checkout
- Product filtering and query features
- Centralized error handling
- Image upload and processing

## 📁 Project Structure

#text
E-Shop/
├── config/
├── controllers/
├── Middleware/
├── models/
├── routes/
├── utils/
│   └── Validators/
├── uploads/
├── app.js
├── server.js
├── package.json
├── .env.example
├── API_DOCUMENTATION.md
└── README.md

> The folder structure above is illustrative. Adjust it to match the actual files in your repository.

## ⚙️ Requirements

- Node.js
- npm
- MongoDB database
- Environment variables configured

## 🛠️ Installation

Clone the repository:

#bash
git clone https://github.com/mahmoud-190-0/E-Shop.git
cd E-Shop
#

Install dependencies:

#bash
npm install
#

Create a `.env` file in the project root and configure the required environment variables.

#env
PORT=5000
NODE_ENV=development
#

Add the remaining variables required by your application, such as MongoDB connection settings, JWT configuration, and payment/image service credentials. Use the actual variable names expected by the code.

Start the application using the script defined in `package.json`, for example:

#bash
npm run dev
#

Check `package.json` for the exact available scripts.

## 🌐 API Base URL

Local development:

#text
http://localhost:5000/api/v1

## 🔐 Authentication

Protected endpoints require a valid JWT access token.

Include the token in the request header:

#http
Authorization: Bearer <YOUR_ACCESS_TOKEN>
#

Access permissions depend on the user's role.

## 📚 API Documentation

For available endpoints, HTTP methods, access permissions, and integration notes, see:

[`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md)

## 🧪 API Testing

You can test endpoints using Postman or another API client.

Test public endpoints first, then authenticate and test protected endpoints with the appropriate user role.

## 🔒 Security Notes

- Never commit `.env` or real credentials.
- Keep `.env.example` free of secrets.
- Validate request data before processing it.
- Use appropriate authorization checks for protected operations.
- Keep production credentials and configuration secure.

## 👨‍💻 Author

**Mahmoud Ahmed Ali**

GitHub: [mahmoud-190-0](https://github.com/mahmoud-190-0)

## 📄 License

Add a license if and when one is selected for this project.
