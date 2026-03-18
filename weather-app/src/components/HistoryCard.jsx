import { useState } from "react";

function HistoryCard({ location, startDate, endDate, data }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginBottom: "15px" }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          cursor: "pointer",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "10px",
        }}
      >
        <strong>{location}</strong> ({startDate} → {endDate})
      </div>

      {open && (
        <div style={{ marginTop: "5px", paddingLeft: "10px" }}>
          {data.map((item, i) => {
            const date = new Date(item.date);

            return (
              <div key={i}>
                {date.toLocaleDateString("en-US", { weekday: "short" })}{" "}
                {date.toLocaleTimeString([], { hour: "numeric" })} →{" "}
                {Math.round(item.temp)}°C | 🌧 {item.rainChance}%
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default HistoryCard;
