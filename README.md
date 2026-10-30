# Full Stack Web Development

Welcome to the comprehensive academic coursework repository for **Full Stack Web Development**. This repository houses all laboratory observations, digital records, assignments, the Individual Capstone Project, and the collaborative Group Project developed throughout the curriculum.

---

## 1. Student Details

- **Student Name:** Lokesh Karrothu
- **Roll Number:** `A24126552148`
- **Course / Subject:** Full Stack Web Development
- **GitHub Username:** [lokeshkarrothu148](https://github.com/lokeshkarrothu148)
- **Repository URL:** [https://github.com/lokeshkarrothu148/full-stack-web-development](https://github.com/lokeshkarrothu148/full-stack-web-development)

---

## 2. Repository Overview & Purpose

This repository is maintained as a single consolidated portfolio of practical work, academic evaluations, and project deliverables for Full Stack Web Development:

1. **[Observation Record](Observation/PDFs/A24126552148%20obs.pdf):** Documented lab exercises, code outputs, and viva observations.
2. **[E-Record](E-Record/PDFs/Lab_Record_complete_A24126552148.pdf):** Complete, verified electronic laboratory record.
3. **[Assignment 1](Assignments/Assignment-1/Assignment-1.pdf):** Theory and foundational full-stack problem sets.
4. **[Assignment 2 – Individual Project](Assignments/Assignment-2-Individual-Project/):** **CollegeHub** – A smart campus resource, assignment deadline tracker, and student feedback portal.
5. **[Group Project](Group-Project/):** **CampusConnect** – A full-stack campus event and team registration platform.

---

## 3. Repository Folder Structure

```text
full-stack-web-development/
│
├── README.md                                          # Root repository documentation (this file)
├── .gitignore                                         # Global git exclusions
│
├── Observation/
│   └── PDFs/
│       └── A24126552148 obs.pdf                       # Lab observation record PDF
│
├── E-Record/
│   └── PDFs/
│       └── Lab_Record_complete_A24126552148.pdf       # Complete practical E-Record PDF
│
├── Assignments/
│   ├── Assignment-1/
│   │   └── Assignment-1.pdf                           # Assignment 1 submission PDF
│   │
│   └── Assignment-2-Individual-Project/               # Individual Project: CollegeHub
│       ├── README.md                                  # Individual project guide & API docs
│       ├── package.json                               # Component & tooling manifest
│       ├── vite.config.js                             # Vite build configuration
│       ├── vercel.json                                # Vercel deployment rewrite rules
│       ├── screenshots/                               # Project screenshots & placeholders
│       │   └── .gitkeep
│       └── src/
│           ├── index.html                             # Frontend entry file
│           ├── style.css                              # Custom responsive CSS3 stylesheet
│           ├── App.jsx                                # Root React component & state manager
│           ├── data.json                              # Local data store & seed records
│           └── components/
│               ├── Navbar.jsx                         # Top navigation & role switcher
│               ├── Dashboard.jsx                      # Student dashboard & feedback form
│               ├── Materials.jsx                      # Study notes browser & subject filter
│               ├── Assignments.jsx                    # Coursework deadline tracker
│               ├── Events.jsx                         # Campus events directory
│               ├── AdminPanel.jsx                     # Faculty administrative controls
│               └── AuthModal.jsx                      # Login & registration modal dialog
│
└── Group-Project/                                     # Group Project: CampusConnect
    ├── README.md                                      # Group project documentation
    ├── .gitignore                                     # Server & client ignore rules
    ├── package.json                                   # Root project script runner
    ├── screenshots/                                   # Application screenshots
    │   └── .gitkeep
    ├── client/                                        # Frontend Client (HTML5 / CSS3 / Vanilla JS)
    │   ├── index.html                                 # Single-page client interface
    │   ├── css/
    │   │   └── style.css                              # Responsive styles
    │   └── js/
    │       └── app.js                                 # Dynamic UI rendering & API fetch
    └── server/                                        # Backend REST Server (Node.js / Express)
        ├── server.js                                  # Server entry point & static host
        ├── package.json                               # Backend dependencies
        ├── .env.example                               # Environment template
        ├── models/
        │   └── Event.js                               # Mongoose schema for events
        ├── routes/
        │   └── events.js                              # REST API route handlers (/api/events)
        └── data/
            └── events.json                            # Local persistent JSON data fallback
```

---

## 4. Laboratory Documentation & PDFs

| Category | File Location | Description |
|---|---|---|
| **Observation** | [`Observation/PDFs/A24126552148 obs.pdf`](Observation/PDFs/A24126552148%20obs.pdf) | Signed observation sheet covering laboratory experiments. |
| **E-Record** | [`E-Record/PDFs/Lab_Record_complete_A24126552148.pdf`](E-Record/PDFs/Lab_Record_complete_A24126552148.pdf) | Complete course E-Record with indexed problem statements and solutions. |
| **Assignment 1** | [`Assignments/Assignment-1/Assignment-1.pdf`](Assignments/Assignment-1/Assignment-1.pdf) | Assignment 1 submission document. |

---

## 5. Projects Summary

### A. Assignment-2: Individual Project – CollegeHub
- **Directory:** [`Assignments/Assignment-2-Individual-Project/`](Assignments/Assignment-2-Individual-Project/)
- **Original Source Repo:** [https://github.com/lokeshkarrothu148/full-stack](https://github.com/lokeshkarrothu148/full-stack)
- **Tech Stack:** HTML5, CSS3, JavaScript (React JSX), LocalStorage / Node.js Express.
- **Key Capabilities:**
  - Role-based separation for **Students** and **Administrators**.
  - Dynamic assignment deadline tracker with live remaining-day badges.
  - Searchable study materials catalog with department filtering.
  - Student inquiry and feedback submission form with 1–5 star ratings.
  - Faculty Admin Center for adding/deleting curriculum content and managing notices.

### B. Group Project – CampusConnect
- **Directory:** [`Group-Project/`](Group-Project/)
- **Original Source Repo:** [https://github.com/Rocky132123/full-stack-web-development](https://github.com/Rocky132123/full-stack-web-development)
- **Tech Stack:** HTML5, CSS3, Vanilla JavaScript, Node.js, Express.js, MongoDB (Mongoose) with local JSON storage fallback.
- **Key Capabilities:**
  - Event discovery, keyword search, and category filtering (Technical, Cultural, Sports, Workshop).
  - One-click event registration with dynamic seat countdowns.
  - Organizer portal to create and delete campus events.
  - Hybrid persistence: connects to MongoDB when `MONGODB_URI` is present, or gracefully saves to `data/events.json` offline.

---

## 6. How to Run Projects Locally

### Running Assignment-2 (Individual Project)
```bash
# Navigate to the individual project folder
cd Assignments/Assignment-2-Individual-Project

# Install frontend dependencies
npm install

# Run the local development server (Vite)
npm run dev
```
Open `http://localhost:5173` in your browser.

---

### Running the Group Project (CampusConnect)
```bash
# Navigate to the server folder
cd Group-Project/server

# Install backend dependencies
npm install

# Start the server
npm start
```
Open `http://localhost:5000` in your browser.

---

## 7. Links to Original Repositories

- **Individual Project (CollegeHub):** [https://github.com/lokeshkarrothu148/full-stack](https://github.com/lokeshkarrothu148/full-stack)
- **Group Project (CampusConnect):** [https://github.com/Rocky132123/full-stack-web-development](https://github.com/Rocky132123/full-stack-web-development)
- **Final Coursework Repository:** [https://github.com/lokeshkarrothu148/full-stack-web-development](https://github.com/lokeshkarrothu148/full-stack-web-development)
