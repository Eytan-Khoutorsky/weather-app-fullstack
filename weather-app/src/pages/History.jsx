import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function groupByDay(forecast) {
  const grouped = {};

  forecast.forEach((f) => {
    const day = f.date.split(" ")[0];
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(f);
  });

  return grouped;
}

function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const copyToClipboard = () => {
    const json = JSON.stringify(history, null, 2);

    navigator.clipboard.writeText(json);
    alert("Copied JSON to clipboard");
  };

  useEffect(() => {
    fetch("http://localhost:3000/history")
      .then((res) => res.json())
      .then((data) => setHistory(data));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate("/")}>← Back</button>
      <h1>History</h1>
      <button
        onClick={copyToClipboard}
        style={{
          marginBottom: "15px",
          padding: "10px",
          borderRadius: "8px",
          border: "none",
          background: "#4caf50",
          color: "white",
          cursor: "pointer",
        }}
      >
        Copy JSON
      </button>

      {history.map((item, index) => {
        const grouped = groupByDay(item.forecast || {});
        const days = Object.keys(grouped);

        return (
          <div key={index} style={{ marginTop: "15px" }}>
            {/* LEVEL 1 */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  background: "#eee",
                  fontWeight: "bold",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                {item.city} | {days[0]} → {days[days.length - 1]}
              </button>

              {/* EDIT */}
              <button
                onClick={async () => {
                  const newCity = prompt("New city:");
                  if (!newCity) return;

                  await fetch(`http://localhost:3000/history/${item.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ city: newCity }),
                  });

                  window.location.reload();
                }}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#ddd",
                  cursor: "pointer",
                }}
              >
                ✏️
              </button>

              {/* DELETE */}
              <button
                onClick={async () => {
                  const confirmDelete = window.confirm("Delete this entry?");
                  if (!confirmDelete) return;

                  await fetch(`http://localhost:3000/history/${item.id}`, {
                    method: "DELETE",
                  });

                  window.location.reload();
                }}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#ff6b6b",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                🗑
              </button>
            </div>

            {/* LEVEL 2 */}
            {openIndex === index && (
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                {days.map((day) => {
                  const avgTemp =
                    grouped[day].reduce((a, b) => a + b.temp, 0) /
                    grouped[day].length;

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      style={{
                        padding: "10px",
                        borderRadius: "10px",
                        background: "#f5b700",
                        border: "none",
                        cursor: "pointer",
                        minWidth: "80px",
                      }}
                    >
                      <div>
                        {new Date(day).toLocaleDateString("en-US", {
                          weekday: "short",
                        })}
                      </div>
                      <div>{Math.round(avgTemp)}°C</div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* LEVEL 3 */}
            {openIndex === index && selectedDay && (
              <div style={{ marginTop: "10px" }}>
                {grouped[selectedDay].map((f, i) => (
                  <div key={i}>
                    {new Date(f.date).toLocaleTimeString([], {
                      hour: "numeric",
                    })}{" "}
                    — {f.temp}°C | {f.rainChance}%
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default History;
