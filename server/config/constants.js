import dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: process.env.PORT || 3000,
  MONGO_URI: 'mongodb+srv://admin:1234@ntc-trucking.8ofgb.mongodb.net/ntc?retryWrites=true&w=majority&appName=ntc-trucking',
  JWT_SECRET: 'ntc-jwt-t897391uv74'
};
