import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Registered successfully! Please login.");
        navigate("/login");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Register error:", error);
      setError("Server error. Please try again.")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-5">
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-navy-800 border border-navy-700 rounded-2xl p-8 shadow-card">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold gradient-text mb-2">Workly</h1>
            <p className="text-txt-secondary text-sm">Create your account</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-error/10 border border-error/30 text-error rounded-xl px-4 py-3 mb-6 text-sm flex items-center gap-2 animate-slide-up">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="label-dark">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input-dark"
              />
            </div>

            <div>
              <label className="label-dark">Phone Number</label>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                required
                className="input-dark"
              />
            </div>

            <div>
              <label className="label-dark">Password</label>
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-dark"
              />
            </div>

            {/* Role Toggle */}
            <div>
              <label className="label-dark">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("client")}
                  className={`py-3 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                    role === "client"
                      ? "bg-accent-indigo/15 border-accent-indigo text-accent-indigo shadow-glow-indigo"
                      : "bg-navy-900 border-navy-700 text-txt-secondary hover:border-navy-600"
                  }`}
                >
                  👤 Client
                </button>
                <button
                  type="button"
                  onClick={() => setRole("worker")}
                  className={`py-3 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                    role === "worker"
                      ? "bg-accent-cyan/15 border-accent-cyan text-accent-cyan shadow-glow-cyan"
                      : "bg-navy-900 border-navy-700 text-txt-secondary hover:border-navy-600"
                  }`}
                >
                  🔧 Worker
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gradient w-full flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              Create Account
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-6 text-txt-muted text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-accent-indigo font-semibold hover:text-accent-cyan transition-colors no-underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;