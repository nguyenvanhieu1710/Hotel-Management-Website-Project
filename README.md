# Hotel Management System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

A comprehensive hotel management system built with modern web technologies to streamline hotel operations, room management, and booking processes.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

## ✨ Features

- **User Management**

  - User registration and authentication
  - Role-based access control (Admin, Staff, Customer)
  - Profile management

- **Room Management**

  - Room inventory tracking
  - Room status monitoring
  - Room type categorization
  - Room maintenance scheduling

- **Booking System**

  - Online reservation system
  - Booking calendar
  - Payment integration
  - Booking confirmation and notifications

- **Dashboard Analytics**
  - Revenue tracking
  - Occupancy rates
  - Booking statistics
  - Performance metrics

## 🛠 Tech Stack

### Frontend

- React.js
- Material-UI
- Redux for state management
- Axios for API calls
- React Router for navigation

### Backend

- Node.js
- Express.js
- MySQL Database
- JWT Authentication
- RESTful API architecture

### Development Tools

- VS Code
- Git for version control
- npm for package management

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14.0.0 or higher)
- MySQL (v8.0 or higher)
- npm (v6.0.0 or higher)
- Git

## 🚀 Installation

1. Clone the repository

```bash
git clone https://github.com/nguyenvanhieu1710/Hotel-Management-Website-Project.git
cd Hotel-Management-Website-Project
```

2. Install dependencies for both frontend and backend

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up the database

```bash
# Import the database schema
mysql -u your_username -p < database/schema.sql
```

4. Configure environment variables

```bash
# Copy the example env file
cp .env.example .env
# Edit .env with your configuration
```

5. Start the development servers

```bash
# Start backend server
cd backend
npm run dev

# Start frontend server
cd ../frontend
npm run dev
```

## 📁 Project Structure

```
Hotel-Management-Website-Project/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   └── public/             # Static files
├── backend/                 # Node.js backend application
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   └── middleware/     # Custom middleware
│   └── config/             # Configuration files
└── database/               # Database scripts and migrations
```

## 📚 API Documentation

The API documentation is available at `/api-docs` when running the server. It includes:

- Authentication endpoints
- User management endpoints
- Room management endpoints
- Booking endpoints
- Analytics endpoints

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=hotel_management

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password
```

## 📸 Screenshots

### Home Page

![Home](https://github.com/user-attachments/assets/bd7a442b-94b3-4532-8d67-07e3ad3b9aef)

### Room Management

![Rooms](https://github.com/user-attachments/assets/6eca0ad2-6268-4863-a3e5-e797a648ea00)

### Booking System

![Booking](https://github.com/user-attachments/assets/9c0f12b9-3c0c-48fe-b081-434ad50b7b30)

### Admin Dashboard

![Dashboard](https://github.com/user-attachments/assets/e0055bb0-ab9d-4205-ad68-5b8820f89bf1)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Nguyễn Văn Hiếu**

- Student at UTEHY
- Class: 12522W.2KS
- Email: [nguyenvanhieu171004@gmail.com]
- GitHub: [nguyenvanhieu1710]

---

⭐️ If you like this project, please give it a star on GitHub!
