import { createServer } from "http";
import app from "./express.js";

const server = createServer(app);

export default server;
