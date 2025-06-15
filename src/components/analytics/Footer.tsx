import React from "react";

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        padding: "1rem",
        textAlign: "center",
        background: "#f5f5f5",
        color: "black",
      }}
    >
      <span>
        &copy; {new Date().getFullYear()} Analytics App. All rights reserved.
      </span>
    </footer>
  );
};

export default Footer;
