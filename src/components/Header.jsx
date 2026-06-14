import { Button, Status } from '../components'
import { NavLink } from "react-router-dom"

export default function Header() {
    return (
        <>
            <header className='flex justify-between items-center h-12 bg-[#1a1c20] w-full px-4'>
                <div className='flex items-center'>
                    <NavLink to='home' className='flex items-center gap-2 cursor-pointer'>
                        <img src="/logo-black.svg" alt="Logo" className="p-2"/>
                        <span className='text-[13px] font-medium text-white'>Synapse</span>
                    </NavLink>
                </div>
                <nav className='flex items-center gap-4 text-[13px] text-gray-400'>
                    <NavLink to='/home' className='hover:text-white'>Home</NavLink>
                    <NavLink to='/canvas' className='hover:text-white'>Canvas</NavLink>
                    <NavLink to='/login' className='hover:text-white'>Login</NavLink>
                </nav>
                <span className='text-[13px] text-gray-400 ml-6'>Test name</span>

                <div className='flex gap-2 ml-6'>
                    <Button></Button>
                    <Button ></Button>
                </div>

                <div className='flex items-center'>
                    <Status></Status>
                </div>

                <div className='w-6 h-6 bg-[#3b2a4a] flex items-center justify-center rounded-full font-semibold tracking-wider cursor-pointer'>
                </div>
            </header>
        </>
    )
}
