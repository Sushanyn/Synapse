import { Link } from 'react-router-dom';

export const ErrorPage = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1 className='text-[110px]'><span className='text-[#7EB8F7]'>404</span> - Page not found</h1>
            <p className='text-[40px]'>It seems you are lost</p>
            <Link to="/">Return to <span className='text-[#7EB8F7]'>Home</span> page</Link>
        </div>
    );
};