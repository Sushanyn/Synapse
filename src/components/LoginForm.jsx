import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";

export const LoginForm = () => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const { login, register, loading, error } = useAuth(); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        let result;
        if (isLoginMode) {
            result = await login(email, password);
        } else {
            result = await register(email, password);
        }

        if (!result?.error) {
            navigate('/home');
        }
    };
    
    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/home` 
            }
        });

        if (error) {
            console.error("Google Login Error:", error.message);
            alert("Error logging in with Google");
        }
    };

    return (
        <div className="flex flex-col gap-4 items-center justify-center w-full h-full my-10 min-w-[80%]">
            <div className="flex flex-row gap-4 items-center justify-center">
                <img src="/logo-black.svg" alt="Logo" />
                <h1 className="text-2xl font-bold">Synapse</h1>
            </div>
            
            <div className="text-center">
                <h1 className="text-[26px]">
                    {isLoginMode ? 'Welcome Back' : 'Create an Account'}
                </h1>
                <h3 className="text-gray-400 text-[13px]">
                    {isLoginMode ? 'Sign in to your workspace' : 'Sign up to get started'}
                </h3>
            </div>
            
            <div className="w-full max-w-sm">
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input 
                        type="email" 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="Email" 
                        className="border rounded px-3 py-2 outline-none focus:border-[#7EB8F7]" 
                        required
                    />
                    <input 
                        type="password" 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Password" 
                        minLength={8} 
                        className="border rounded px-3 py-2 outline-none focus:border-[#7EB8F7]" 
                        required
                    />
                    
                    <button 
                        disabled={loading} 
                        className="bg-[#7EB8F7] px-2 py-2 mt-2 text-center text-white font-medium rounded hover:bg-[#7ED9FF] transition disabled:opacity-50"
                    >
                        {loading ? 'Wait...' : 'Continue'}
                    </button>
                    
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                </form>

                <div className="flex items-center my-5 w-full">
                    <div className="flex-1 h-[1px] bg-gray-200" />
                    <span className="text-[11px] text-gray-400 px-3 font-bold uppercase tracking-wider">or continue with</span>
                    <div className="flex-1 h-[1px] bg-gray-200" />
                </div>

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-black font-medium text-sm py-2 px-4 rounded hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google
                </button>

                <div className="mt-5 text-center">
                    <button 
                        onClick={() => setIsLoginMode(!isLoginMode)}
                        className="text-[13px] text-gray-500 hover:text-black transition"
                    >
                        {isLoginMode ? "Don't have an account? Sign up" : "Already have an account? Log in"}
                    </button>
                </div>
            </div>
        </div>
    );
}