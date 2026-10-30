require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const eventRoutes = require("./routes/events");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Serve static frontend assets from client/ or fallback to frontend/
const clientPath = fs.existsSync(path.join(__dirname, "..", "client"))
  ? path.join(__dirname, "..", "client")
  : path.join(__dirname, "..", "frontend");
app.use(express.static(clientPath));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", storage: eventRoutes.storageMode || "json-file" });
});
app.use("/api/events", eventRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong on the server." });
});

async function start() {
  let mongoEnabled = false;
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 2500 });
      mongoEnabled = true;
      console.log("MongoDB connected.");
    } catch (error) {
      console.warn("MongoDB unavailable; using JSON-file storage.");
    }
  } else {
    console.log("MONGODB_URI not set; using JSON-file storage.");
  }
  eventRoutes.setStorageMode(mongoEnabled);
  app.get("/api/health", (req, res) => res.json({ status: "ok", storage: mongoEnabled ? "mongodb" : "json-file" }));
  app.listen(PORT, () => console.log(`CampusConnect running at http://localhost:${PORT}`));
}
start();
