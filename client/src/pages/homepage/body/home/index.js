import {memo, useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

const Home = () =>{
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const [loading, setLoading] = useState(true);
    const [logininfo, setlogininfo] = useState();

    useEffect(() => {
        const fetchLogininfo = async () => {
            try {
                const response = await fetch("http://localhost:5000/logininfo", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify()
                });
                const data = await response.json();
                const logininfo = data.logininfo;
                setlogininfo(logininfo);
                setLoading(false);
            } catch (error) {
                alert(error.message);
            }
        };

        fetchLogininfo();

        const intervalId = setInterval(fetchLogininfo, 30000);
        // Note
        return () => clearInterval(intervalId);
    },[username]);
    const handleLogin = () => {
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
                    <button onClick={() => handleRoom("living")} type="submit">Living room</button>
                    <button onClick={() => handleRoom("bed")} type="submit">Bedroom</button>
                    <button onClick={() => handleRoom("kitchen")} type="submit">Kitchen</button>
                    <button onClick={() => handleRoom("wc")} type="submit">WC</button>
                </div>
                <div>
                    <h2>Recent signing in</h2>
                    {loading ? (
                        <p>Loading</p>
                    ) : (
                        <ul>
                            {logininfo.map((info, index) => (
                                <li key={index}>
                                    <p>Username: {info.username}</p>
                                    <p>Time: {info.record_time}</p>
                                </li>
                            ))}
                        </ul>
                    )}
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