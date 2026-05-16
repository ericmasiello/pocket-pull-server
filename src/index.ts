import { Hono } from "hono";
import { handleLookup } from "./routes/lookup";

const app = new Hono<{ Bindings: Env }>();

app.post("/lookup", handleLookup);

export default app;
