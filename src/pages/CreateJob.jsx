import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setCoordinates({ lat, lng });

        // Convert lat/lng to address using OpenStreetMap
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
        alert("Could not get your location. Please allow location access.");
        setLocationLoading(false);
      }
    );
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!coordinates) {
      alert("Please use your location first before creating the job");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/jobs/create", {
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
        alert("Job created successfully");
        navigate("/dashboard");
      } else {
        alert(data.message || "Failed to create job");
      }
    } catch (error) {
      console.error("Create job error:", error);
      alert("Server error");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Job</h2>

      <form onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br /><br />

        <textarea
          placeholder="Job Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="text"
          placeholder="Required Skills (comma separated)"
          value={requiredSkills}
          onChange={(e) => setRequiredSkills(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="number"
          placeholder="Budget (₹)"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          required
        />
        <br /><br />

        {/* Location Section */}
        <div>
          <button
            type="button"
            onClick={handleGetLocation}
            disabled={locationLoading}
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {locationLoading ? "Detecting Location..." : "📍 Use My Location"}
          </button>

          {location && (
            <p style={{ marginTop: "8px", color: "#6b7280" }}>
              📌 {location}
            </p>
          )}
        </div>

        <br />

        {/* Map Preview */}
        {coordinates && (
          <div style={{ marginBottom: "20px" }}>
            <MapContainer
              center={[coordinates.lat, coordinates.lng]}
              zoom={15}
              style={{ height: "300px", width: "100%", borderRadius: "12px" }}
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

        <button
          type="submit"
          style={{
            backgroundColor: "#10b981",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Create Job
        </button>
      </form>
    </div>
  );
}

export default CreateJob;