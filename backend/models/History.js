import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const History = sequelize.define("History", {
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  forecast: {
    type: DataTypes.JSON, //  THIS is the key
    allowNull: false,
  },
});

export default History;
