import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [hasProfile, setHasProfile] = useState(null);

  useEffect(() => {
    const checkProfile = async () => {
      if (user?.role !== "worker") return;

      try {
        const res = await fetch("http://localhost:8000/api/workers/me", {
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

  return (
    <div>
      <h2>Dashboard</h2>

      <p>Logged in as: <strong>{user?.role}</strong></p>

      {user?.role === "client" && (
        <div>
          <h3>Client Panel</h3>
          <p>You can post jobs and manage requests.</p>
          <button onClick={() => navigate("/create-job")}>
            Create Job
          </button>
          <button onClick={() => navigate("/my-jobs")}>
            View My Jobs
          </button>
        </div>
      )}

      {user?.role === "worker" && (
        <div>
          <h3>Worker Panel</h3>
          <p>You can accept and complete jobs.</p>

          {hasProfile === false && (
            <button onClick={() => navigate("/complete-profile")}>
              ⚠️ Complete Profile First
            </button>
          )}

          {hasProfile === true && (
            <button onClick={() => navigate("/complete-profile")}>
              Edit Profile
            </button>
          )}

          <button onClick={() => navigate("/open-jobs")}>
            View Open Jobs
          </button>

          <button onClick={() => navigate("/worker-jobs")}>My Jobs</button>
        </div>
      )}

      <br />
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard;