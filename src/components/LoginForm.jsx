import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

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

        if (!result.error) {
            navigate('/home');
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

                <div className="mt-4 text-center">
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