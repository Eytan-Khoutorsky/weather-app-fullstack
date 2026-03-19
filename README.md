Weather App

Overview
This is a full-stack weather application built with React (frontend) and Express (backend).
It allows users to search for weather by city, view current conditions, filter results by a date range, and store past searches in a database.

Features

Search weather by city

View temperature, conditions, humidity, and wind

Filter forecast within a 5-day date range

Store and view past searches

Tech Stack

React

Node.js / Express

OpenWeather API

SQLite (Sequelize)

How to Run

Clone the repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git

cd YOUR_REPO

Backend setup
cd backend
npm install

Create a file named .env inside the backend folder like is shown in .env.example and add:
API_KEY=your_api_key_here



Run backend:
npm start

Frontend setup
cd weather-app
npm install
npm run dev

Notes

The date range must be within 5 days (API limitation)

Do not include your real API key in the repository

Use the provided .env.example as a reference
