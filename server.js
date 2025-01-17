const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:3000" } });

app.use(cors());
app.use(express.json());

// Simulated traffic data
let trafficData = [
    { location: "Intersection A", trafficDensity: "Moderate", timestamp: Date.now() },
    { location: "Intersection B", trafficDensity: "Low", timestamp: Date.now() },
];

// Real-time updates every 5 seconds
setInterval(() => {
    trafficData = trafficData.map((item) => ({
        ...item,
        trafficDensity: ["Low", "Moderate", "High"][Math.floor(Math.random() * 3)],
        timestamp: Date.now(),
    }));
    io.emit("trafficUpdate", trafficData);
}, 5000);

app.get("/api/traffic", (req, res) => {
    res.json({ data: trafficData });
});

app.post("/api/anomalies", (req, res) => {
    const anomalies = trafficData.filter((data) => data.trafficDensity === "High");
    res.json({ anomalies });
});

server.listen(5000, () => console.log("Server running on http://localhost:5000"));
