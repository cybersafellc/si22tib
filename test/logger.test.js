import { logger } from "../src/app/logging.js";

describe("test logger", () => {
  it("info", async () => {
    logger.info("Info message");
  });
  it("warn", async () => {
    logger.warn("Warn message");
  });
  it("error", async () => {
    logger.error("Error message");
  });
});
