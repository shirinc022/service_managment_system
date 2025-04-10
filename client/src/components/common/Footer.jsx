import React from "react";

function Footer() {
  return (
    <footer class="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4">
      <aside>
        <p>
          Copyright © {new Date().getFullYear()} - All right reserved by Homely
          Services
        </p>
      </aside>
    </footer>
  );
}

export default Footer;
