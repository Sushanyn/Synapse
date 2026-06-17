import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"


export const LoginForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {login, loading, error} = useAuth()
    const navigate = useNavigate()

const handleSubmit = async(e) => {
    e.preventDefault()
    await login(email, password)

    if (!error) {
        navigate('/home')
    }
}
    return (
        <>
            <div className="flex flex-col gap-4 items-center justify-center w-full h-full my-10 min-w-[80%]">
                <div className="flex flex-row gap-4 items-center justify-center">
                    <img src="/logo-black.svg" alt="Logo" />
                    <h1>Synapse</h1>
                </div>
                <div>
                    <h1 className="text-[26px]">Welcome Back</h1>
                    <h3 className="text-gray-400 text-[13px]">Sign in to your workspace</h3>
                </div>
                <div>
                    <form onSubmit={handleSubmit} className="flex flex-col">
                        <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="border" required/>
                        <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" minLength={8} required/>
                        <button disabled={loading} className="bg-[#7EB8F7] px-2 py-2 text-center rounded hover:[#7ED9FF]">{loading ? 'Wait...' : 'Continue'}</button>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </form>
                </div>
            </div>
        </>
    )
}
