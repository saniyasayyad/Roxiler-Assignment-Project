import dotenv from "dotenv";
dotenv.config();

import pg from "pg";
const { Client } = pg;

// 🔎 Debug: check if env variables are loading
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "***** (loaded)" : "❌ not loaded");

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

try {
  await client.connect();
  console.log("✅ Database connection successful!");
  await client.end();
} catch (err) {
  console.error("❌ Connection error:", err);
}
