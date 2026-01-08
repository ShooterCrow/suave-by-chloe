const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const fsPromises = require("fs/promises");
const { format } = require("date-fns");
const Log = require("../models/Log");

const logEvents = async (
  message,
  logFileName,
  type = "system",
  level = "info",
  details = {}
) => {
  const dateTime = format(new Date(), "yyyyMMdd\tHH:mm:ss");
  const logId = uuidv4();
  const logItem = `${dateTime}\t${logId}\t${message}\n`;

  try {
    // File logging
    const logsFolderPath = path.join(__dirname, "..", "logs");
    if (!fs.existsSync(logsFolderPath)) {
      await fsPromises.mkdir(logsFolderPath);
    }
    await fsPromises.appendFile(
      path.join(logsFolderPath, logFileName),
      logItem
    );

    console.log(logId, type, level, message, details, new Date());

    // MongoDB logging
    await Log.create({
      logId,
      type,
      level,
      message,
      details,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error("Error writing to logs:", err);
  }
};

const errorLogger = async (err, req) => {
  const logId = uuidv4();
  const errorDetails = {
    method: req.method,
    url: req.path,
    origin: req.headers.origin,
    ip: req.ip,
    userId: req.user?.id || "unauthenticated",
    errorName: err.name,
    errorStack: err.stack,
    statusCode: err.statusCode || 500,
    requestBody: req.body,
    requestQuery: req.query,
  };

  const logMessage = `${err.name}: ${err.message}`;

  // Log to both file and MongoDB
  await logEvents(
    `${logMessage}\t${req.method}\t${req.url}\t${req.ip}`,
    "errorLog.txt",
    "error",
    err.statusCode >= 500 ? "critical" : "error",
    errorDetails
  );

  // For critical errors, log full details to separate file
  if (err.statusCode >= 500) {
    const detailedLog = JSON.stringify({ logId, ...errorDetails }, null, 2);
    await logEvents(
      detailedLog,
      "criticalErrors.txt",
      "error",
      "critical",
      errorDetails
    );
  }

  return logId;
};

const requestLogger = async (req, res, next) => {
  const requestDetails = {
    method: req.method,
    url: req.url,
    origin: req.headers.origin,
    ip: req.ip,
    userId: req.user?.id || "unauthenticated",
    requestBody: req.body,
    requestQuery: req.query,
  };

  await logEvents(
    `${req.method}\t${req.url}\t${req.headers.origin}\t${req.ip}`,
    "reqLog.txt",
    "request",
    "info",
    requestDetails
  );

  next();
};

// Cleanup old logs periodically (keeps last 30 days)
const cleanupOldLogs = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  try {
    await Log.deleteMany({ timestamp: { $lt: thirtyDaysAgo } });
  } catch (err) {
    console.error("Error cleaning up old logs:", err);
  }
};

// Run cleanup daily
setInterval(cleanupOldLogs, 24 * 60 * 60 * 1000);

module.exports = { logEvents, errorLogger, requestLogger };
