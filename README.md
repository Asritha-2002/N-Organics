# Project overview and key features
N-Organics is a MERN stack e-commerce application developed for selling organic and natural products through an intuitive online platform. It enables customers to browse products, manage their shopping cart, and securely place orders. The application includes user authentication, address management, and order tracking features for a seamless shopping experience. An admin panel allows administrators to manage products, categories, orders, and users efficiently. The platform provides a responsive interface optimized for desktop and mobile devices. It is built with scalability and maintainability in mind using modern web technologies.
# Detailed setup and installation process
1. Clone the Repository
git clone <repository-url>
cd n-organics
2. Install Dependencies
Frontend
  cd frontend
  npm install
Backend
  cd backend
  npm install
3. Configure Environment Variables
Create a .env file inside the backend directory and add all required environment variables such as MongoDB connection string, JWT secret, Cloudinary credentials, email configuration, and frontend URL.
Similarly, create a .env file in the frontend directory (if required) to store backend API URLs and other frontend environment variables.
4. Start the Development Servers
Backend
  npm run dev
Frontend
  npm run dev
The frontend and backend will now run locally and communicate through the configured API endpoints.
# Database configuration and environment setup:
The application uses MongoDB Atlas as its cloud database.
Create a free MongoDB Atlas account.
Create a new cluster.
Create a database user by setting a username and password.
Add your IP address (or allow access from all IPs during development).
Click Connect → Drivers and copy the generated MongoDB connection string.
Paste the connection string into the backend .env file.
Example:
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
After configuring the environment variables, start the backend server. The application will automatically connect to the MongoDB database.
# Step-by-Step Deployment Process
Frontend Deployment
  Push the frontend code to GitHub.
  Import the repository into Vercel.
  Select the frontend folder as the project root.
  Add the required frontend environment variables.
  Deploy the project.
  Copy the generated frontend deployment URL.
Backend Deployment
  Import the same repository into Vercel as a new project.
  Select the backend folder as the project root.
  Add all backend environment variables.
  Set the FRONTEND_URL (or CORS origin) to the deployed frontend URL obtained in the previous step.
  Deploy the backend project.
  Update the frontend environment variable with the deployed backend API URL if required and redeploy the frontend.
# Hosting/Server Details Used for Deployment
The application is deployed using Vercel.
Frontend Hosting: Vercel
Backend Hosting: Vercel Serverless Functions
Database: MongoDB Atlas (Cloud Database)
Version Control: GitHub
# Third-Party Integrations and Services Used
MongoDB Atlas : Cloud-hosted NoSQL database for storing users, products, orders, and application data.
Cloudinary: Stores and serves uploaded product images with optimized delivery.
JWT (JSON Web Token) : Secure user authentication and protected API access.
bcrypt : Encrypts user passwords before storing them in the database.
Nodemailer / SMTP : Sends transactional emails such as OTPs, password reset links, or order notifications (if configured).
Vercel : Hosts both the frontend and backend applications with automatic deployments from GitHub.
GitHub : Source code repository and version control.
