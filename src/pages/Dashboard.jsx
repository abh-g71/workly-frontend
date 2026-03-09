import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

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
          <button onClick={() => navigate("/open-jobs")}>
            View Open Jobs
          </button>

          <a href="/my-jobs">
  <          button>My Jobs</button>
          </a>
        </div>
      )}

      <br />
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard;