import express from "express"
import cors from 'cors'
import router from "./routes/routes"
import { createServer } from "http";
import mongoDBConnect from "./config/mogoDB";
import cookieParser from "cookie-parser";

const app = express()
const httpServer = createServer(app);

app.use(cors({
    origin:["http://localhost:5173","https://chef-gpt-ai-client.vercel.app"],
    credentials:true
}))
app.use(express.json())
mongoDBConnect()
app.use(cookieParser(process.env.JWT_SECRET));

app.use('/api',router)

const port = 3000;
httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;