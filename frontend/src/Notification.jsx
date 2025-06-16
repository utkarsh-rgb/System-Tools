import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function Notification() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    
    const storedUser = localStorage.getItem("userData");
    if (!storedUser) {
      console.warn("⚠️ No userData found in localStorage. Skipping socket registration.");
      return;
    }

    const user = JSON.parse(storedUser);
    const username = user.username;

    if (!username) {
      console.warn("⚠️ No username found in userData. Skipping socket registration.");
      return;
    }

    socket.emit("register", username);
    console.log(`Socket registered with username: ${username}`);

    socket.on("notification", (data) => {
      console.log("Received notification:", data);
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((note, idx) => (
          <li key={idx}>
            <strong>Order #{note.orderId}</strong>: {note.message} <br />
            Status: {note.status} <br />
            Time: {new Date(note.timestamp).toLocaleTimeString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notification;
