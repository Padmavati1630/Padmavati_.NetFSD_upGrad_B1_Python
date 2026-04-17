# 📘 E-Learning Platform – Full Stack Project

## Overview

This project is a **full-stack E-Learning Platform** 
It extends a previously built frontend-only application into a dynamic, data-driven system using:

* **ASP.NET Core 8**
* **C#**
* **SQLite (via Entity Framework Core)**

The platform now supports real-time data handling, backend integration, and persistent storage.

---

## Project Structure

```
E-Learning-Platform-FullStack/
│
├── Frontend/   → HTML, CSS, Bootstrap, JavaScript
├── Backend/    → ASP.NET Core Web API
└── README.md
```

---

##   Features

### Frontend

* Multi-page responsive UI
* Course navigation and listing
* Quiz interface and interaction
* User login system
* Local storage for session handling

---

### Backend

* RESTful API architecture
* Course & Lesson management
* Quiz & Question handling
* User registration & authentication
* Result tracking and scoring system

---

##  Frontend ↔ Backend Integration

The frontend communicates with backend APIs using HTTP requests:

```
http://localhost:5174/api/
```

### Example Operations:

* Fetch available courses
* Submit quiz answers
* Retrieve user results

> Note: Backend runs on port **5174** (custom configuration)

---

## Database

* **SQLite** used for development (as permitted)
* **Entity Framework Core (Code-First approach)**
* Database file: `elearning.db`

> SQL queries (JOIN, GROUP BY, etc.) are provided separately in the backend folder.

---

## Authentication & Security

* User registration API implemented
* Passwords stored securely using hashing (e.g., BCrypt)
* Input validation using ModelState
* DTOs used to prevent direct entity exposure

---

## How to Run the Project

### Step 1: Run Backend

1. Open Backend solution in Visual Studio
2. Configure database in `appsettings.json`
3. Run migrations:

   ```
   Update-Database
   ```
4. Start the server:

   ```
   dotnet run
   ```

Backend will run at:

```
http://localhost:5174
```

---

### Step 2: Run Frontend

1. Open the `Frontend` folder
2. Run using Live Server OR open:

   ```
   login.html
   ```

---

## Key Functional Modules

* Dashboard Module
* Courses Module
* Lessons Module
* Quiz Module
* Profile Module
* API Integration Layer

---

## Testing

* Course CRUD operations tested
* Quiz scoring logic validated
* API response handling verified
* Exception handling implemented for invalid cases

---

## Notes

* Backend must be running before accessing frontend features
* Ensure API base URL matches backend port (`5174`)
* Frontend was initially developed separately and later integrated with backend

---

## Improvements Made

* Converted static frontend into full-stack application
* Integrated backend APIs with frontend UI
* Implemented persistent data storage
* Improved application structure using layered architecture

---

