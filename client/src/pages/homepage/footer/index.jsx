import { memo } from "react";

const Footer = () => {
  return (
    <footer
      className="d-flex justify-content-center align-items-center p-3"
      style={{ background: "linear-gradient(to right, #4F41EF, #061A62)" }}
    >
      <div className="text-white">Đồ Án Thực tập Đa ngành L01_CNPM_35</div>
    </footer>
  );
};

export default memo(Footer);
