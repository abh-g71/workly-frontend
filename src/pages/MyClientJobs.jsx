import { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";
import socket from "../socket";
import { toast } from "react-toastify";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import SkeletonCard from "../components/ui/SkeletonCard";
import EmptyState from "../components/ui/EmptyState";
import { useNavigate } from "react-router-dom";

function MyClientJobs() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // Modal states
  const [acceptModal, setAcceptModal] = useState({ open: false, jobId: null, workerId: null, workerName: '' });
  const [completeModal, setCompleteModal] = useState({ open: false, jobId: null });
  const [rateModal, setRateModal] = useState({ open: false, jobId: null, rating: 0 });

  const fetchJobs = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/jobs/my-client-jobs", {
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

  useEffect(() => {
    if (user?.token) {
      fetchJobs();
      socket.on("jobUpdated", fetchJobs);
    }
    return () => { socket.off("jobUpdated", fetchJobs); };
  }, [user]);

  const handleAccept = async () => {
    const { jobId, workerId } = acceptModal;
    setActionLoading('accept');
    try {
      const res = await fetch(`http://localhost:8000/api/jobs/${jobId}/accept/${workerId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Worker accepted successfully! ✅");
        fetchJobs();
      } else {
        toast.error(data.message || "Failed to accept worker");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    } finally {
      setActionLoading(null);
      setAcceptModal({ open: false, jobId: null, workerId: null, workerName: '' });
    }
  };

  const handleComplete = async () => {
    const { jobId } = completeModal;
    setActionLoading('complete');
    try {
      const res = await fetch(`http://localhost:8000/api/jobs/${jobId}/complete`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Job marked as completed! 🎉");
        fetchJobs();
      } else {
        toast.error(data.message || "Failed to complete job");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    } finally {
      setActionLoading(null);
      setCompleteModal({ open: false, jobId: null });
    }
  };

  const handleRate = async () => {
    const { jobId, rating } = rateModal;
    if (!rating || rating < 1 || rating > 5) {
      toast.error("Rating must be between 1 and 5");
      return;
    }
    setActionLoading('rate');
    try {
      const res = await fetch(`http://localhost:8000/api/jobs/${jobId}/rate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ rating: Number(rating) }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Worker rated successfully! ⭐");
        fetchJobs();
      } else {
        toast.error(data.message || "Failed to rate worker");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    } finally {
      setActionLoading(null);
      setRateModal({ open: false, jobId: null, rating: 0 });
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <h1 className="page-title">My Jobs</h1>
        <SkeletonCard count={3} />
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">My Jobs</h1>

      {jobs.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No jobs yet"
          description="You haven't posted any jobs yet. Create one to get started!"
          actionLabel="Post a Job"
          onAction={() => navigate('/create-job')}
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

              {/* Actions */}
              <div className="flex flex-wrap gap-2 mb-4">
                {job.status === "IN_PROGRESS" && (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => setCompleteModal({ open: true, jobId: job._id })}
                  >
                    ✓ Mark Complete
                  </Button>
                )}

                {job.status === "COMPLETED" && !job.isRated && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setRateModal({ open: true, jobId: job._id, rating: 0 })}
                  >
                    ⭐ Rate Worker
                  </Button>
                )}
              </div>

              {/* Assigned Worker Rating */}
              {job.assignedWorker && (
                <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-navy-900 rounded-xl border border-navy-700">
                  <span className="text-sm text-txt-secondary">Assigned:</span>
                  <span className="text-sm font-medium text-txt-primary">{job.assignedWorker.name || 'Worker'}</span>
                  <span className="text-warning text-sm">⭐ {job.assignedWorker.rating?.toFixed(1) || "0"}</span>
                  <span className="text-xs text-txt-muted">({job.assignedWorker.ratingCount || 0} reviews)</span>
                </div>
              )}

              {/* Applications */}
              <div>
                <h4 className="text-sm font-semibold text-txt-secondary mb-3 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Applications ({job.applications?.length || 0})
                </h4>

                {job.applications && job.applications.length > 0 ? (
                  <div className="space-y-2">
                    {job.applications.map((app, index) => (
                      <div key={index} className="flex items-center justify-between gap-3 p-3 bg-navy-900 rounded-xl border border-navy-700">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 bg-accent-indigo/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-accent-indigo">{app.worker.name?.charAt(0)?.toUpperCase()}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-txt-primary truncate">{app.worker.name}</p>
                            <div className="flex items-center gap-1 text-xs text-txt-muted">
                              <span className="text-warning">⭐</span>
                              {app.worker.rating?.toFixed(1) || 0}
                              <span>({app.worker.ratingCount || 0})</span>
                            </div>
                          </div>
                        </div>

                        {job.status === "OPEN" && (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => setAcceptModal({
                              open: true,
                              jobId: job._id,
                              workerId: app.worker._id,
                              workerName: app.worker.name,
                            })}
                          >
                            Accept
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-txt-muted py-3 text-center bg-navy-900 rounded-xl border border-navy-700">
                    No applications yet
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Accept Modal */}
      <Modal
        isOpen={acceptModal.open}
        onClose={() => setAcceptModal({ open: false, jobId: null, workerId: null, workerName: '' })}
        onConfirm={handleAccept}
        title="Accept Worker?"
        confirmText="Accept"
        confirmVariant="success"
        loading={actionLoading === 'accept'}
      >
        <p>Are you sure you want to accept <strong className="text-txt-primary">{acceptModal.workerName}</strong> for this job? This will assign them to the job and notify them.</p>
      </Modal>

      {/* Complete Modal */}
      <Modal
        isOpen={completeModal.open}
        onClose={() => setCompleteModal({ open: false, jobId: null })}
        onConfirm={handleComplete}
        title="Mark Job Complete?"
        confirmText="Mark Complete"
        confirmVariant="success"
        loading={actionLoading === 'complete'}
      >
        <p>Are you sure this job is completed? You'll be able to rate the worker after confirming.</p>
      </Modal>

      {/* Rate Modal */}
      <Modal
        isOpen={rateModal.open}
        onClose={() => setRateModal({ open: false, jobId: null, rating: 0 })}
        onConfirm={handleRate}
        title="Rate Worker"
        confirmText="Submit Rating"
        confirmVariant="primary"
        loading={actionLoading === 'rate'}
      >
        <p className="mb-4">How would you rate the worker's performance?</p>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRateModal(prev => ({ ...prev, rating: star }))}
              className={`text-3xl transition-all duration-200 hover:scale-110 ${
                star <= rateModal.rating ? 'text-warning' : 'text-navy-600'
              }`}
            >
              ★
            </button>
          ))}
        </div>
        {rateModal.rating > 0 && (
          <p className="text-center mt-2 text-txt-primary font-semibold">{rateModal.rating} / 5</p>
        )}
      </Modal>
    </div>
  );
}

export default MyClientJobs;