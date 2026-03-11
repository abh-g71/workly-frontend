import { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";

function MyClientJobs() {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/api/jobs/my-client-jobs",
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const data = await res.json();

        if (res.ok) {
          setJobs(data.jobs);
        } else {
          alert(data.message || "Failed to fetch jobs");
        }
      } catch (error) {
        console.error(error);
        alert("Server error");
      }
    };

    if (user?.token) {
      fetchJobs();
    }
  }, [user]);

  const handleAccept = async (jobId, workerId) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/jobs/${jobId}/accept/${workerId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Worker accepted successfully");
        window.location.reload();
      } else {
        alert(data.message || "Failed to accept worker");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  const handleComplete = async (jobId) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/jobs/${jobId}/complete`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Job marked as completed");
        window.location.reload();
      } else {
        alert(data.message || "Failed to complete job");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  const handleRate = async (jobId) => {
    const rating = prompt("Enter rating (1-5)");

    if (!rating || rating < 1 || rating > 5) {
      alert("Rating must be between 1 and 5");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8000/api/jobs/${jobId}/rate`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ rating: Number(rating) }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Worker rated successfully");
        window.location.reload();
      } else {
        alert(data.message || "Failed to rate worker");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div>
      <h2>My Jobs</h2>

      {jobs.length === 0 ? (
        <p>No jobs created yet.</p>
      ) : (
        jobs.map((job) => (
          <div
            key={job._id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              margin: "12px 0",
              padding: "18px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              background: "#ffffff",
              color: "#1f2937"
            }}
          >
            <h3>{job.title}</h3>
            <p>
               Status: <StatusBadge status={job.status} />
            </p>

            {/* Mark Complete */}
            {job.status === "IN_PROGRESS" && (
              <button
                style={{ marginBottom: "10px" }}
                onClick={() => handleComplete(job._id)}
              >
                Mark as Completed
              </button>
            )}

            {/* Rate Worker */}
            {job.status === "COMPLETED" && !job.isRated && (
              <button
                style={{ marginBottom: "10px" }}
                onClick={() => handleRate(job._id)}
              >
                Rate Worker
              </button>
            )}

            {job.assignedWorker && (
              <p>
                Worker Rating: ⭐ {job.assignedWorker.rating?.toFixed(1) || "0"}
                ({job.assignedWorker.ratingCount || 0} reviews)
              </p>
            )}

            <h4>Applications:</h4>

            {job.applications && job.applications.length > 0 ? (
              job.applications.map((app, index) => (
                <div key={index} style={{ marginBottom: "5px" }}>
                  <p>
                    Worker: {app.worker.name} ⭐ {app.worker.rating?.toFixed(1) || 0}
                    ({app.worker.ratingCount || 0} reviews)
                  </p>

                  {job.status === "OPEN" && (
                    <button
                      style={{ marginLeft: "10px" }}
                      onClick={() =>
                        handleAccept(job._id, app.worker._id)
                      }
                    >
                      Accept
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p>No applications yet.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default MyClientJobs;