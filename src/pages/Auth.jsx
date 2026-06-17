import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const Auth = () => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const { login, register, loading, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        
        let result;
        if (isLoginMode) {
            result = await login(email, password);
        } else {
            result = await register(email, password);
        }

        if (!result.error) {
            navigate('/home');
        }
    };

    return (
        <div className="flex flex-col gap-6 items-center justify-center w-full h-full min-h-[calc(100vh-100px)] py-10 bg-[#0c0d0f] text-white">
            
            <div className="flex flex-row gap-4 items-center justify-center">
                <img src="/logo-black.svg" alt="Logo" className="w-10 h-10"/>
                <h1 className="text-3xl font-bold">Synapse</h1>
            </div>
            
            <div className="text-center">
                <h1 className="text-[26px] font-semibold">
                    {isLoginMode ? 'Welcome back' : 'Create an account'}
                </h1>
                <h3 className="text-gray-400 text-[13px] mt-1">
                    {isLoginMode ? 'Sign in to your workspace' : 'Get started with Synapse'}
                </h3>
            </div>
            
            <div className="w-full max-w-sm">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input 
                        type="email" 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="Email" 
                        className="bg-[#1a1c20] text-sm text-white px-4 py-2.5 rounded-md border border-[#2d3035] outline-none focus:border-[#7EB8F7]" 
                        required
                    />
                    <input 
                        type="password" 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Password" 
                        minLength={8} 
                        className="bg-[#1a1c20] text-sm text-white px-4 py-2.5 rounded-md border border-[#2d3035] outline-none focus:border-[#7EB8F7]" 
                        required
                    />
                    
                    <button 
                        disabled={loading} 
                        className="bg-[#7EB8F7] px-4 py-2.5 mt-2 text-center text-black font-semibold text-sm rounded-md hover:bg-[#7ED9FF] transition disabled:opacity-50"
                    >
                        {loading ? 'Wait...' : 'Continue'}
                    </button>
                    
                    {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
                </form>

                <div className="mt-6 flex flex-col gap-3">
                    <button className="flex items-center justify-center gap-3 bg-white text-black text-sm px-4 py-2.5 rounded-md hover:bg-gray-200 transition">
                        <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="w-5 h-5"/>
                        Continue with Google
                    </button>
                </div>

                <div className="mt-6 text-center">
                    <button 
                        onClick={() => setIsLoginMode(!isLoginMode)}
                        className="text-[13px] text-gray-500 hover:text-white transition"
                    >
                        {isLoginMode ? "Don't have an account? Create one" : "Already have an account? Sign in"}
                    </button>
                </div>
            </div>
        </div>
    );
};