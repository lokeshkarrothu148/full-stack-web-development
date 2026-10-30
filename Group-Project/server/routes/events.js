const express = require("express");
const { randomUUID } = require("crypto");
const fs = require("fs/promises");
const path = require("path");
const Event = require("../models/Event");

const router = express.Router();
const dataFile = path.join(__dirname, "..", "data", "events.json");
let useMongo = false;

async function readLocal() {
  try {
    return JSON.parse(await fs.readFile(dataFile, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.mkdir(path.dirname(dataFile), { recursive: true });
      await fs.writeFile(dataFile, "[]", "utf8");
      return [];
    }
    throw error;
  }
}
async function writeLocal(events) {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(events, null, 2), "utf8");
}
function toPlain(doc) {
  return {
    id: String(doc._id),
    title: doc.title,
    category: doc.category,
    date: doc.date,
    time: doc.time,
    location: doc.location,
    description: doc.description || "",
    registrations: doc.registrations || 0,
    createdAt: doc.createdAt
  };
}
router.setStorageMode = (mongoEnabled) => { useMongo = mongoEnabled; };

router.get("/", async (req, res, next) => {
  try {
    if (useMongo) {
      const docs = await Event.find().sort({ date: 1, time: 1 });
      return res.json(docs.map(toPlain));
    }
    const events = await readLocal();
    events.sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
    res.json(events);
  } catch (err) { next(err); }
});

router.post("/", async (req, res, next) => {
  try {
    const { title, category, date, time, location, description = "" } = req.body;
    if (![title, category, date, time, location].every(v => typeof v === "string" && v.trim())) {
      return res.status(400).json({ message: "Please complete title, category, date, time, and location." });
    }
    if (title.length > 100 || location.length > 120 || description.length > 500) {
      return res.status(400).json({ message: "One or more fields are too long." });
    }
    const allowed = ["Workshop", "Competition", "Meetup", "Cultural", "Sports", "Other"];
    if (!allowed.includes(category)) return res.status(400).json({ message: "Choose a valid category." });
    const payload = { title: title.trim(), category, date, time, location: location.trim(), description: description.trim(), registrations: 0 };
    if (useMongo) {
      const doc = await Event.create(payload);
      return res.status(201).json(toPlain(doc));
    }
    const events = await readLocal();
    const event = { id: randomUUID(), ...payload, createdAt: new Date().toISOString() };
    events.push(event);
    await writeLocal(events);
    res.status(201).json(event);
  } catch (err) { next(err); }
});

router.patch("/:id/register", async (req, res, next) => {
  try {
    if (useMongo) {
      const doc = await Event.findById(req.params.id);
      if (!doc) return res.status(404).json({ message: "Event not found." });
      doc.registrations = Math.max(0, doc.registrations + (req.body.register ? 1 : -1));
      await doc.save();
      return res.json(toPlain(doc));
    }
    const events = await readLocal();
    const event = events.find(e => e.id === req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found." });
    event.registrations = Math.max(0, (event.registrations || 0) + (req.body.register ? 1 : -1));
    await writeLocal(events);
    res.json(event);
  } catch (err) { next(err); }
});

router.delete("/:id", async (req, res, next) => {
  try {
    if (useMongo) {
      const doc = await Event.findByIdAndDelete(req.params.id);
      if (!doc) return res.status(404).json({ message: "Event not found." });
      return res.json({ message: "Event deleted." });
    }
    const events = await readLocal();
    const remaining = events.filter(e => e.id !== req.params.id);
    if (remaining.length === events.length) return res.status(404).json({ message: "Event not found." });
    await writeLocal(remaining);
    res.json({ message: "Event deleted." });
  } catch (err) { next(err); }
});

module.exports = router;
