import { ReactElement } from "react";
import { Outlet } from "react-router-dom";

export default function MainContent(): ReactElement {
    return (
        <main className="ps-[19dvw] pt-[5rem] pe-10">
            <Outlet />
        </main>
    )
}