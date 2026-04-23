import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import socket from "../socket";

function BottomNav() {
  const { user } = useContext(AuthContext);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

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

  // Hide on login/register pages
  if (['/login', '/register'].includes(location.pathname)) return null;
  if (!user?.token) return null;

  const isActive = (path) => location.pathname === path;

  const tabs = [
    {
      label: 'Home',
      path: '/dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: 'Jobs',
      path: user?.role === 'worker' ? '/open-jobs' : '/my-jobs',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'Alerts',
      path: '/notifications',
      icon: (
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] font-bold min-w-[14px] h-3.5 flex items-center justify-center rounded-full px-1 animate-pulse-dot">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
      ),
    },
    {
      label: 'Profile',
      path: '/complete-profile',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-black/95 backdrop-blur-lg border-t border-dark-border">
        <div className="flex items-center justify-around px-2 py-2">
          {tabs.map((tab) => (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-md transition-all duration-200 ${
                isActive(tab.path)
                  ? 'text-orange-primary'
                  : 'text-txt-muted hover:text-txt-secondary'
              }`}
            >
              {tab.icon}
              <span className="text-[10px] font-medium">{tab.label}</span>
              {isActive(tab.path) && (
                <div className="w-1 h-1 rounded-full bg-orange-primary mt-0.5" />
              )}
            </button>
          ))}
        </div>
        {/* Safe area padding for notched phones */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </div>
  );
}

export default BottomNav;
