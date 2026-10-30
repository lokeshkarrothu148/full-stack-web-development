# Assignment 2 – Individual Project
## CollegeHub: Smart College Management System

- **Course:** Full Stack Web Development
- **Student Name:** Lokesh Karrothu
- **Roll Number:** A24126552148
- **Original Individual Project Repository:** [https://github.com/lokeshkarrothu148/full-stack](https://github.com/lokeshkarrothu148/full-stack)
- **Live Deployment URL:** [https://collegehub-api.onrender.com](https://collegehub-api.onrender.com) (Render Web Service) / [https://assignment-2-collegehub.vercel.app](https://assignment-2-collegehub.vercel.app) (Vercel)

---

## 1. Project Overview & Objective

**CollegeHub** is a responsive, feature-rich web platform designed to solve the problem of fragmented academic communication in colleges and universities. It establishes a centralized portal where students can browse lecture notes/PDFs, monitor upcoming coursework deadlines with live countdown indicators, stay informed on urgent notices, explore campus events, and submit direct feedback to college authorities.

### Key Objectives:
- Provide an integrated platform for students and faculty to access academic materials without relying on disjointed social media groups.
- Deliver dynamic deadline calculation to reduce overdue homework submissions.
- Provide a secure Administrator Control Center with role-based access control (RBAC).
- Provide both a pure React frontend architecture (`src/` with `App.jsx`, `components/`, and `data.json`) and a production-ready Node.js/Express/MySQL full-stack implementation.

---

## 2. Directory Structure

```text
Assignments/Assignment-2-Individual-Project/
├── README.md                           # Individual project documentation
├── package.json                        # Frontend & script dependencies
├── vercel.json                         # Vercel deployment configuration
├── screenshots/
│   ├── README.md                       # Screenshots guide
│   └── .gitkeep                        # Git placeholder
└── src/
    ├── index.html                      # HTML5 root mount
    ├── style.css                       # Responsive CSS3 stylesheet (Blue-White Theme)
    ├── App.jsx                         # Main React application component & state router
    ├── data.json                       # Seed database & mock data store
    └── components/
        ├── Navbar.jsx                  # Navigation bar with role badge & auth triggers
        ├── Dashboard.jsx               # Student dashboard with profile, notices & feedback
        ├── Materials.jsx               # Study notes catalog with search & subject filter
        ├── Assignments.jsx             # Coursework tracker with dynamic deadline tags
        ├── Events.jsx                  # Upcoming college events & venue directory
        ├── AdminPanel.jsx              # Administrator dashboard with statistics & CRUD
        └── AuthModal.jsx               # Student/Admin login & registration modal
```

---

## 3. Technologies Used

| Component | Technology | Description |
|---|---|---|
| **Frontend Structure** | HTML5 | Semantic markup and root mounting |
| **Frontend Styling** | CSS3 (Pure) | Custom responsive blue-white theme, CSS variables, card hover effects (No frameworks) |
| **Client-Side Framework**| React (JSX) | Functional components, state hooks (`useState`, `useEffect`), localStorage persistence |
| **Data Store** | JSON / LocalStorage | `src/data.json` for initial state with two-way sync to browser LocalStorage |
| **Full-Stack Companion** | Node.js, Express.js, MySQL | Complete backend REST APIs with parameterized queries and bcrypt authentication |

---

## 4. Key Modules & Features

1. **Role-Based Authentication:**
   - Dedicated views for Students and Administrators.
   - Built-in demo credentials buttons for quick evaluator verification.
2. **Student Dashboard:**
   - Personalized greeting, student name, academic branch, and roll identifier.
   - Quick navigation cards to Materials, Assignments, and Events.
   - Recent announcements feed and feedback submission form.
3. **Academic Study Materials:**
   - Real-time keyword search and subject filtering (CSE, IT, ECE, ME).
   - Direct button to open or download reference PDFs.
4. **Assignments & Deadline Countdown:**
   - Chronologically sorted coursework tasks.
   - Status indicators: **Due in X Days** (Green), **Due Soon** (Warning), **Deadline Passed** (Red).
5. **Campus Events & Symposiums:**
   - Schedule of technical hackathons, guest lectures, and cultural fests with venue information.
6. **Administrator Control Center:**
   - Real-time analytics counters for students, materials, assignments, notices, events, and feedback.
   - Tabbed CRUD forms to publish and delete study materials, notices, assignments, and events.
   - Feedback review table displaying student name, department, rating, and status toggle.

---

## 5. Demo Test Credentials

| Role | Email | Password | Access Privileges |
|---|---|---|---|
| **Administrator** | `admin@collegehub.com` | `admin123` | Full access to Admin Center and management forms |
| **Student** | `rahul.sharma@collegehub.com` | `student123` | Access to Student Portal and resources |
| **Student (Author)** | `lokeshkarrothu148@collegehub.com` | `student123` | Student access |

---

## 6. How to Run Locally

### Option A: Using Vite (React)
```bash
cd Assignments/Assignment-2-Individual-Project
npm install
npm run dev
```

### Option B: Running the Full-Stack Express Server
```bash
npm install
npm start
```
Then open `http://localhost:3000` in your web browser.

---

## 7. Original Individual Project Source
- **Repository:** [https://github.com/lokeshkarrothu148/full-stack](https://github.com/lokeshkarrothu148/full-stack)
