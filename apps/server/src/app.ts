import express from "express";
import cors from "cors";
import todoRoutes from "./routes/todo.routes.js";
import { errorHandler, notFound } from "./middleware/error-handler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/todos", todoRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
