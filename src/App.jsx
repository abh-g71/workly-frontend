//console.log("ProtectedRoute file loaded");

import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Guardroute from "./components/Guardroute";
import Dashboard from "./pages/Dashboard";
import CreateJob from "./pages/CreateJob";
import OpenJobs from "./pages/OpenJobs";
import MyClientJobs from "./pages/MyClientJobs";
import CompleteProfile from "./pages/CompleteProfile";
import MyWorkerJobs from "./pages/MyWorkerJobs";


function App() {

  return (
        <Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  <Route
    path="/"
    element={
      <Guardroute>
        <Home />
      </Guardroute>
    }
  />

  <Route
    path="/dashboard"
    element={
      <Guardroute>
        <Dashboard />
      </Guardroute>
    }
  />

  <Route
    path="/create-job"
    element={
      <Guardroute>
        <CreateJob />
      </Guardroute>
    }
  />
  
  <Route
  path="/open-jobs"
  element={
    <Guardroute>
      <OpenJobs />
    </Guardroute>
  }
/>
  <Route
  path="/my-jobs"
  element={
    <Guardroute>
      <MyClientJobs />
    </Guardroute>
  }
/>

<Route
  path="/complete-profile"
  element={
    <Guardroute>
      <CompleteProfile />
    </Guardroute>
  }
/>

<Route
  path="/my-jobs"
  element={
    <Guardroute>
      <MyWorkerJobs />
    </Guardroute>
  }
/>

</Routes>
  );

  
}

export default App;
