# KlinikaHub - Patient Healthcare Management System

KlinikaHub is a comprehensive healthcare management system designed to streamline the interaction between patients and healthcare providers. The application provides a user-friendly interface for patients to manage their healthcare journey effectively.

## Features

### For Patients

- 🏥 **Appointment Management**: Schedule, view, and manage medical appointments
- 💬 **AI-Powered Chat**: Get instant responses to health-related queries
- 📋 **Medical Records**: Access and track personal medical history
- 👨‍⚕️ **Doctor Directory**: Browse and connect with healthcare providers
- 💳 **Invoice Management**: View and manage medical bills
- 🔔 **Smart Reminders**: Get notifications for appointments and medications
- 👤 **Profile Management**: Update personal information and preferences

## Tech Stack

### Backend

- Node.js
- Express.js
- SQLite Database
- JWT Authentication

### Frontend

- React Native
- Tailwind CSS
- Metro bundler

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git
- React Native development environment setup

### Installation Steps

1. Clone the repository

```bash
git clone https://github.com/h4nzdev/KlinikaHubApp.git
cd KlinikaHubApp
```

2. Install Backend Dependencies

```bash
cd backend
npm install
```

3. Set up the Database

```bash
# The SQLite database will be automatically created when you start the server
npm run start
```

4. Install Frontend Dependencies

```bash
cd ../client
npm install
```

5. Start the Application

```bash
# Start the backend server (from the backend directory)
npm run start

# In a new terminal, start the React Native application (from the client directory)
npm start
```

## Environment Setup

### Backend Configuration

The backend uses a SQLite database by default. The configuration can be found in `backend/config/database.js`.

### Mobile App Configuration

The mobile app configuration can be found in `client/app.json` and `client/metro.config.js`.

## Application Structure

```
backend/           # Backend server code
  ├── config/     # Configuration files
  ├── controller/ # Request handlers
  ├── model/      # Database models
  ├── routes/     # API routes
  └── server.js   # Server entry point

client/           # React Native application
  ├── src/        # Source code
  ├── assets/     # Images and static files
  └── index.js    # Application entry point
```

## Features in Detail

### Patient Authentication

- Secure login and registration
- JWT-based authentication
- Role-based access control

### Medical Records

- View complete medical history
- Access to past prescriptions
- Track medical test results

### AI-Powered Chat

- Instant health-related queries
- 24/7 availability
- Personalized responses

### Appointment Management

- Real-time appointment booking
- Cancellation and rescheduling
- Automated reminders

## Security

- JWT-based authentication
- Encrypted data transmission
- Secure storage of patient information

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

- Developer: h4nzdev
- Project Link: https://github.com/h4nzdev/KlinikaHubApp

---

Made with ❤️ by h4nzdev
