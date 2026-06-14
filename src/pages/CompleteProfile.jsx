import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { toast } from "react-toastify";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

function CompleteProfile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Load existing profile if exists
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/workers/me`, {
          headers: { Authorization: `Bearer ${user.token}` },
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
      } finally {
        setPageLoading(false);
      }
    };

    if (user?.token) {
      fetchProfile();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url = hasProfile
      ? `${import.meta.env.VITE_API_URL}/api/workers/update`
      : `${import.meta.env.VITE_API_URL}/api/workers/create`;

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
        toast.success(hasProfile ? "Profile updated! ✅" : "Profile completed! 🎉");
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Failed to save profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="page-container">
        <h1 className="page-title">Worker Profile</h1>
        <Card className="max-w-2xl">
          <div className="space-y-5">
            <div className="skeleton h-4 w-1/3 mb-2" />
            <div className="skeleton h-10 w-full" />
            <div className="skeleton h-4 w-1/3 mb-2" />
            <div className="skeleton h-10 w-full" />
            <div className="skeleton h-4 w-1/3 mb-2" />
            <div className="skeleton h-10 w-full" />
            <div className="skeleton h-4 w-1/3 mb-2" />
            <div className="skeleton h-10 w-full" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">
        {hasProfile ? "Edit Profile" : "Complete Your Profile"}
      </h1>

      <Card className="max-w-2xl animate-fade-in">
        {!hasProfile && (
          <div className="bg-accent-indigo/10 border border-accent-indigo/20 rounded-xl p-4 mb-6">
            <p className="text-sm text-accent-indigo">
              💡 Set up your worker profile to start receiving job matches. Your skills will be used to calculate match percentages.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label-dark">Skills</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. plumbing, electrical, painting"
              required
              className="input-dark"
            />
            <p className="text-xs text-txt-muted mt-1.5">Separate skills with commas, use lowercase</p>
          </div>

          <div>
            <label className="label-dark">Experience (years)</label>
            <input
              type="number"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="e.g. 5"
              required
              className="input-dark"
              min="0"
            />
          </div>

          <div>
            <label className="label-dark">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Delhi"
              required
              className="input-dark"
            />
          </div>

          <div>
            <label className="label-dark">Hourly Rate</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-txt-muted text-sm font-medium">₹</span>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="250"
                required
                className="input-dark pl-8"
                min="0"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="full"
            loading={loading}
          >
            {hasProfile ? "Update Profile" : "Save Profile"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default CompleteProfile;