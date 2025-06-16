
import React from "react";
import Notification from "./Notification";

function NotificationTestPage() {
  return (
    <div className="container py-4">
      <h2>Notification Test Page</h2>
      <p>This page shows real-time notifications via Socket.IO.</p>
      <Notification />
    </div>
  );
}

export default NotificationTestPage;
