# Group Project – CampusConnect

**CampusConnect** is a student-centric campus event and team management web application. It allows students to discover, search, filter, register for, and publish college events, workshops, and technical competitions.

- **Course:** Full Stack Web Development
- **Student Name:** Lokesh Karrothu (Roll No: A24126552148)
- **Original Group Project Repository:** [https://github.com/Rocky132123/full-stack-web-development](https://github.com/Rocky132123/full-stack-web-development)

---

## 1. Project Overview

CampusConnect bridges the communication gap between student clubs, event organizers, and the campus community. It offers a centralized dashboard to track upcoming academic symposiums, coding hackathons, cultural festivals, and sports tournaments with real-time participant registration counts.

### Key Objectives:
- Provide an intuitive platform for students to browse and sign up for campus activities.
- Enable campus clubs and event managers to publish, update, and manage event schedules.
- Provide a hybrid storage architecture: works out-of-the-box using local JSON file storage (`data/events.json`) and automatically upgrades to MongoDB when a connection string (`MONGODB_URI`) is supplied.

---

## 2. Technologies Used

| Layer | Technology | Description |
|---|---|---|
| **Frontend (`client/`)** | HTML5, CSS3, Vanilla JavaScript | Responsive user interface, dynamic DOM updates, event search and category filtering |
| **Backend (`server/`)** | Node.js, Express.js | Modular REST API routing, static file hosting, validation middleware |
| **Database** | MongoDB (Mongoose ODM) | Schema-based document storage with graceful fallback to `events.json` |
| **Utilities** | `dotenv`, `cors`, `nodemon` | Environment variable management and development tooling |

---

## 3. Directory Structure

```text
Group-Project/
├── README.md
├── .gitignore
├── screenshots/
│   └── .gitkeep
├── client/
│   ├── index.html          # Main application interface
│   ├── css/
│   │   └── style.css       # Responsive stylesheet
│   └── js/
│       └── app.js          # Client-side API interactions and rendering
└── server/
    ├── server.js           # Express application server
    ├── package.json        # Server dependencies and start scripts
    ├── .env.example        # Environment variable template
    ├── models/
    │   └── Event.js        # Mongoose event schema
    ├── routes/
    │   └── events.js       # CRUD API endpoints (/api/events)
    └── data/
        └── events.json     # Local persistent JSON data storage fallback
```

---

## 4. Key Features

1. **Event Discovery & Filtering:**
   - Filter campus events by category (Technical, Cultural, Sports, Workshop, Academic).
   - Live search by event title, location, or description.
2. **Event Registration:**
   - One-click registration and cancellation.
   - Dynamic attendee counter tracking open seats.
3. **Event Creation & Management:**
   - Add new events with date, time, venue, description, and category.
   - Delete concluded or cancelled events.
4. **Dashboard Analytics:**
   - Live counters displaying total events, active registrations, and upcoming activities.
5. **Hybrid Database Fallback:**
   - If MongoDB is available, records persist in cloud/local MongoDB collections.
   - If MongoDB is not configured, the server automatically saves to `server/data/events.json` without failing.

---

## 5. How to Run the Project Locally

### Prerequisites
- Node.js (v18 or higher)
- npm (Node Package Manager)

### Step 1: Navigate to the Server Folder
```bash
cd Group-Project/server
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: (Optional) Configure MongoDB
To use MongoDB, copy `.env.example` to `.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/campusconnect?retryWrites=true&w=majority
```
*(If omitted, CampusConnect automatically uses `server/data/events.json` storage).*

### Step 4: Start the Server
```bash
npm start
```
You will see:
```text
CampusConnect running at http://localhost:5000
```

### Step 5: Open in Your Browser
Open:
```
http://localhost:5000
```

---

## 6. API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check and current storage mode (`mongodb` or `json-file`) |
| `GET` | `/api/events` | List all campus events |
| `POST` | `/api/events` | Create a new campus event |
| `POST` | `/api/events/:id/register` | Register/unregister attendee |
| `DELETE` | `/api/events/:id` | Delete an event |

---

## 7. Original Group Project Source
- **Repository:** [https://github.com/Rocky132123/full-stack-web-development](https://github.com/Rocky132123/full-stack-web-development)
