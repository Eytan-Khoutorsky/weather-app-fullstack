import { useState } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import useBackground from "./hooks/useBackground";
import ForecastList from "./components/ForecastList";
import { useNavigate } from "react-router-dom";

function App() {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [firstDayLabel, setFirstDayLabel] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!location) {
      setError("Enter a city");
      return;
    }

    // validate dates ONLY if user entered them
    if (startDate && endDate) {
      const start = new Date(startDate + "T00:00:00");
      const end = new Date(endDate + "T00:00:00");

      // end before start
      if (end < start) {
        setError("End date must be after start date");
        return;
      }

      // today (midnight)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // max allowed date = today + 5 days
      const maxDate = new Date(today);
      maxDate.setDate(maxDate.getDate() + 5);

      // outside allowed range
      if (start < today || end > maxDate) {
        setError("Dates must be within the next 5 days");
        return;
      }
    }

    try {
      setLoading(true);
      setError("");

      const bodyData = { location };

      if (startDate && endDate) {
        bodyData.startDate = startDate;
        bodyData.endDate = endDate;
      }

      const res = await fetch("http://localhost:3000/weather", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Request failed");
      }
      const data = await res.json();
      await fetch("http://localhost:3000/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city: data.location,
          temp: data.temperatureData?.[0]?.temp
            ? Math.round(data.temperatureData[0].temp)
            : null,
          description: data.description || "N/A",
          date: new Date(),
        }),
      });

      const parsed =
        typeof data.temperatureData === "string"
          ? JSON.parse(data.temperatureData)
          : data.temperatureData;
      const firstDate = parsed?.[0]?.date;
      const firstDay = firstDate
        ? new Date(firstDate).toLocaleDateString("en-US", { weekday: "long" })
        : "";
      setFirstDayLabel(firstDay);

      const grouped = {};

      parsed.forEach((item) => {
        const date = new Date(item.date);
        const day = date.toLocaleDateString("en-US", { weekday: "short" });

        if (!grouped[day]) grouped[day] = [];

        grouped[day].push({
          time: date.toLocaleTimeString([], { hour: "numeric" }),
          temp: Math.round(item.temp),
          rainChance: item.rainChance || 0,
          icon: item.icon,
        });
      });

      const forecastData = Object.entries(grouped).map(([day, items]) => ({
        day,
        temp: items[0].temp,
        details: items,
      }));

      setForecast(forecastData);
      setWeather({
        city: data.location,
        temp: data.temperatureData?.[0]?.temp
          ? Math.round(data.temperatureData[0].temp)
          : 0,
        description: data.description,
        humidity: data.humidity,
        wind: data.wind,
        icon: data.icon,
      });
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  useBackground(weather);

  return (
    <div className="app">
      {" "}
      <button onClick={() => navigate("/history")}>Go to History</button>
      <h1>Weather</h1>
      <SearchBar
        location={location}
        setLocation={setLocation}
        onSearch={handleSearch}
      />
      <p style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
        ⚠️ Date range must be within the next 5 days
      </p>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {weather && <WeatherCard weather={weather} firstDay={firstDayLabel} />}
      {forecast.length > 0 && <ForecastList forecast={forecast} />}
    </div>
  );
}

export default App;
