function WeatherCard({ weather, firstDay }) {
  return (
    <div className="card">
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(weather.city)}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <h2>{weather.city} 📍</h2>
      </a>{" "}
      <p>{firstDay}</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
        alt="weather icon"
      />
      <h1 style={{ fontSize: "48px" }}>{weather.temp}°C</h1>
      <p>{weather.description}</p>
      <div className="stats">
        <div>
          <p>Humidity</p>
          <strong>{weather.humidity}%</strong>
        </div>
        <div>
          <p>Wind</p>
          <strong>{weather.wind} m/s</strong>
        </div>
      </div>
    </div>
  );
}
export default WeatherCard;
