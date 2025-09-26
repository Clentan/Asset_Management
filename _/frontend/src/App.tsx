import { Navigate, Route, Routes } from "react-router-dom";
import Home from "@/pages/home/home.tsx";
import Signin from "./pages/signin/signin";
import OneTimeVerification from "./pages/otp/otp";
import { useContext } from "react";
import { OtpContext } from "./context/OTPContext";
import Dashboard from "./pages/dashboard";
import Overview from "./pages/dashboard/overview/overview";
import { Authcontext } from "./context/AuthContext";
import DashboardPending from "./components/dashboardLoading";

function App() {

  const {email} = useContext(OtpContext);
  const { isAuthenticated, isLoading } = useContext(Authcontext);

  if(isLoading) {
    return <DashboardPending />
  }

  return (
    <Routes>
        <Route index element={!isAuthenticated ? <Home /> : <Navigate to={"/dashboard"}/>}/>
        <Route path="/signin" element={isAuthenticated ? <Navigate to={"/dashboard"}/> : <Signin />}/>
        <Route path="/otpverification" element={email ? <OneTimeVerification /> : isAuthenticated ? <Navigate to={"/dashboard"}/> : <Navigate to={"/signin"}/>}/>
        <Route path="/dashboard/*" element={isAuthenticated ? <Dashboard /> : <Navigate to={"/signin"}/>}>
          <Route index element={<Overview />}/>
        </Route>
    </Routes>
  );
}

export default App;
