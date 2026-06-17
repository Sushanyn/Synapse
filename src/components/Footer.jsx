import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="flex flex-col w-full mt-auto">
            <div className="relative bg-[#1A1E25] border-t border-[#4E5566] h-[50px] flex items-center text-[#4E5566] text-[13px] px-10">
                <span>&copy; {new Date().getFullYear()} Synapse made by Volodymyr Sushanyn</span>
                <div className="absolute right-10 flex gap-6">
                    <Link to="#" className='hover:text-white transition'>Privacy</Link>
                    <Link to="#" className="hover:text-white transition">Terms</Link>
                    <Link to="#" className='hover:text-white transition'>Cookies</Link>
                </div>
            </div>
        </footer>
    );
}