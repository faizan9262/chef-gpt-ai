import express from "express"
import cors from 'cors'
import router from "./routes/routes"
import mongoDBConnect from "./config/mogoDB";
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
  origin: ["http://localhost:5173", "https://chef-gpt-ai-client.vercel.app"],
  credentials: true,
}));
// app.options("*", cors()); 
app.use(express.json())
mongoDBConnect()
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use('/api', router)
app.get("/api/test", (_, res) => {
  res.json({ message: "API working!" });
});

export default app;
