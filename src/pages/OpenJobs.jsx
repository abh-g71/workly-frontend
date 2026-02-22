import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function OpenJobs() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/api/jobs/open",
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
          if (data.message === "PROFILE_INCOMPLETE") {
            navigate("/complete-profile");
          } else {
            alert(data.message || "Failed to fetch jobs");
          }
        }
      } catch (error) {
        console.error(error);
        alert("Server error");
      }
    };

    if (user?.token) {
      fetchJobs();
    }
  }, [user, navigate]);

  const handleApply = async (jobId) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/jobs/apply/${jobId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Applied successfully");
      } else {
        alert(data.message || "Failed to apply");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div>
      <h2>Open Jobs</h2>

      {jobs.length === 0 ? (
        <p>No open jobs available.</p>
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
            <p>{job.description}</p>

            <p>
              <strong>Location:</strong> {job.location}
            </p>

            <p>
              <strong>Budget:</strong> ₹{job.budget}
            </p>
              
            <p>
              <strong>Match:</strong> {job.  matchPercentage}%
            </p>

            <p>
              <strong>Client:</strong> {job.client?.name}
            </p>

            <button onClick={() => handleApply(job._id)}>
              Apply
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default OpenJobs;