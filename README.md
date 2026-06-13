# Workly Frontend 🚀

A React-based frontend for Workly, a MERN Stack job marketplace that connects clients and workers through skill-based and area-based matching.

---

## 📌 Overview

Workly Frontend provides a modern user interface for clients and workers to interact with the platform.

Users can register, log in, create worker profiles, browse jobs, manage assigned work, receive notifications, and track job progress through an intuitive React-based interface.

---

## ✨ Features

### 🔐 Authentication

* User Registration
* User Login
* JWT-Based Authentication
* Protected Routes
* Authentication Context API

### 👷 Worker Features

* Complete Worker Profile
* Update Skills & Experience
* Set Hourly Rate
* Browse Open Jobs
* View Assigned Jobs
* Track Job Progress

### 🧑‍💼 Client Features

* Create Jobs
* View Posted Jobs
* Manage Active Jobs
* Track Job Status
* Hire Workers
* Rate Workers

### 🎯 Smart Matching

* Skill-Based Matching
* Area-Based Matching
* Match Percentage Display
* Worker Ranking

### 🔔 Notifications

* Notification Dashboard
* Real-Time Notification Support

### 🎨 UI Features

* Responsive Design
* Navigation Bar
* Bottom Navigation
* Status Badges
* Match Badges
* Reusable UI Components
* Loading Skeletons
* Modals
* Empty State Screens

---

## 🏗️ Frontend Architecture

```text
React Application
        │
        ▼
Pages
        │
        ▼
Components
        │
        ▼
Auth Context
        │
        ▼
Backend REST APIs
```

---

## 📄 Pages

### Home

Landing page for users.

### Register

Create a new account.

### Login

Authenticate users securely.

### Dashboard

Main application dashboard.

### Complete Profile

Worker onboarding and profile setup.

### Create Job

Clients can create new jobs.

### Open Jobs

Browse available job opportunities.

### My Client Jobs

Manage jobs posted by clients.

### My Worker Jobs

Manage jobs assigned to workers.

### Notifications

View platform notifications.

---

## 🧩 Components

### Core Components

* NavBar
* BottomNav
* GuardRoute
* MatchBadge
* StatusBadge

### UI Components

* Button
* Card
* Badge
* Modal
* Spinner
* EmptyState
* SkeletonCard

---

## 🔐 Authentication Flow

1. User logs in.
2. Backend returns a JWT token.
3. Token is stored on the frontend.
4. AuthContext manages authentication state.
5. GuardRoute protects private routes.
6. Authenticated requests include JWT token.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* JavaScript
* Context API
* React Router
* Tailwind CSS

### Communication

* REST APIs
* JWT Authentication

---

## 📂 Project Structure

```text
src
│
├── assets
│
├── components
│   ├── BottomNav.jsx
│   ├── Guardroute.jsx
│   ├── MatchBadge.jsx
│   ├── NavBar.jsx
│   ├── StatusBadge.jsx
│   │
│   └── ui
│       ├── Badge.jsx
│       ├── Button.jsx
│       ├── Card.jsx
│       ├── EmptyState.jsx
│       ├── Modal.jsx
│       ├── SkeletonCard.jsx
│       └── Spinner.jsx
│
├── context
│   ├── AuthContext.jsx
│   └── AuthProvider.jsx
│
├── pages
│   ├── CompleteProfile.jsx
│   ├── CreateJob.jsx
│   ├── Dashboard.jsx
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── MyClientJobs.jsx
│   ├── MyWorkerJobs.jsx
│   ├── Notifications.jsx
│   ├── OpenJobs.jsx
│   └── Register.jsx
│
├── socket.js
├── App.jsx
├── main.jsx
└── index.css
```

---

## 🚀 Installation

```bash
git clone <repository-url>

cd workly-frontend

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## 🔮 Future Improvements

* Real-Time Chat
* Push Notifications
* Dark Mode
* Advanced Search Filters
* Progressive Web App Support
* AI-Based Worker Recommendations

---

## 👨‍💻 Author

**Abhishek Gaur**

MERN Stack Developer | DSA Enthusiast | Problem Solver
