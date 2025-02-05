export const ENV = process.env.NODE_ENV || "local";

export const config = {
  env: ENV,
  port: Number(process.env.PORT) || 3001,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
};
