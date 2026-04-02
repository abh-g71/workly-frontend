import { useEffect, useState, useContext, useRef } from "react";
import AuthContext from "../context/AuthContext";
import MatchBadge from "../components/MatchBadge";
import socket from "../socket";
import { toast } from "react-toastify";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function OpenJobs() {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState("");
  const [newJobIds, setNewJobIds] = useState([]);
  const [expandedMap, setExpandedMap] = useState(null);
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
    return () => window.removeEventListener("click", unlockAudio);
  }, []);

  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3");
  }, []);

  useEffect(() => {
    if (!user?.token) return;

    const fetchJobs = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/jobs/open", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        if (res.ok) setJobs(data.jobs);
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
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        if (res.ok) {
          const newIds = data.jobs.map((job) => job._id);
          setNewJobIds(newIds);
          setJobs(data.jobs);
          setTimeout(() => setNewJobIds([]), 3000);
        }
      } catch (error) {
        console.error(error);
      }
    };

    socket.on("jobUpdated", handleUpdate);
    fetchJobs();

    return () => socket.off("jobUpdated", handleUpdate);
  }, [user]);

  const handleApply = async (jobId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/jobs/apply/${jobId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${user.token}` },
      });
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

  const handleNavigate = (lat, lng) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank"
    );
  };

  return (
    <div style={{ padding: "20px" }}>
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
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              margin: "12px 0",
              padding: "18px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              backgroundColor: newJobIds.includes(job._id) ? "#d1fae5" : "white",
              transition: "0.5s",
            }}
          >
            <h3>{job.title}</h3>
            <p>{job.description}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Budget:</strong> ₹{job.budget}</p>
            <p><MatchBadge percentage={job.matchPercentage} /></p>
            <p><strong>Client:</strong> {job.client?.name}</p>

            {/* Buttons Row */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
              <button
                onClick={() => handleApply(job._id)}
                style={{
                  backgroundColor: "#3b82f6",
                  color: "white",
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Apply
              </button>

              {/* Show map button only if coordinates exist */}
              {job.coordinates?.lat && (
                <>
                  <button
                    onClick={() =>
                      setExpandedMap(expandedMap === job._id ? null : job._id)
                    }
                    style={{
                      backgroundColor: "#8b5cf6",
                      color: "white",
                      padding: "8px 16px",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    {expandedMap === job._id ? "Hide Map 🗺️" : "View Location 🗺️"}
                  </button>

                  <button
                    onClick={() =>
                      handleNavigate(job.coordinates.lat, job.coordinates.lng)
                    }
                    style={{
                      backgroundColor: "#10b981",
                      color: "white",
                      padding: "8px 16px",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Navigate 🧭
                  </button>
                </>
              )}
            </div>

            {/* Map Preview */}
            {expandedMap === job._id && job.coordinates?.lat && (
              <div style={{ marginTop: "15px" }}>
                <MapContainer
                  center={[job.coordinates.lat, job.coordinates.lng]}
                  zoom={15}
                  style={{ height: "250px", width: "100%", borderRadius: "12px" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                  />
                  <Marker position={[job.coordinates.lat, job.coordinates.lng]}>
                    <Popup>{job.title} — {job.location}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default OpenJobs;