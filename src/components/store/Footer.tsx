import React from "react";

const Footer: React.FC = () => (
  <footer className="w-full bg-gray-900 text-gray-200 py-6 mt-12">
    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
      <div className="mb-4 md:mb-0">
        <span className="font-bold text-lg">StoreName</span>
        <span className="ml-2 text-sm text-gray-400">
          © {new Date().getFullYear()} All rights reserved.
        </span>
      </div>
      <div className="flex space-x-6">
        <a href="/about" className="hover:text-white transition-colors">
          About
        </a>
        <a href="/contact" className="hover:text-white transition-colors">
          Contact
        </a>
        <a href="/privacy" className="hover:text-white transition-colors">
          Privacy Policy
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
