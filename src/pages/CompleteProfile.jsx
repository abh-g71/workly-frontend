import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function CompleteProfile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:8000/api/workers/create",
        {
          method: "POST",
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
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Profile completed successfully");
        navigate("/dashboard");
      } else {
        alert(data.message || "Failed to create profile");
      }

    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div>
      <h2>Complete Worker Profile</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Skills (comma separated)</label><br />
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Experience (years)</label><br />
          <input
            type="number"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Location</label><br />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Hourly Rate</label><br />
          <input
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            required
          />
        </div>

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
}

export default CompleteProfile;