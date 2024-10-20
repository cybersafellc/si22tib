import { Client } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { logger } from "./logging.js";

const client = new Client({
  puppeteer: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
  logger.info("Scan QR code di atas untuk login ke WhatsApp");
});
client.on("ready", () => {
  logger.info("WhatsApp client is ready!");
});

export { client };
