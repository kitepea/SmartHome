import {memo} from 'react'
import { useNavigate } from 'react-router-dom';

// Get from users in dbs
const Profile = () =>{
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('username');
        navigate('/login');
    };
    return (
        <div>
            <h1>Profile</h1>
            <p>Tôi là {username}</p>
            <button onClick={handleLogout}>Đăng xuất</button>
        </div>
    )
}
export default memo(Profile);