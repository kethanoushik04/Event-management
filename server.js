const express = require("express");
// const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// dotenv.config();
connectDB();

const allowedOrigins = [
  "http://localhost:5173", // Vite
  "https://event-management-web-ivory.vercel.app/"
];

const app = express();

app.use(cors({origin:allowedOrigins,credentials: true}));
app.use(express.json());

app.get("/",(req,res)=>{
  res.send("Kethan Gaikwad");
})


app.use('/api/profiles', require('./routes/profileRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
