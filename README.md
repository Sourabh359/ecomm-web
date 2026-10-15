# E-commerce Website

A full-stack e-commerce web application built using Node.js, Express.js, MongoDB, Mongoose, and Nunjucks. The project allows users to browse products, explore categories, and search for products through a web interface.

## Live Demo

Visit the live website here:

**[E-commerce Website](https://ecommerce-1yne.onrender.com)**

## Features

- Product listing and display
- Product categories
- Product search functionality
- User signup and login pages
- Server-side rendering using Nunjucks
- MongoDB database integration
- REST API endpoints for products and categories
- Environment variable configuration
- Deployment on Render

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript, jQuery
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **ODM:** Mongoose
- **Template Engine:** Nunjucks
- **Authentication / Sessions:** Express-session and related authentication code, where configured
- **Deployment:** Render
- **Version Control:** Git and GitHub

## Project Structure

```text
ecomm-web/
├── src/
│   ├── app.js
│   ├── dao.js
│   ├── jwtauth.js
│   ├── models/
│   ├── routes/
│   └── public/
├── public/
│   ├── css/
│   ├── js/
│   └── images/
│   └── views/
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Prerequisites

Before running this project, make sure you have installed:

- Node.js
- npm
- MongoDB Atlas account
- Git (optional)

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Sourabh359/ecomm-web.git
```

### 2. Open the Project Folder

```bash
cd ecomm-web
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the project root directory and add your MongoDB Atlas connection string:

```env
MONGODB_Data=mongodb+srv://maliksourabh503:<db_password>@merncluster.pwq16ht.mongodb.net/ecomm
```

**Important:** Never commit your `.env` file, database password, or other secrets to GitHub.

### 5. Start the Application

Run the following command:

```bash
npm start
```

If your project is configured to use port `3000` locally, open:

```text
http://localhost:3000
```

For development mode, if supported by your project scripts, run:

```bash
npm run dev
```

## Database Configuration

This project uses MongoDB Atlas to store application data.

The database used by the project is `ecomm`. Collections include:

- `categories` — stores product category information
- `product` — stores product information
- `admin` — stores admin-related data

Make sure your MongoDB Atlas connection string is correct and your database user has the required permissions.

## API Endpoints

The project includes API endpoints for retrieving product and category data.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/products` | Retrieve products |
| GET | `/api/category` | Retrieve categories |

These endpoints are based on the current project routes. Update this section if your actual routes differ.

## Deployment

The application is deployed using Render.

To deploy your own version:

1. Push your project to GitHub.
2. Create a Web Service on Render and connect the repository.
3. Configure the required environment variables in Render.
4. Set the build command to `npm install`.
5. Set the start command to `npm start`.
6. Deploy the application and check the logs for errors.

Make sure the MongoDB Atlas connection string is configured in Render's environment settings.

## Security Notes

- Keep `.env` out of version control.
- Never publish database credentials or secret keys.
- Use strong database passwords.
- Restrict database network access where possible.
- Configure session storage and security settings appropriately for production.

## Future Improvements

- Shopping cart functionality
- Order management
- Payment gateway integration
- User profile and account management
- Product reviews and ratings
- Admin dashboard improvements

These are potential enhancements and may not be implemented in the current version.

## Author

Developed as a full-stack web development project using Node.js, Express.js, MongoDB, and related technologies.