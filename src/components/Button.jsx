const Button = ({ children, onClick }) => {
    return (
        <button onClick={onClick} className="px-3 py-1.5 text-[13px] font-medium text-gray-300 bg-white/5 hover:text-white rounded transition-colors">{children}</button>
    )
}
export default Button
