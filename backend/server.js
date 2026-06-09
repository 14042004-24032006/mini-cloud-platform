const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

const machineRoutes = require("./routes/machineRoutes");
app.use("/api/machines", machineRoutes);

const workloadRoutes = require("./routes/workloadRoutes");
app.use("/api/workloads", workloadRoutes);

const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);

const checkOfflineMachines =require("./utils/checkOfflineMachines");

app.get("/", (req, res) => {
  res.send("Mini Cloud Platform API Running");
});
setInterval(() => {
    checkOfflineMachines();
}, 10000);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});