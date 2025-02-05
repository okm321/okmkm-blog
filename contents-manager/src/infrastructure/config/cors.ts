import { cors } from "hono/cors";
import { config } from "./env";

export const corsMiddleware = cors({
  origin: config.corsOrigin.split(","),
  allowMethods: ["GET"],
});
