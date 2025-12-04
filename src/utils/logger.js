const { createLogger, format, transports } = require("winston");

const { combine, timestamp, printf, colorize, json } = format;

const consoleFormat = printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level}: ${message}`;
  });

  const logger = createLogger({
    level: "info",
    exitOnError: false,
    format: combine(
      timestamp(),
      json()
    ),
    transports: [
      new transports.Console({
        format: combine(colorize(), timestamp(), consoleFormat)
      }),
  
      new transports.File({
        filename: "logs/error.log",
        level: "error"
      }),
  
      // Save all logs to combined.log
      new transports.File({
        filename: "logs/combined.log"
      })
    ]
  });
  
  module.exports = logger;
  