import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function CreateJob() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:8000/api/jobs/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            title,
            description,
            requiredSkills,
            location,
            budget,
          }),
        }
      );

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
    <div>
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
          placeholder="Required Skills"
          value={requiredSkills}
          onChange={(e) => setRequiredSkills(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="number"
          placeholder="Budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          required
        />
        <br /><br />

        <button type="submit">Create Job</button>
      </form>
    </div>
  );
}

export default CreateJob;