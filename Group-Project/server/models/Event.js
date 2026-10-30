const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  category: { type: String, required: true, enum: ["Workshop", "Competition", "Meetup", "Cultural", "Sports", "Other"] },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, default: "", maxlength: 500 },
  registrations: { type: Number, default: 0, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
