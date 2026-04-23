import { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";
import { toast } from "react-toastify";
import Card from "../components/ui/Card";
import SkeletonCard from "../components/ui/SkeletonCard";
import EmptyState from "../components/ui/EmptyState";
import { useNavigate } from "react-router-dom";

function MyWorkerJobs() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/jobs/my-jobs", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setJobs(data.jobs);
        } else {
          toast.error(data.message || "Failed to fetch jobs");
        }
      } catch (error) {
        console.error(error);
        toast.error("Server error");
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchJobs();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="page-container">
        <h1 className="page-title">My Assigned Jobs</h1>
        <SkeletonCard count={3} />
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">My Assigned Jobs</h1>

      {jobs.length === 0 ? (
        <EmptyState
          icon="💼"
          title="No assigned jobs"
          description="You haven't been assigned any jobs yet. Browse open jobs and apply!"
          actionLabel="Browse Jobs"
          onAction={() => navigate('/open-jobs')}
        />
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job._id} className="animate-fade-in">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-lg font-bold text-txt-primary">{job.title}</h3>
                <StatusBadge status={job.status} />
              </div>

              {/* Client Info */}
              {job.client && (
                <div className="flex items-center gap-3 p-3 bg-navy-900 rounded-xl border border-navy-700 mb-3">
                  <div className="w-8 h-8 bg-accent-cyan/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-accent-cyan">{job.client.name?.charAt(0)?.toUpperCase() || 'C'}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-txt-primary">{job.client.name}</p>
                    {job.client.phone && (
                      <p className="text-xs text-txt-muted">{job.client.phone}</p>
                    )}
                  </div>
                </div>
              )}

              {/* In Progress Message */}
              {job.status === "IN_PROGRESS" && (
                <div className="flex items-center gap-2 p-3 bg-warning/10 border border-warning/20 rounded-xl">
                  <span className="text-lg">⏳</span>
                  <p className="text-sm text-warning font-medium">
                    Job in progress — client will mark it complete
                  </p>
                </div>
              )}

              {/* Completed Message */}
              {job.status === "COMPLETED" && (
                <div className="flex items-center gap-2 p-3 bg-success/10 border border-success/20 rounded-xl">
                  <span className="text-lg">🎉</span>
                  <p className="text-sm text-success font-medium">
                    Job completed successfully!
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyWorkerJobs;