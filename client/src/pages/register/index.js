import React, {useState} from "react";
import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber , setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username || !email || !phoneNumber || !password || !confirmPassword)
      alert("Vui lòng điền đầy đủ thông tin.")
    else{
      if (password !== confirmPassword) {
        alert("Mật khẩu xác nhận không đúng");
        return;
      }
      if(password.length < 6){
        alert("Mật khẩu có độ dài tối thiểu là 6");
        return;
      }
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          phoneNumber ,
          password,
        }),
      });
      const data = await response.json();
      alert(data.message);
      if(response.ok)
        navigate("/login");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          className="form-control"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="phone-number">Phone number</label>
        <input
          type="tel"
          id="phone-number"
          className="form-control"
          value={phoneNumber }
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          className="form-control"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Register
      </button>
    </form>
  );
};

export default Register;
