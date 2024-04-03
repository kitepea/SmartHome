import { memo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const username = localStorage.getItem("username");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get("/profile", {
        params: { username },
      });
      setUser(response.data.user); // Cập nhật trạng thái user với dữ liệu được trả về
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
      <button onClick={handleLogout}>Đăng xuất</button>
    </div>
  );
};

export default memo(Profile);
