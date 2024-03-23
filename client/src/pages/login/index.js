import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';

const Login = () =>{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          const response = await fetch("http://localhost:5000/login", {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ username, password })
          });
  
          const data = await response.json();
  
          if (response.ok) {
              console.log("Đăng nhập thành công");
              navigate("/");
          } else {
              console.error("Tên đăng nhập hoặc mật khẩu không đúng");
          }
      } catch (error) {
          console.error("Đã xảy ra lỗi khi kiểm tra đăng nhập:", error);
      }
    }      
    
    return (
        <form onSubmit={handleSubmit}>
        <h2>Đăng nhập</h2>
        <label htmlFor="username">Tên đăng nhập:</label>
        <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleUsernameChange}
            required
        />
        <label htmlFor="password">Mật khẩu:</label>
        <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            required
        />
        <button type="submit">Đăng nhập</button>
    </form>
    );
}
export default Login;