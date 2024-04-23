import { memo } from "react";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login");
  };
  const navigateProfile = () => {
    navigate("/profile");
  };

  return (
    <div className="containter-fluid">
      <header
        className="d-flex justify-content-between align-items-center p-1 sticky-top"
        style={{ background: "linear-gradient(to right, #4F41EF, #061A62)" }}
      >
        <img
          style={{ objectFit: "cover", width: "200px", height: "100px" }}
          src="logo.png"
          alt="Logo"
          className="logo"
        />
        <div className="d-flex align-items-center justify-content-between">
          <div
            className="btn bg-primary rounded-circle text-white text-center me-4"
            onClick={navigateProfile}
          >
            {username ? username[0].toUpperCase() : "?"}
          </div>
          <Button
            variant="outline-primary"
            className="me-2"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </header>
    </div>
  );
};

export default memo(Header);
