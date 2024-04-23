import { memo } from "react";
import "./style.css";

const Footer = () => {
  return (
    <footer
      className="d-flex justify-content-center align-items-center p-3 footer"
      style={{
        background: "linear-gradient(to right, #4F41EF, #061A62)",
        marginBottom: "0px",
      }}
    >
      <div className="text-white">Đồ Án Thực tập Đa ngành L01_CNPM_35</div>
    </footer>
  );
};

export default memo(Footer);
