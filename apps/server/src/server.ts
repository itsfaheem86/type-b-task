import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT ?? 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set");
  process.exit(1);
}

await connectDB(MONGODB_URI);
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
