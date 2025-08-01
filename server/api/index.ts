// api/index.ts
import app from "../src/index";
import { Server } from "http";
import { NowRequest, NowResponse } from "@vercel/node";

const server = new Server(app);

export default function handler(req: NowRequest, res: NowResponse) {
  server.emit("request", req, res);
}
