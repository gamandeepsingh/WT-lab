import dotenv from "dotenv";
dotenv.config();

export const DB_NAME = "EventManager";

export const allowedOrigins = process.env.ORIGINS.split(',');

export const port = process.env.PORT || 3001;

export const API_KEY = '12345-abcdef-67890-ghijkl';
