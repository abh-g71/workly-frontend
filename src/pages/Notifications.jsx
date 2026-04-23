import { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import socket from "../socket";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import SkeletonCard from "../components/ui/SkeletonCard";
import EmptyState from "../components/ui/EmptyState";

function Notifications() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/notifications", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (res.ok) setNotifications(data.notifications);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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

  const timeAgo = (dateStr) => {
    const now = new Date();
    const date = new Date(dateStr);
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="page-container max-w-2xl">
        <h1 className="page-title">Notifications</h1>
        <SkeletonCard count={5} />
      </div>
    );
  }

  return (
    <div className="page-container max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-txt-primary">Notifications</h1>
          {notifications.filter(n => !n.read).length > 0 && (
            <span className="px-2 py-0.5 bg-accent-indigo/15 text-accent-indigo text-xs font-bold rounded-full">
              {notifications.filter(n => !n.read).length} new
            </span>
          )}
        </div>
        {notifications.some((n) => !n.read) && (
          <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
            Mark All Read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon="🔔"
          title="No notifications"
          description="You're all caught up! New notifications will appear here when there's activity on your jobs."
        />
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => !n.read && handleMarkRead(n._id)}
              className={`
                flex items-start gap-3 p-4 rounded-2xl border transition-all duration-200
                ${n.read
                  ? 'bg-navy-800/50 border-navy-700/50'
                  : 'bg-navy-800 border-l-4 border-l-accent-indigo border-t-navy-700 border-r-navy-700 border-b-navy-700 cursor-pointer hover:bg-navy-800/80'
                }
              `}
            >
              {/* Icon */}
              <span className="text-xl flex-shrink-0 mt-0.5">{getIcon(n.type)}</span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-relaxed ${n.read ? 'text-txt-secondary' : 'text-txt-primary font-medium'}`}>
                  {n.message}
                </p>
                <p className="text-xs text-txt-muted mt-1">{timeAgo(n.createdAt)}</p>
              </div>

              {/* Unread dot */}
              {!n.read && (
                <div className="w-2 h-2 rounded-full bg-accent-indigo animate-pulse-dot flex-shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;