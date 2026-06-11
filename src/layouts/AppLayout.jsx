import React from 'react'
import { Outlet } from "react-router-dom";
import { Header, Footer, Sidebar } from "../components";

export default function AppLayout() {
    return (
        <div className="flex flex-col h-screen bg-[#13161B] overflow-hidden text-white">
            <Header></Header>
            <div>
                <Sidebar></Sidebar>
                <main>
                    <Outlet></Outlet>
                </main>                
            </div>
        </div>
    )
}