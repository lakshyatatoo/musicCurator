const express = require("express");
const path = require("path");
const app = express();
const authRoutes = require("./routes/auth.routes");
const spotifyRoutes = require("./routes/spotify.routes");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use("/api/auth", authRoutes);
app.use("/api/spotify", spotifyRoutes);

module.exports = app;
