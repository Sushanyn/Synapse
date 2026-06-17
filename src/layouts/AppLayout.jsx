// src/layouts/AppLayout.jsx
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer'; 

export default function AppLayout() {
    return (
        <div className="flex flex-col h-screen bg-[#0c0d0f] text-white">
            <Header />
            <main>
                <Outlet /> 
            </main>
            <Footer />
        </div>
    );
}