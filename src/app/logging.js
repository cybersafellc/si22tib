import Winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

export const logger = Winston.createLogger({
  level: "info",
  format: Winston.format.combine(
    Winston.format.timestamp(),
    Winston.format.json(
      (info) => `[${info.timestamp}-${info.level}]=>${info.message}`
    )
  ),
  transports: [
    new Winston.transports.Console(),
    new Winston.transports.DailyRotateFile({
      filename: path.join("tmp", "%DATE%.combine.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxFiles: "15d",
      maxSize: "20m",
    }),
    new Winston.transports.DailyRotateFile({
      level: "error",
      filename: path.join("tmp", "%DATE%.error.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxFiles: "15d",
      maxSize: "20m",
    }),
  ],
});
