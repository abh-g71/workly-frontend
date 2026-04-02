import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();

      if (res.ok) {
        const token = data.token;

        const resUser = await fetch("http://localhost:8000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = await resUser.json();
        userData.token = token;
        login(userData);
        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0f172a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    }}>
      <div style={{
        backgroundColor: "#1e293b",
        borderRadius: "16px",
        padding: "40px",
        width: "100%",
        maxWidth: "420px",
        boxShadow: "0 0 40px rgba(99, 102, 241, 0.15)",
        border: "1px solid #334155",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{
            fontSize: "32px",
            fontWeight: "800",
            background: "linear-gradient(90deg, #6366f1, #22d3ee)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
          }}>
            Workly
          </h1>
          <p style={{ color: "#94a3b8", marginTop: "8px", fontSize: "14px" }}>
            Sign in to your account
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: "#450a0a",
            border: "1px solid #ef4444",
            color: "#fca5a5",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "20px",
            fontSize: "14px",
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              color: "#94a3b8",
              fontSize: "13px",
              fontWeight: "600",
              marginBottom: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>
              Phone Number
            </label>
            <input
              type="text"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "white",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "28px" }}>
            <label style={{
              display: "block",
              color: "#94a3b8",
              fontSize: "13px",
              fontWeight: "600",
              marginBottom: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "white",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              background: loading
                ? "#334155"
                : "linear-gradient(90deg, #6366f1, #22d3ee)",
              border: "none",
              borderRadius: "8px",
              color: "white",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "opacity 0.2s",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Register Link */}
        <p style={{
          textAlign: "center",
          marginTop: "24px",
          color: "#64748b",
          fontSize: "14px",
        }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#6366f1", textDecoration: "none", fontWeight: "600" }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;