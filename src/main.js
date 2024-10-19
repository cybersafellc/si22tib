import { web } from "./app/web.js";
import http from "http";
import dotenv from "dotenv";
import { logger } from "./app/logging.js";
dotenv.config();
import { client } from "./app/whatsapp.js";

client.initialize();
const port = process.env.PORT || 3000;
const server = http.createServer(web);
server.listen(port, () => {
  logger.info("server running");
});
