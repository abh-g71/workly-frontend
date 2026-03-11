import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow">
      <h1 className="text-xl font-semibold">Workly</h1>

      <div className="flex gap-6">
        <Link to="/dashboard" className="hover:text-blue-400">Dashboard</Link>
        <Link to="/open-jobs" className="hover:text-blue-400">Open Jobs</Link>
        <Link to="/my-client-jobs" className="hover:text-blue-400">Client Jobs</Link>
        <Link to="/my-worker-jobs" className="hover:text-blue-400">Worker Jobs</Link>
      </div>
    </div>
  );
}

export default Navbar;