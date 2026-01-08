const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const path = require("path");
const cookieParser = require("cookie-parser");
const corsOptions = require("./config/corsOption");

const root = require("./routes/root");
const auth = require("./routes/auth");
const rooms = require("./routes/rooms");
const settings = require("./routes/settings");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(helmet());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.get("/", (req, res) => {
  res.send("API requires /api/v1 prefix");
});

// Mount routers
app.use("/api", root);
app.use("/api/auth", auth);
app.use("/api/rooms", rooms);
app.use("/api/settings", settings);

// Then add the 404 handler LAST
app.all(/(.*)/, (req, res) => {
  const accept = req.accepts(["html", "json", "txt"]);
  if (accept === "html") {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
  } else if (accept === "json") {
    res.status(404).json({ error: "404 Not Found" });
  } else {
    res.status(404).type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port http://localhost:${PORT}`
  );
});
