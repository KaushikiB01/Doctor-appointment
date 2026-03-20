# 🏥 MediSlot — Doctor Appointment Booking System

A full-stack web application for booking doctor appointments, with role-based access for patients and admins, real-time doctor listings, and a clean dark UI.

---

## ✨ Features

### Patient
- Register & log in securely with JWT auth
- Browse and search doctors by name or specialization
- View consultation fees and available days
- Book appointments with date & time selection
- View all personal bookings in a dashboard

### Admin
- Add, edit, and delete doctor profiles
- Toggle doctor availability on/off
- View all appointments across the platform

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT (JSON Web Tokens) |
| HTTP Client | Axios |
| Notifications | React Hot Toast |

---

## 📁 Project Structure

```
doctor-appointment/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── App.jsx          # Main app, routing & modals
│   │   ├── DoctorCard.jsx   # Doctor listing card component
│   │   ├── Login.jsx        # Auth page (login + register)
│   │   ├── App.css          # Global styles & design tokens
│   │   └── api.js           # Base API URL config
│   └── index.html
│
└── server/                  # Node.js + Express backend
    ├── models/
    │   ├── User.js
    │   ├── Doctor.js
    │   └── Appointment.js
    ├── routes/
    │   ├── auth.js          # /register, /login
    │   ├── doctors.js       # CRUD + toggle availability
    │   └── appointments.js  # Book & fetch appointments
    └── index.js             # Entry point
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the repo

```bash
git clone https://github.com/KaushikiB01/Doctor-appointment.git
cd Doctor-appointment
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file in `/server`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the server:

```bash
npm start
```

### 3. Set up the frontend

```bash
cd client
npm install
```

Create a `.env` file in `/client`:

```env
VITE_API_URL=http://localhost:5000
```

Start the dev server:

```bash
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## 🔐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register a new patient |
| POST | `/login` | Login and receive JWT |

### Doctors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/doctors` | Get all doctors |
| POST | `/doctors/add` | Add a doctor *(admin)* |
| PUT | `/doctors/:id` | Edit a doctor *(admin)* |
| DELETE | `/doctors/:id` | Remove a doctor *(admin)* |
| PUT | `/doctors/toggle/:id` | Toggle availability *(admin)* |

### Appointments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/appointments` | Book an appointment |
| GET | `/bookings` | Get bookings (filtered by role) |

---

## 👤 Roles

| Role | Access |
|------|--------|
| `patient` | Browse doctors, book appointments, view own bookings |
| `admin` | Full CRUD on doctors, view all bookings |

> Admin accounts are set directly in the database (`role: "admin"`). New registrations default to `patient`.

---

## 📸 Screenshots

> _Add screenshots here after deployment_

---

## 📄 License

MIT License — feel free to use and modify.

---

## 🙋‍♀️ Author

Made by [KaushikiB01](https://github.com/KaushikiB01)
