import DashboardPending from "@/components/dashboardLoading";
import { Authcontext } from "@/context/AuthContext";
import MainContent from "@/layouts/dashboard/maincontent";
import Navbar from "@/layouts/dashboard/navbar";
import SideBar from "@/layouts/dashboard/sidebar";
import { ReactElement, useContext } from "react";
import { Outlet } from "react-router-dom";

export default function Dashboard(): ReactElement {


    return (
        <>
            <SideBar />
            <Navbar />
            <MainContent />
        </>
    )
}