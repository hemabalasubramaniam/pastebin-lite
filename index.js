require("dotenv").config();
const express = require("express");
const pasteRoutes = require("./routes/paste.routes");

const app = express();
app.use(express.json());
app.use("/api", pasteRoutes);

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Pastebin API running at http://localhost:${PORT}`);
  });
}

module.exports = app;
