import {memo} from 'react'
import { useNavigate } from 'react-router-dom';

const Profile = () =>{
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const handleLogin = async () => {
        navigate('/login');
    }

    if(username)
        return <h1>Home</h1>
    return(
        <div>
            <p>Bạn cần phải đăng nhập</p>
            <button onClick={handleLogin} type="submit">Đăng nhập</button>
        </div>
    )
}
export default memo(Profile);