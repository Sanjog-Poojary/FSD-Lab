require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Event = require("./models/Event");

async function seedEvents() {
  try {
    await connectDB();

    const filePath = path.join(__dirname, "../events.json");
    if (!fs.existsSync(filePath)) {
      console.error("events.json not found at:", filePath);
      process.exit(1);
    }

    const rawData = fs.readFileSync(filePath, "utf-8");
    const eventsData = JSON.parse(rawData);

    // Clear existing events and insert fresh documents from events.json
    await Event.deleteMany({});
    console.log("Cleared existing events in MongoDB.");

    const insertedEvents = await Event.insertMany(eventsData);
    console.log(`Successfully seeded ${insertedEvents.length} events into MongoDB:`);
    insertedEvents.forEach((ev) => {
      console.log(`- [${ev._id}] ${ev.title} (${ev.location})`);
    });

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
}

seedEvents();
