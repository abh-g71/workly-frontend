import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Card from "../components/ui/Card";

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [hasProfile, setHasProfile] = useState(null);

  useEffect(() => {
    const checkProfile = async () => {
      if (user?.role !== "worker") return;

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/workers/me`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await res.json();
        setHasProfile(data.hasProfile);
      } catch (error) {
        console.error(error);
      }
    };

    if (user?.token) {
      checkProfile();
    }
  }, [user]);

  const clientActions = [
    {
      icon: "➕",
      title: "Post a Job",
      desc: "Create a new job listing and find workers",
      path: "/create-job",
      color: "from-accent-indigo to-purple-500",
    },
    {
      icon: "📋",
      title: "My Jobs",
      desc: "View and manage your posted jobs",
      path: "/my-jobs",
      color: "from-accent-cyan to-blue-500",
    },
  ];

  const workerActions = [
    {
      icon: "🔍",
      title: "Find Jobs",
      desc: "Browse and apply to available jobs",
      path: "/open-jobs",
      color: "from-success to-emerald-600",
    },
    {
      icon: "📋",
      title: "My Jobs",
      desc: "View your accepted and completed jobs",
      path: "/worker-jobs",
      color: "from-accent-cyan to-blue-500",
    },
    {
      icon: "✏️",
      title: hasProfile ? "Edit Profile" : "Complete Profile",
      desc: hasProfile ? "Update your skills and hourly rate" : "Set up your worker profile to start",
      path: "/complete-profile",
      color: "from-accent-indigo to-purple-500",
    },
  ];

  const actions = user?.role === "client" ? clientActions : workerActions;

  return (
    <div className="page-container">
      {/* Welcome Section */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold text-txt-primary mb-2">
          Welcome back, <span className="gradient-text">{user?.name || 'User'}</span> 👋
        </h1>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            user?.role === 'client'
              ? 'bg-accent-indigo/15 text-accent-indigo border-accent-indigo/30'
              : 'bg-accent-cyan/15 text-accent-cyan border-accent-cyan/30'
          }`}>
            {user?.role === 'client' ? '👤 Client' : '🔧 Worker'}
          </span>
        </div>
      </div>

      {/* Profile Warning */}
      {user?.role === "worker" && hasProfile === false && (
        <div
          className="bg-warning/10 border border-warning/30 rounded-2xl p-4 mb-6 flex items-center gap-3 cursor-pointer hover:bg-warning/15 transition-all animate-slide-up"
          onClick={() => navigate("/complete-profile")}
        >
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="text-warning font-semibold text-sm">Complete your profile</p>
            <p className="text-warning/70 text-xs">Set up your skills and experience to start receiving job matches</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-warning ml-auto flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}

      {/* Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action) => (
          <Card
            key={action.path}
            className="cursor-pointer hover:shadow-card-hover hover:border-navy-600 hover:-translate-y-1 group"
          >
            <div
              onClick={() => navigate(action.path)}
              className="h-full"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {action.icon}
              </div>
              <h3 className="text-lg font-bold text-txt-primary mb-1">{action.title}</h3>
              <p className="text-sm text-txt-secondary">{action.desc}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Logout - Mobile Only */}
      <div className="md:hidden mt-8">
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="w-full py-3 rounded-xl text-sm font-semibold text-error/80 bg-error/5 border border-error/20 hover:bg-error/10 transition-all"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default Dashboard;