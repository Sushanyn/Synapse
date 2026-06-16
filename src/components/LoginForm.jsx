import { useState } from "react"
import { useAuth } from "../hooks/useAuth"


export const LoginForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {login, loading, error} = useAuth()

const handleSubmit = async(e) => {
    e.preventDefault()
    await login(email, password)
}
    return (
        <>
            <div>
                <div>
                    <img src="/logo-black.svg" alt="Logo" />
                </div>
                <div>
                    <h1>Welcome Back</h1>
                    <h3>Sign in to your workspace</h3>
                </div>
                <div>
                    <form onSubmit={handleSubmit}>
                        <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                        <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                        <button disabled={loading}>{loading ? 'Wait...' : 'Continue'}</button>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </form>
                </div>
            </div>
        </>
    )
}
