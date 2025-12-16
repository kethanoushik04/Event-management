require("./controllers/env.js");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

connectDB();

const app = express();

app.use(cors({
  origin: "https://event-management-web-ivory.vercel.app",
  credentials: true,
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Kethan Gaikwad");
});

app.use("/api/profiles", require("./routes/profileRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
