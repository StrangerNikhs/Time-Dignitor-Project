const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const routes = require("./routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(cors());
app.use(morgan("dev"));
// Increase payload size limits to allow large requests (e.g. base64 images)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use("/api", routes);

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use(errorMiddleware);

module.exports = app;
