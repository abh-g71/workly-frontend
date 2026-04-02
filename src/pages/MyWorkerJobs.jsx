import { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";

function MyWorkerJobs() {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/api/jobs/my-jobs",
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

  

  return (
    <div>
      <h2>My Assigned Jobs</h2>

      {jobs.length === 0 ? (
        <p>No assigned jobs yet.</p>
      ) : (
        jobs.map((job) => (
          <div
            key={job._id}
            style={{
              border: "1px solid black",
              margin: "10px",
              padding: "10px",
            }}
          >
            <h3>{job.title}</h3>
           <p>
              Status: <StatusBadge status={job.status} />
           </p>

            {job.status === "IN_PROGRESS" && (
              <p style={{ color: "#f59e0b", fontWeight: "bold" }}>
                ⏳ Job in progress — client will mark it complete
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default MyWorkerJobs;