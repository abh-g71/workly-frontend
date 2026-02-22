import { Navigate } from "react-router-dom";

function Guardroute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default Guardroute;