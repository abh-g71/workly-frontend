import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Guardroute from "./components/Guardroute";
import Navbar from "./components/NavBar";
import BottomNav from "./components/BottomNav";
import Spinner from "./components/ui/Spinner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Lazy loaded pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreateJob = lazy(() => import("./pages/CreateJob"));
const OpenJobs = lazy(() => import("./pages/OpenJobs"));
const MyClientJobs = lazy(() => import("./pages/MyClientJobs"));
const MyWorkerJobs = lazy(() => import("./pages/MyWorkerJobs"));
const CompleteProfile = lazy(() => import("./pages/CompleteProfile"));
const Notifications = lazy(() => import("./pages/Notifications"));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <Spinner size="lg" className="text-accent-indigo" />
        <p className="text-txt-secondary text-sm">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-navy-900">
      <Navbar />

      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={
            <Guardroute><Home /></Guardroute>
          } />

          <Route path="/dashboard" element={
            <Guardroute><Dashboard /></Guardroute>
          } />

          <Route path="/create-job" element={
            <Guardroute><CreateJob /></Guardroute>
          } />

          <Route path="/open-jobs" element={
            <Guardroute><OpenJobs /></Guardroute>
          } />

          <Route path="/worker-jobs" element={
            <Guardroute><MyWorkerJobs /></Guardroute>
          } />

          <Route path="/complete-profile" element={
            <Guardroute><CompleteProfile /></Guardroute>
          } />

          <Route path="/my-jobs" element={
            <Guardroute><MyClientJobs /></Guardroute>
          } />

          <Route path="/notifications" element={
            <Guardroute><Notifications /></Guardroute>
          } />
        </Routes>
      </Suspense>

      <BottomNav />

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="!bg-navy-800 !border !border-navy-700 !rounded-2xl !shadow-card"
      />
    </div>
  );
}

export default App;