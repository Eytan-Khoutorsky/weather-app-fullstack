import { useState } from "react";

function DayForecast({ dayData }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginBottom: "10px" }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          cursor: "pointer",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "10px",
        }}
      >
        <strong>{dayData.day}</strong> — {dayData.temp}°C
      </div>

      {open && (
        <div style={{ marginTop: "5px", paddingLeft: "10px" }}>
          {dayData.details.map((item, index) => (
            <div key={index}>
              <div>{item.time}</div>
              {item.temp}°C | {item.rainChance}%
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DayForecast;
