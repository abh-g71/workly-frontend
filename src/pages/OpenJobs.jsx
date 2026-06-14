import { useEffect, useState, useContext, useRef } from "react";
import AuthContext from "../context/AuthContext";
import MatchBadge from "../components/MatchBadge";
import socket from "../socket";
import { toast } from "react-toastify";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import SkeletonCard from "../components/ui/SkeletonCard";
import EmptyState from "../components/ui/EmptyState";

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
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
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
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/open`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        if (res.ok) setJobs(data.jobs);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

      const handleUpdate = async (data) => {
  console.log("🔥 jobUpdated received");

  if (data?.type === "NEW_JOB") {
    toast.info("🆕 New job available!");
    playSound();
  }

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/jobs/open`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

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
    setApplyingId(jobId);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/apply/${jobId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Applied Successfully! ✅");
      } else {
        toast.error(data.message || "Failed to apply");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    } finally {
      setApplyingId(null);
    }
  };

  const handleNavigate = (lat, lng) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank"
    );
  };

  if (loading) {
    return (
      <div className="page-container">
        <h1 className="page-title">Open Jobs</h1>
        <SkeletonCard count={4} />
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Open Jobs</h1>

      {jobs.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No open jobs"
          description="There are no jobs available right now. New jobs will appear here in real time."
        />
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card
              key={job._id}
              flash={newJobIds.includes(job._id)}
              className="animate-fade-in"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-lg font-bold text-txt-primary leading-tight">{job.title}</h3>
                <MatchBadge percentage={job.matchPercentage} />
              </div>

              {/* Description */}
              <p className="text-sm text-txt-secondary mb-4 line-clamp-2">{job.description}</p>

              {/* Skills Chips */}
              {job.requiredSkills && job.requiredSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {job.requiredSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-navy-900 border border-navy-700 rounded-full text-xs text-txt-secondary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Details */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-sm">
                <div className="flex items-center gap-1.5 text-txt-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate max-w-[200px]">{job.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-success font-semibold">₹{job.budget}</span>
                </div>
                <div className="flex items-center gap-1.5 text-txt-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{job.client?.name}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleApply(job._id)}
                  loading={applyingId === job._id}
                >
                  Apply Now
                </Button>

                {job.coordinates?.lat && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setExpandedMap(expandedMap === job._id ? null : job._id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      {expandedMap === job._id ? "Hide Map" : "View Location"}
                    </Button>

                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleNavigate(job.coordinates.lat, job.coordinates.lng)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      Navigate
                    </Button>
                  </>
                )}
              </div>

              {/* Map Preview */}
              {expandedMap === job._id && job.coordinates?.lat && (
                <div className="mt-4 rounded-2xl overflow-hidden border border-navy-700 animate-fade-in">
                  <MapContainer
                    center={[job.coordinates.lat, job.coordinates.lng]}
                    zoom={15}
                    style={{ height: "220px", width: "100%" }}
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
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default OpenJobs;