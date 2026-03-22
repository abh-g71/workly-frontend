import { useEffect, useState, useContext, useRef } from "react";

import AuthContext from "../context/AuthContext";
import MatchBadge from "../components/MatchBadge";
import socket from "../socket";
import { toast } from "react-toastify";

function OpenJobs() {
  const { user } = useContext(AuthContext);
  
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState("");
  const [newJobIds, setNewJobIds] = useState([]);
  const audioRef = useRef(null); 

  const playSound = () => {
  if (audioRef.current) {
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }
};
  
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

  return () => {
    window.removeEventListener("click", unlockAudio);
  };
}, []);

  useEffect(() => {
  audioRef.current = new Audio("/notification.mp3");
}, []);

  useEffect(() => {
  if (!user?.token) return;

  const fetchJobs = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/jobs/open", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async () => {
  console.log("🔥 jobUpdated received");

  toast.info("🆕 New job available!");

  playSound();

  try {
    const res = await fetch("http://localhost:8000/api/jobs/open", {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      const newIds = data.jobs.map((job) => job._id);

      setNewJobIds(newIds);
      setJobs(data.jobs);

      // remove highlight after 3 seconds
      setTimeout(() => {
        setNewJobIds([]);
      }, 3000);
    }
  } catch (error) {
    console.error(error);
  }
};

  // ✅ attach listener
  socket.on("jobUpdated", handleUpdate);

  // initial load
  fetchJobs();

  // ✅ CLEANUP (THIS WAS MISSING)
  return () => {
    socket.off("jobUpdated", handleUpdate);
  };

}, [user]);

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
        setMessage("Applied Successfully ✅");
      } else {
        setMessage(data.message || "Failed to apply ❌");
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error ❌");
    }
  };

  return (
    <div>
      <h2>Open Jobs</h2>

      {message && (
        <div
          style={{
            marginBottom: "15px",
            padding: "10px",
            backgroundColor: message.includes("❌") ? "#fee2e2" : "#dcfce7",
            color: message.includes("❌") ? "#b91c1c" : "#166534",
            borderRadius: "6px",
            fontWeight: "500",
          }}
        >
          {message}
        </div>
      )}

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
              backgroundColor: newJobIds.includes(job._id)
                ? "#d1fae5"
                : "white",
              transition: "0.5s",
            }}
          >
            <h3>{job.title}</h3>
            <p>{job.description}</p>

            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Budget:</strong> ₹{job.budget}</p>

            <p>
              <MatchBadge percentage={job.matchPercentage} />
            </p>

            <p><strong>Client:</strong> {job.client?.name}</p>

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