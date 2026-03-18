import DayForecast from "./DayForecast";

function ForecastList({ forecast }) {
  console.log(forecast);

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        marginTop: "20px",
        overflowX: "auto",
        justifyContent: "center",
      }}
    >
      {" "}
      {forecast.map((day, index) => (
        <DayForecast key={index} dayData={day} />
      ))}
    </div>
  );
}

export default ForecastList;
