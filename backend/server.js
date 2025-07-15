import express from 'express';
import dotenv from 'dotenv';
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from 'cookie-parser';
import storeRoutes from './routes/storeRoutes.js'
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser())
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/store", storeRoutes);


app.get('/', (req, res) => {
  res.send(' user post API is running...');
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});