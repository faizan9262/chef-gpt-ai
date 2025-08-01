import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoDBConnect from "../config/mogoDB";
import router from "../routes/routes";

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "https://chef-gpt-ai-client.vercel.app"],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
mongoDBConnect();

app.use('/api', router);

app.get("/api/test", (_, res) => {
  res.json({ message: "API working!" });
});

export default app;
