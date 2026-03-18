import { useEffect } from "react";

export default function useBackground(weather) {
  useEffect(() => {
    if (!weather) return; // 👈 DO NOTHING if no weather

    const desc = weather.description.toLowerCase();

    if (desc.includes("rain")) {
      document.body.style.background =
        "linear-gradient(to bottom, #2c3e50, #4ca1af)";
    } else if (desc.includes("cloud")) {
      document.body.style.background =
        "linear-gradient(to bottom, #bdc3c7, #2c3e50)";
    } else if (desc.includes("clear")) {
      document.body.style.background =
        "linear-gradient(to bottom, #fceabb, #f8b500)";
    } else {
      document.body.style.background =
        "linear-gradient(to bottom, #4facfe, #00f2fe)";
    }

    return () => {
      document.body.style.background = ""; //  CLEANUP
    };
  }, [weather]);
}
