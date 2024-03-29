import {memo} from 'react'
import { useNavigate } from 'react-router-dom';

const Home = () =>{
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const handleLogin = async () => {
        navigate('/login');
    }
    
    const handleRoom = (roomname) => {
        navigate(`/${roomname}`);
    }

    if(username)
        return (
            <div>
                <h1>Home</h1>
                <div>
                    <button onClick={() => handleRoom("Living")} type="submit">Living room</button>
                    <button onClick={() => handleRoom("Bed")} type="submit">Bedroom</button>
                    <button onClick={() => handleRoom("Kitchen")} type="submit">Kitchen</button>
                    <button onClick={() => handleRoom("WC")} type="submit">WC</button>
                </div>
                <div>
                    <h2> Recent signing in </h2>
                </div>
            </div>
            
        )
    return(
        <div>
            <p>Bạn cần phải đăng nhập</p>
            <button onClick={handleLogin} type="submit">Đăng nhập</button>
        </div>
    )
}
export default memo(Home);