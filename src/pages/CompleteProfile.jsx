import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function CompleteProfile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [hasProfile, setHasProfile] = useState(false);

  // Load existing profile if exists
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/workers/me", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await res.json();

        if (data.hasProfile) {
          setHasProfile(true);
          setSkills(data.profile.skills.join(", "));
          setExperience(data.profile.experience);
          setLocation(data.profile.location);
          setHourlyRate(data.profile.hourlyRate);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (user?.token) {
      fetchProfile();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = hasProfile
      ? "http://localhost:8000/api/workers/update"
      : "http://localhost:8000/api/workers/create";

    const method = hasProfile ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          skills: skills.split(",").map((s) => s.trim()),
          experience,
          location,
          hourlyRate,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(hasProfile ? "Profile updated successfully" : "Profile completed successfully");
        navigate("/dashboard");
      } else {
        alert(data.message || "Failed to save profile");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div>
      <h2>{hasProfile ? "Edit Profile" : "Complete Worker Profile"}</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Skills (comma separated)</label><br />
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g. plumbing, electrical, painting"
            required
          />
        </div>

        <br />

        <div>
          <label>Experience (years)</label><br />
          <input
            type="number"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label>Location</label><br />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Delhi"
            required
          />
        </div>

        <br />

        <div>
          <label>Hourly Rate (₹)</label><br />
          <input
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            required
          />
        </div>

        <br />

        <button type="submit">
          {hasProfile ? "Update Profile" : "Save Profile"}
        </button>
      </form>
    </div>
  );
}

export default CompleteProfile;