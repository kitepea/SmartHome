import { memo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import "./style.css";

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
    <div className="container mt-4">
      <div className="d-flex flex-column">
        <div className="row justify-content-around">
          <div className="col-lg-5 col-md-12 box-card text-center">
            <h4>Profile</h4>
            <div className="mt-3">
              <img
                style={{ objectFit: "cover" }}
                src="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="rounded-circle"
                alt="Profile"
                width="150"
                height="150"
              />
            </div>
            <table className="table table-striped table-bordered mt-4 table-hover mx-1">
              <thead className="table-dark">
                <tr>
                  <th scope="col">Tên đăng nhập</th>
                  <th scope="col">Vai trò</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{username}</td>
                  <td>Member</td>
                </tr>
              </tbody>
            </table>
            <button
              className="btn btn-danger mx-auto mt-5"
              style={{ width: "100px" }}
              onClick={handleLogout}
            >
              Đăng xuất
            </button>
          </div>
          <div className="col-lg-6 col-md-12 box-card">
            <h2 className="">Basic Info</h2>
            <div className="divider my-3"></div>
            <form onSubmit={handleUpdate}>
              <div className="row">
                <div className="col-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="form-label me-auto fw-medium"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={user?.email}
                      onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="form-label fw-medium"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phoneNumber"
                      value={user?.phoneNumber}
                      onChange={(e) =>
                        setUser({ ...user, phoneNumber: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="text-center mt-4">
                <button className="btn btn-success" type="submit">
                  Cập nhật thông tin
                </button>
              </div>
            </form>
            <br />
            <h3>Change password</h3>
            <div className="divider my-3"></div>
            <form onSubmit={handleChangePassword} class="mb-3">
              <div class="mb-3">
                <label for="currentPassword" class="form-label">
                  Mật khẩu hiện tại:
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  class="form-control"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div class="mb-3">
                <label for="newPassword" class="form-label">
                  Mật khẩu mới:
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  class="form-control"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <button
                onClick={handleShowPassword}
                class="btn btn-secondary mb-3"
              >
                {showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
              </button>
              <div className="text-center">
                <button type="submit" class="btn btn-primary">
                  Đổi mật khẩu
                </button>
              </div>
            </form>
            <br />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Profile);
