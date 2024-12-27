import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
    const [trafficData, setTrafficData] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/traffic")
            .then((res) => res.json())
            .then((data) => setTrafficData(data.data));

        socket.on("trafficUpdate", (data) => {
            setTrafficData(data);
        });

        const fetchAnomalies = () => {
            fetch("http://localhost:5000/api/anomalies", { method: "POST" })
                .then((res) => res.json())
                .then((data) => {
                    if (data.anomalies.length > 0) {
                        alert("Suspicious Activity Detected: High Traffic in sensitive zones.");
                    }
                });
        };

        fetchAnomalies();
    }, [trafficData]);

    const sortedTrafficData = [...trafficData].sort((a, b) =>
        a.trafficDensity.localeCompare(b.trafficDensity)
    );

    return (
        <div>
            <h1>Real-Time Traffic Monitoring</h1>
            <ul>
                {sortedTrafficData.map((item, idx) => (
                    <li
                        key={idx}
                        style={{
                            color: item.trafficDensity === "High" ? "red" : "black",
                        }}
                    >
                        Location: {item.location}, Density: {item.trafficDensity}, Time:{" "}
                        {new Date(item.timestamp).toLocaleString()}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
