import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Home = () => {
    const { user } = useAuth();

    return (
        <div className="w-full h-full min-h-[calc(100vh-100px)] bg-[#0c0d0f] text-white flex flex-col items-center">
        
        <div className="flex flex-col items-center justify-center text-center mt-20 mb-24 px-4 max-w-3xl">
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Where ideas connect and <span className="text-[#7EB8F7]">flow naturally</span>
            </h1>
            
            <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl">
            A node-based visual workspace for your team. Map out complex architectures, manage tasks on a Kanban board, and build faster together.
            </p>

            <div className="flex gap-4">
            <Link 
                to="/canvas" 
                className="bg-[#7EB8F7] text-black px-6 py-3 rounded-md font-medium hover:bg-[#7ED9FF] transition"
            >
                Open Workspace
            </Link>
            <a 
                href="#features" 
                className="bg-[#1a1c20] text-white border border-[#2d3035] px-6 py-3 rounded-md font-medium hover:bg-[#2d3035] transition"
            >
                Learn more
            </a>
            </div>
        </div>

        <div id="features" className="w-full max-w-6xl px-8 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-[#1a1c20] border border-[#2d3035] p-8 rounded-xl hover:border-[#7EB8F7]/50 transition-colors">
                <div className="w-12 h-12 bg-[#7EB8F7]/10 text-[#7EB8F7] flex items-center justify-center rounded-lg text-2xl mb-6">
                ⚲
                </div>
                <h3 className="text-xl font-semibold mb-3">Infinite Canvas</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                Drag, drop, and connect nodes on an endless board. Visualize your database structure, user flows, or brainstorming sessions without limits.
                </p>
            </div>

            <div className="bg-[#1a1c20] border border-[#2d3035] p-8 rounded-xl hover:border-[#7EB8F7]/50 transition-colors">
                <div className="w-12 h-12 bg-purple-500/10 text-purple-400 flex items-center justify-center rounded-lg text-2xl mb-6">
                ▤
                </div>
                <h3 className="text-xl font-semibold mb-3">Integrated Kanban</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                Turn your canvas ideas into actionable tasks. Move cards across custom columns to track your project's progress seamlessly.
                </p>
            </div>

            <div className="bg-[#1a1c20] border border-[#2d3035] p-8 rounded-xl hover:border-[#7EB8F7]/50 transition-colors">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 flex items-center justify-center rounded-lg text-2xl mb-6">
                ☁
                </div>
                <h3 className="text-xl font-semibold mb-3">Cloud Sync</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                Powered by a robust backend. Your workspaces are automatically saved and synced across all your devices in real-time.
                </p>
            </div>

            </div>
        </div>

        </div>
    );
};