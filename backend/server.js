import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./db.js";
import WeatherRequest from "./models/WeatherRequest.js";
import History from "./models/History.js";
dotenv.config();

sequelize.sync().then(() => {
  console.log("Database synced");
});

const app = express();

app.use(cors());
app.use(express.json());
app.get("/weather", async (req, res) => {
  try {
    const data = await WeatherRequest.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/weather/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { location, startDate, endDate } = req.body;

    const record = await WeatherRequest.findByPk(id);
    if (!record) return res.status(404).json({ error: "Not found" });

    record.location = location || record.location;
    record.startDate = startDate || record.startDate;
    record.endDate = endDate || record.endDate;

    await record.save();

    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/weather/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const record = await WeatherRequest.findByPk(id);
    if (!record) return res.status(404).json({ error: "Not found" });

    await record.destroy();

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/weather/export/csv", async (req, res) => {
  try {
    const data = await WeatherRequest.findAll();

    const csv = [
      "id,location,startDate,endDate",
      ...data.map((d) => `${d.id},${d.location},${d.startDate},${d.endDate}`),
    ].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/weather", async (req, res) => {
  try {
    const { location, startDate, endDate } = req.body;

    if (!location) {
      return res.status(400).json({ error: "Missing location" });
    }

    let start, end;

    if (!startDate || !endDate) {
      // default: today → +5 days
      start = new Date();
      start.setHours(0, 0, 0, 0);

      end = new Date(start);
      end.setDate(end.getDate() + 5);
    } else {
      start = new Date(startDate);
      end = new Date(endDate);

      if (isNaN(start) || isNaN(end)) {
        return res.status(400).json({ error: "Invalid date format" });
      }

      if (start > end) {
        return res.status(400).json({ error: "Invalid date range" });
      }
    }

    const API_KEY = process.env.API_KEY;

    const apiRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}&units=metric`,
    );

    if (!apiRes.ok) {
      return res.status(400).json({ error: "Invalid location" });
    }

    const data = await apiRes.json();

    const current = data.list[0];

    const temperatureData = data.list.map((item) => {
      const dateObj = new Date(item.dt_txt);

      return {
        date: item.dt_txt,
        day: dateObj.toLocaleDateString("en-US", { weekday: "short" }),
        time: dateObj.toLocaleTimeString([], { hour: "numeric" }),
        temp: item.main.temp,
        weather: item.weather[0].description,
        icon: item.weather[0].icon,
        rainChance: Math.round(item.pop * 100),
      };
    });
    const startStr = start.toISOString().split("T")[0];
    const endStr = end.toISOString().split("T")[0];

    const filtered = temperatureData.filter((item) => {
      const itemDate = item.date.split(" ")[0]; // "YYYY-MM-DD"
      return itemDate >= startStr && itemDate <= endStr;
    });
    await History.create({
      city: location,
      forecast: filtered, //  THIS is the key
    });
    await WeatherRequest.create({
      location,
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
      temperatureData: JSON.stringify(filtered),
    });

    res.status(201).json({
      location,
      description: current.weather[0].description,
      humidity: current.main.humidity,
      wind: current.wind.speed,
      icon: current.weather[0].icon,
      temperatureData: filtered,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/", (req, res) => {
  res.send("API running");
});

app.get("/history", async (req, res) => {
  try {
    const data = await History.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/history/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { city } = req.body;

    if (!city) {
      return res.status(400).json({ error: "City is required" });
    }

    const record = await History.findByPk(id);
    if (!record) {
      return res.status(404).json({ error: "Not found" });
    }

    // validate location via API
    const API_KEY = process.env.API_KEY;

    const apiRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`,
    );

    if (!apiRes.ok) {
      return res.status(400).json({ error: "Invalid location" });
    }

    const data = await apiRes.json();

    const forecast = data.list.map((item) => ({
      date: item.dt_txt,
      temp: item.main.temp,
      rainChance: Math.round(item.pop * 100),
    }));

    // update
    record.city = city;
    record.forecast = forecast;

    await record.save();

    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/history/:id", async (req, res) => {
  const { id } = req.params;

  const record = await History.findByPk(id);
  if (!record) return res.status(404).json({ error: "Not found" });

  await record.destroy();

  res.json({ message: "Deleted" });
});
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
