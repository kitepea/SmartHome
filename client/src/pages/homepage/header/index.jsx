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
  const navigateHome = () => {
    navigate("/home");
  };
  const navigateHistory = () => {
    navigate("/history");
  };

  return (
    <div className="containter">
      <header
        className="d-flex justify-content-between align-items-center p-1"
        style={{ background: "linear-gradient(to right, #4F41EF, #061A62)" }}
      >
        <img
          onClick={navigateHome}
          style={{
            objectFit: "cover",
            width: "200px",
            height: "100px",
            cursor: "pointer",
          }}
          src="logo.png"
          alt="Logo"
          className="logo"
        />
        <div className="d-flex align-items-center justify-content-between">
          <Button
            variant="link"
            className="text-white me-2"
            style={{ textDecoration: "none", cursor: "pointer" }}
            onClick={navigateHistory}
          >
            History
          </Button>
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
