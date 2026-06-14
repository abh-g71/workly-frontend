import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import AuthContext from "../context/AuthContext";
import socket from "../socket";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const audioRef = useRef(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3");
  }, []);

  // Unlock audio on first user interaction (mobile browsers)
  useEffect(() => {
    const unlockAudio = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      window.removeEventListener("click", unlockAudio);
    };
    window.addEventListener("click", unlockAudio);
    return () => window.removeEventListener("click", unlockAudio);
  }, []);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

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
  if (user?.token) {
    fetchUnreadCount();
  }

  const handleNotification = (data) => {
    fetchUnreadCount();

    if (data?.type === "NEW_JOB") {
      playSound();
    }
  };

  socket.on("notificationUpdated", handleNotification);

  return () => {
    socket.off("notificationUpdated", handleNotification);
  };
}, [user]);

  // Hide navbar on login/register pages
  if (['/login', '/register'].includes(location.pathname)) return null;

  const isLoggedIn = !!user?.token;

  return (
    <>
      <nav className="sticky top-0 z-40 bg-black/95 backdrop-blur-sm border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-2 no-underline">
              <div className="w-8 h-8 bg-orange-primary rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">Workly</span>
            </Link>

            {/* Desktop Center Links */}
            <div className="hidden md:flex items-center gap-1">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all no-underline ${
                      location.pathname === '/dashboard' ? 'text-orange-primary' : 'text-txt-secondary hover:text-white'
                    }`}
                  >
                    Dashboard
                  </Link>
                  {user?.role === "worker" && (
                    <Link
                      to="/open-jobs"
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all no-underline ${
                        location.pathname === '/open-jobs' ? 'text-orange-primary' : 'text-txt-secondary hover:text-white'
                      }`}
                    >
                      Find Jobs
                    </Link>
                  )}
                  <Link
                    to={user?.role === 'client' ? '/my-jobs' : '/worker-jobs'}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all no-underline ${
                      ['/my-jobs', '/worker-jobs'].includes(location.pathname) ? 'text-orange-primary' : 'text-txt-secondary hover:text-white'
                    }`}
                  >
                    My Jobs
                  </Link>
                </>
              ) : (
                <>
                  <span className="px-4 py-2 text-sm font-medium text-txt-secondary hover:text-white cursor-pointer transition-all">Find Workers</span>
                  <span className="px-4 py-2 text-sm font-medium text-txt-secondary hover:text-white cursor-pointer transition-all">Become a Worker</span>
                  <span className="px-4 py-2 text-sm font-medium text-txt-secondary hover:text-white cursor-pointer transition-all">How It Works</span>
                </>
              )}
            </div>

            {/* Desktop Right */}
            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  {/* Bell */}
                  <button
                    onClick={() => navigate("/notifications")}
                    className="relative p-2 rounded-md text-txt-secondary hover:text-white transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full animate-pulse-dot">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* User badge */}
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-dark-card border border-dark-border rounded-md">
                    <div className="w-6 h-6 bg-orange-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-[10px] font-bold text-orange-primary">{user?.name?.charAt(0)?.toUpperCase()}</span>
                    </div>
                    <span className="text-sm text-txt-secondary">{user?.name}</span>
                  </div>

                  {/* Logout */}
                  <button
                    onClick={() => { logout(); navigate('/login'); }}
                    className="px-4 py-2 text-sm font-medium text-txt-secondary hover:text-red-400 transition-all"
                  >
                    Logout
                  </button>

                  {/* Post Button (client only) */}
                  {user?.role === 'client' && (
                    <button
                      onClick={() => navigate('/create-job')}
                      className="px-5 py-2 bg-orange-primary text-white text-sm font-semibold rounded-full hover:bg-orange-hover transition-all"
                    >
                      Post a Job
                    </button>
                  )}
                </>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-2 text-sm font-medium text-txt-secondary hover:text-white transition-all no-underline">
                    Log In
                  </Link>
                  <Link to="/register" className="px-5 py-2 bg-orange-primary text-white text-sm font-semibold rounded-full hover:bg-orange-hover transition-all no-underline">
                    Post a Job
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-txt-secondary hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-dark-border bg-black animate-fade-in">
            <div className="px-4 py-4 space-y-2">
              {isLoggedIn ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm text-white hover:bg-dark-card rounded-md no-underline">Dashboard</Link>
                  {user?.role === 'worker' && (
                    <Link to="/open-jobs" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm text-white hover:bg-dark-card rounded-md no-underline">Find Jobs</Link>
                  )}
                  <Link to={user?.role === 'client' ? '/my-jobs' : '/worker-jobs'} onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm text-white hover:bg-dark-card rounded-md no-underline">My Jobs</Link>
                  <Link to="/notifications" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm text-white hover:bg-dark-card rounded-md no-underline">
                    Notifications {unreadCount > 0 && <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-[10px] rounded-full">{unreadCount}</span>}
                  </Link>
                  <button onClick={() => { logout(); navigate('/login'); setMobileOpen(false); }} className="block w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-dark-card rounded-md">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm text-white hover:bg-dark-card rounded-md no-underline">Log In</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm text-orange-primary font-semibold hover:bg-dark-card rounded-md no-underline">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;