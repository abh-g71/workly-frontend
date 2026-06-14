import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { toast } from "react-toastify";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

// Fix default marker icon issue with leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function CreateJob() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLocationLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoordinates({ lat, lng });

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          );
          const data = await res.json();
          setLocation(data.display_name || `${lat}, ${lng}`);
        } catch (error) {
          setLocation(`${lat}, ${lng}`);
        }

        setLocationLoading(false);
      },
      (error) => {
        setError("Could not get your location. Please allow location access.");
        setLocationLoading(false);
      }
    );
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    if (!coordinates) {
      setError("Please use your location first before creating the job");
      return;
    }

    setSubmitLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          title,
          description,
          requiredSkills: requiredSkills.split(",").map((s) => s.trim()),
          location,
          coordinates,
          budget,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Job created successfully! 🎉");
        navigate("/dashboard");
      } else {
        setError(data.message || "Failed to create job");
      }
    } catch (error) {
      console.error("Create job error:", error);
      setError("Server error. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Create a Job</h1>

      <Card className="max-w-2xl animate-fade-in">
        {/* Error */}
        {error && (
          <div className="bg-error/10 border border-error/30 text-error rounded-xl px-4 py-3 mb-6 text-sm flex items-center gap-2 animate-slide-up">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleCreate} className="space-y-5">
          <div>
            <label className="label-dark">Job Title</label>
            <input
              type="text"
              placeholder="e.g. Fix Kitchen Plumbing"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="input-dark"
            />
          </div>

          <div>
            <label className="label-dark">Description</label>
            <textarea
              placeholder="Describe the job in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="input-dark resize-none"
            />
          </div>

          <div>
            <label className="label-dark">Required Skills</label>
            <input
              type="text"
              placeholder="e.g. plumbing, pipe fitting, soldering"
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
              required
              className="input-dark"
            />
            <p className="text-xs text-txt-muted mt-1.5">Separate skills with commas</p>
          </div>

          <div>
            <label className="label-dark">Budget (₹)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-txt-muted text-sm">₹</span>
              <input
                type="number"
                placeholder="500"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
                className="input-dark pl-8"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="label-dark">Location</label>
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleGetLocation}
              loading={locationLoading}
              className="mb-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {locationLoading ? "Detecting..." : "Use My Location"}
            </Button>

            {location && (
              <div className="flex items-start gap-2 p-3 bg-navy-900 rounded-xl border border-navy-700 mb-3">
                <span className="text-accent-cyan mt-0.5">📌</span>
                <p className="text-xs text-txt-secondary leading-relaxed">{location}</p>
              </div>
            )}
          </div>

          {/* Map Preview */}
          {coordinates && (
            <div className="rounded-2xl overflow-hidden border border-navy-700 animate-fade-in">
              <MapContainer
                center={[coordinates.lat, coordinates.lng]}
                zoom={15}
                style={{ height: "250px", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                <Marker position={[coordinates.lat, coordinates.lng]}>
                  <Popup>Job Location</Popup>
                </Marker>
              </MapContainer>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="full"
            loading={submitLoading}
          >
            Create Job
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default CreateJob;