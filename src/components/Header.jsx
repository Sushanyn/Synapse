import { Button, Status } from '../components'; 
import { NavLink } from "react-router-dom";
import { useAuth } from '../hooks/useAuth';

export default function Header() {
    const { user, logout } = useAuth();

    return (
        <header className='flex justify-between items-center h-12 bg-[#1a1c20] w-full px-4 border-b border-[#2d3035]'>
            <div className='flex items-center'>
                <NavLink to='/home' className='flex items-center gap-2 cursor-pointer'>
                    <img src="/logo-black.svg" alt="Logo" className="p-2"/>
                    <span className='text-[13px] font-medium text-white'>Synapse</span>
                </NavLink>
            </div>
            
            <nav className='flex items-center gap-4 text-[13px] text-gray-400'>
                {user ? (
                    <>
                        <NavLink to='/home' className='hover:text-white transition'>Home</NavLink>
                        <NavLink to='/canvas' className='hover:text-white transition'>Canvas</NavLink>
                        <NavLink to='/kanban' className='hover:text-white transition'>Kanban</NavLink>
                        <button onClick={logout} className='hover:text-white transition cursor-pointer'>Logout</button>
                    </>
                ) : (
                    <NavLink to='/auth' className='hover:text-white transition'>Login</NavLink>
                )}
            </nav>
            
            <div className='flex gap-2 ml-6'>
                <Button></Button>
                <Button></Button>
            </div>

            <div className='flex items-center ml-6'>
                <Status></Status>
            </div>

            {user && (
                <div className='w-6 h-6 bg-[#3b2a4a] flex items-center justify-center rounded-full font-semibold tracking-wider cursor-pointer ml-4'>
                    <span className="text-white text-xs">{user.email[0].toUpperCase()}</span>
                </div>
            )}
        </header>
    );
}