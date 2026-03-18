import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const WeatherRequest = sequelize.define("WeatherRequest", {
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  temperatureData: {
    type: DataTypes.TEXT, // store JSON as string
    allowNull: false,
  },
});

export default WeatherRequest;
