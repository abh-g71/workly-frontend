import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import socket from "../socket";

function Navbar() {
  const { user } = useContext(AuthContext);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const fetchUnreadCount = async () => {
    if (!user?.token) return;
    try {
      const res = await fetch("http://localhost:8000/api/notifications/unread-count", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (res.ok) setUnreadCount(data.count);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user?.token) fetchUnreadCount();

    socket.on("notificationUpdated", fetchUnreadCount);

    return () => socket.off("notificationUpdated", fetchUnreadCount);
  }, [user]);

  return (
    <div style={{
      backgroundColor: "#111827",
      color: "white",
      padding: "16px 24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
    }}>
      <h1 style={{ fontSize: "20px", fontWeight: "600", margin: 0 }}>
        Workly
      </h1>

      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        <Link to="/dashboard" style={{ color: "white", textDecoration: "none" }}>
          Dashboard
        </Link>

        {user?.role === "worker" && (
          <Link to="/open-jobs" style={{ color: "white", textDecoration: "none" }}>
            Open Jobs
          </Link>
        )}

        {user?.role === "client" && (
          <Link to="/my-jobs" style={{ color: "white", textDecoration: "none" }}>
            My Jobs
          </Link>
        )}

        {user?.role === "worker" && (
          <Link to="/worker-jobs" style={{ color: "white", textDecoration: "none" }}>
            My Jobs
          </Link>
        )}

        {/* Bell Icon */}
        {user?.token && (
          <div
            onClick={() => navigate("/notifications")}
            style={{
              position: "relative",
              cursor: "pointer",
              fontSize: "22px",
            }}
          >
            🔔
            {unreadCount > 0 && (
              <span style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                backgroundColor: "#ef4444",
                color: "white",
                borderRadius: "50%",
                width: "18px",
                height: "18px",
                fontSize: "11px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              }}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;