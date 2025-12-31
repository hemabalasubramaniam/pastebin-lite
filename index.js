require("dotenv").config();
const express = require("express");
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;

const pasteRoutes = require("./routes/paste.routes");

const app = express();
app.use(express.json());

app.use("/api", pasteRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Pastebin API running at ${APP_URL}`);
});
