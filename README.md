# AuraLMS - Learning Dashboard Web Application

A premium, full-stack Learning Management System (LMS) dashboard containing a React.js client, Express.js backend, and MongoDB storage.

---

## 🌟 Tech Stack & Features
- **Frontend**: React.js (Vite template), Tailwind CSS, Lucide React, Axios, React Router.
- **Backend**: Node.js + Express.js (REST API, Modular Routing, ES Modules).
- **Database**: MongoDB Atlas (Object Modeling via Mongoose).
- **Auth**: Secure JSON Web Tokens (JWT) stored in HTTP-Only Cookies.
- **Deployment Ready**: Fully configured for Vercel (frontend) and Railway (backend).
- **Design Aesthetic**: Gorgeous slate/indigo dark theme, responsive grid cards, interactive SVG progress meters, custom scrollbars, and micro-interaction animations.

---

## 📂 Project Structure
```text
/learning-dashboard
├── /client             # Vite + React Frontend
│   ├── /src
│   │   ├── /components  # Navbar, ProtectedRoute
│   │   ├── /context     # AuthContext (JWT State & Session Checks)
│   │   ├── /pages       # Login, Register, Dashboard, CourseDetail, AdminPanel
│   │   ├── App.jsx      # Root routing container
│   │   ├── index.css    # Tailwind bases + glassmorphism themes
│   │   └── main.jsx     # Mounting node wrapped in BrowserRouter
│   ├── .env.example     # Client environment variable template
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vercel.json      # Client routing redirection rules
├── /server             # Node + Express Backend
│   ├── /config          # Database connector (Mongoose)
│   ├── /middleware      # protect, admin
│   ├── /models          # User, Course, Enrollment schemas
│   ├── /routes          # auth, course, enroll, progress, admin routes
│   ├── /scripts         # seed.js (database population script)
│   ├── .env.example     # Server environment variable template
│   ├── Procfile         # Railway/Heroku application launch descriptor
│   ├── railway.toml     # Railway Nixpacks deployment configuration
│   └── server.js        # Server bootstrap entry point
└── README.md
```

---

## 🔑 Demo Credentials
The seeding script populates these demo accounts:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Student** | `student@demo.com` | `Student@123` |
| **Admin** | `admin@demo.com` | `Admin@123` |

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js (v18+)
- MongoDB running locally OR a MongoDB Atlas cloud URI.

### Step 1: Clone & Setup Backend
1. Go to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup environment variables:
   Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
   Add your MongoDB connection string (falls back to local `mongodb://127.0.0.1:27017/learning_dashboard` if empty).

4. Run the database seed script:
   ```bash
   npm run seed
   ```
   *This clears existing tables and populates the database with 2 courses, 1 admin, 1 student, and 1 student enrollment.*

5. Launch the backend server:
   ```bash
   npm run dev
   ```
   *The server runs on [http://localhost:5000](http://localhost:5000).*

### Step 2: Setup Frontend
1. Go to the `client` directory:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup environment variables:
   ```bash
   cp .env.example .env
   ```
   Make sure `VITE_API_URL` points to your backend (`http://localhost:5000`).

4. Launch Vite development server:
   ```bash
   npm run dev
   ```
   *The client dashboard opens on [http://localhost:5173](http://localhost:5173).*

---

## 🔌 API Endpoints Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create user. Sets HTTP-only `token` cookie.
- `POST /api/auth/login` - Verify password. Sets HTTP-only `token` cookie.
- `POST /api/auth/logout` - Invalidate session & clear cookie.
- `GET /api/auth/me` - Fetch details of logged-in user profile (Requires authentication).

### Courses (`/api/courses`)
- `GET /api/courses` - Retrieve list of all courses (Public).
- `GET /api/courses/:id` - Fetch single course curriculum structure.
- `POST /api/courses` - Create new course (Requires Admin role).
- `PUT /api/courses/:id` - Edit course details & syllabus (Requires Admin role).
- `DELETE /api/courses/:id` - Delete course (Requires Admin role).

### Enrollment & Progress (`/api/enroll` & `/api/progress`)
- `POST /api/enroll/:courseId` - Register student user for course (Requires Student role).
- `GET /api/progress/:courseId` - Retrieve student's completion state (Requires Student role).
- `PUT /api/progress/:courseId` - Toggle completion checkbox for a lesson title, auto-recalculating progress % (Requires Student role).

### Admin Tools (`/api/admin`)
- `GET /api/admin/students` - Returns student users array alongside their enrolled courses and progress metrics (Requires Admin role).

---

## 🚀 Deployment Configs

### Backend (Railway)
The backend is equipped with Nixpacks configurations (`railway.toml`) and standard `Procfile` declarations to build & run `npm start` out-of-the-box. Ensure you define:
- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL` (Points to your Vercel deployment URL)
- `NODE_ENV=production`

### Frontend (Vercel)
The client includes `vercel.json` rewrite overrides to route all SPA requests cleanly back to Vite's root index. Ensure you configure:
- `VITE_API_URL` (Points to your Railway server URL)
- CORS origin handles headers dynamically on backend.
