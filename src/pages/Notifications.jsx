import { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import socket from "../socket";

function Notifications() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/notifications", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (res.ok) setNotifications(data.notifications);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch("http://localhost:8000/api/notifications/mark-all-read", {
        method: "PUT",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await fetch(`http://localhost:8000/api/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user?.token) fetchNotifications();

    socket.on("notificationUpdated", fetchNotifications);

    return () => socket.off("notificationUpdated", fetchNotifications);
  }, [user]);

  const getIcon = (type) => {
    switch (type) {
      case "NEW_JOB": return "💼";
      case "NEW_APPLICATION": return "📋";
      case "JOB_ACCEPTED": return "✅";
      case "JOB_COMPLETED": return "🎉";
      case "JOB_RATED": return "⭐";
      default: return "🔔";
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>🔔 Notifications</h2>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={handleMarkAllRead}
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              padding: "8px 16px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Mark All Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        notifications.map((n) => (
          <div
            key={n._id}
            onClick={() => !n.read && handleMarkRead(n._id)}
            style={{
              padding: "14px",
              margin: "10px 0",
              borderRadius: "10px",
              backgroundColor: n.read ? "#f9fafb" : "#eff6ff",
              border: n.read ? "1px solid #e5e7eb" : "1px solid #93c5fd",
              cursor: n.read ? "default" : "pointer",
              display: "flex",
              gap: "12px",
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: "24px" }}>{getIcon(n.type)}</span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: n.read ? "normal" : "bold" }}>
                {n.message}
              </p>
              <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#6b7280" }}>
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
            {!n.read && (
              <span style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "#3b82f6",
                marginTop: "5px",
                flexShrink: 0,
              }} />
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Notifications;