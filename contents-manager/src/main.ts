import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { corsMiddleware } from "./infrastructure/config/cors";
import { config } from "./infrastructure/config/env";
import articleRoutes from "./interface/routes/articleRoutes";

const app = new Hono().basePath("/api");

app.basePath("/api");
app.use("*", corsMiddleware);
app.route("/articles", articleRoutes);

const port = config.port || 3001;
console.log(`Server is running on http://localhost:${port}`);

serve({
	...app,
	port,
});

export default app;
