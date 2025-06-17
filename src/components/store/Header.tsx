"use client";
import React from "react";
import { useRouter } from "next/navigation";

const StoreHeader = () => {
  const router = useRouter();

  const handleCartClick = () => {
    router.push("/store/cart");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <h1
              className="text-2xl font-bold text-gray-900 trackable"
              id="store-logo"
            >
              ShopLogo
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="/"
              className="text-gray-600 hover:text-gray-900 trackable"
              id="nav-home"
            >
              Home
            </a>
            <a
              href="/store/browse"
              className="text-gray-900 font-medium trackable"
              id="nav-store"
            >
              Store
            </a>
            <a
              href="/about"
              className="text-gray-600 hover:text-gray-900 trackable"
              id="nav-about"
            >
              About
            </a>
            <a
              href="/contact"
              className="text-gray-600 hover:text-gray-900 trackable"
              id="nav-contact"
            >
              Contact
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button
              className="text-gray-600 hover:text-gray-900 trackable cursor-pointer"
              id="search-btn"
            >
              🔍
            </button>
            <button
              className="text-gray-600 hover:text-gray-900 trackable cursor-pointer"
              id="cart-btn"
              onClick={handleCartClick}
            >
              🛒
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 trackable cursor-pointer"
              id="login-btn"
            >
              Login
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-600 trackable cursor-pointer"
            id="mobile-menu-btn"
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
};

export default StoreHeader;
