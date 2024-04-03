import { memo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const username = localStorage.getItem("username");
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleShowPassword = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get("/profile", {
        params: { username },
      });
      setUser(response.data.user);
      setLoading(false);
    };

    fetchUser();
  }, [username]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login");
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.post("/profile", {
        ...user,
        username,
      });
      if (response.data.success) {
        console.log("Thông tin người dùng đã được cập nhật thành công");
        // Update local state to reflect changes (optional)
      } else {
        console.error(
          "Có lỗi xảy ra khi cập nhật thông tin người dùng:",
          response.data.message
        );
        // Display error message to the user
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi khi gửi yêu cầu đến máy chủ:", error);
      // Display a generic error message to the user
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("/change-password", {
        username,
        currentPassword,
        newPassword,
      });
      if (response.data.success) {
        alert("Mật khẩu đã được cập nhật thành công");
      } else {
        alert("Có lỗi xảy ra khi cập nhật mật khẩu:", response.data.message);
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Đã xảy ra lỗi khi gửi yêu cầu đến máy chủ:", error.message);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Tôi là {username}</p>
      <form onSubmit={handleUpdate}>
        <label>
          Email:
          <input
            type="email"
            value={user?.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </label>
        <br />
        <br />
        <label>
          Phone Number:
          <input
            type="tel"
            value={user?.phoneNumber}
            onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
          />
        </label>
        <br />
        <br />
        <button type="submit">Cập nhật thông tin</button>
      </form>
      <br />
      <h1>Change password</h1>
      <form onSubmit={handleChangePassword}>
        <label>
          Mật khẩu hiện tại:
          <input
            type={showPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </label>
        <br />
        <label>
          Mật khẩu mới:
          <input
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <button onClick={handleShowPassword}>
          {showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
        </button>
        <br />
        <button type="submit">Đổi mật khẩu</button>
      </form>
      <br />
      <button onClick={handleLogout}>Đăng xuất</button>
    </div>
  );
};

export default memo(Profile);
