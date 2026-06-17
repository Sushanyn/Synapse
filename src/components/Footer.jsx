import { Link } from "react-router-dom"
export default function Footer() {
    return(
        <>
            <footer className="flex flex-col w-full">
                <div className="flex flex-col justify-beetween items-center">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div className="relative bg-[#1A1E25] border-t border-[#4E5566] h-[50px] flex items-center text-[#4E5566]">
                    <span className="absolute left-10">&copy; {new Date().getFullYear()} Synapse made by Volodymyr Sushanyn</span>
                    <div className="absolute right-10 flex gap-4">
                        <Link className='hover:text-white transition'>Privacy</Link>
                        <Link className="hover:text-white transition">Terms</Link>
                        <Link className='hover:text-white transition'>Cookies</Link>
                    </div>
                </div>
            </footer>
        </>
    )
}
