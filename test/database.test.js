import { database } from "../src/app/database.js";
import { logger } from "../src/app/logging.js";

test("test connect database", async () => {
  await database.$connect();
  logger.info("aman connectionnya");
});
