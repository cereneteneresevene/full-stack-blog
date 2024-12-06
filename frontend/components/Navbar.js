import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaMoon, FaSun, FaUserAlt } from "react-icons/fa";
import Image from "next/image";
import { useTheme } from "../src/context/ThemeContext";
import axios from "axios";
import Link from "next/link";
import { logout } from "../store/slices/authSlice"; // Redux'tan logout işlemi

const Navbar = ({ setSelectedCategory, setSearchQuery }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const { darkMode, toggleDarkMode } = useTheme();

  // Redux state
  const { user } = useSelector((state) => state.auth); // Kullanıcı bilgisi
  const dispatch = useDispatch();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value); // Üst bileşene arama sorgusunu gönder
  };

  const handleLogout = () => {
    dispatch(logout()); // Kullanıcıyı çıkış yaptır
  };

  useEffect(() => {
    // Kategorileri API'den çekme
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Kategoriler alınamadı:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <nav
      className={`${
        darkMode ? "bg-[#0026CA]" : "bg-[#304FFE]"
      } text-white transition-colors duration-300`}
    >
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Image
            src={darkMode ? "/2.png" : "/1.png"}
            alt="Logo"
            width={50}
            height={40}
            className="rounded-full"
          />
        </div>

        {/* Menü */}
        <ul className="hidden md:flex space-x-6 text-lg ml-56">
          <li>
            <a href="/" className="hover:text-gray-300 underline underline-offset-8">
              Anasayfa
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-300 underline underline-offset-8">
              Hakkımda
            </a>
          </li>
          <li className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="hover:text-gray-300 underline underline-offset-8 flex items-center"
            >
              Kategoriler <span className="ml-2">▼</span>
            </button>
            {/* Dropdown */}
            {isDropdownOpen && (
              <ul className="absolute top-10 left-0 bg-white text-black shadow-lg rounded p-2 w-40">
                {categories.map((category) => (
                  <li
                    key={category._id}
                    className="hover:bg-gray-100 px-2 py-1 cursor-pointer"
                    onClick={() => setSelectedCategory(category.name)} // Kategori seçildiğinde üst bileşene bildirilir
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>

        {/* Input ve Butonlar */}
        <div className="flex items-center space-x-4 flex-1 justify-end">
          {/* Input */}
          <div className="flex items-center border-b border-white w-full max-w-xs">
            <input
              type="text"
              placeholder="Blog ara..."
              className="appearance-none bg-transparent border-none w-full text-white placeholder-white py-1 px-2 leading-tight focus:outline-none"
              onChange={handleSearch}
            />
            <button className="text-white px-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.9 14.32a8 8 0 111.414-1.414l4.243 4.243a1 1 0 01-1.415 1.415l-4.243-4.243zM8 14a6 6 0 100-12 6 6 0 000 12z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Dark Mode */}
          <button
            onClick={toggleDarkMode}
            className="p-2 bg-white rounded-full text-blue-600 hover:bg-gray-100"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          {/* Kullanıcı Girişi */}
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-white">{user.username}</span>
              {/* Blog Oluştur Butonu */}
              {(user.role === "writer" || user.role === "admin") && (
                <Link href="/create-blog">
                  <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    Blog Oluştur
                  </button>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Çıkış Yap
              </button>
            </div>
          ) : (
            <button className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 flex items-center space-x-2">
              <FaUserAlt />
              <Link href="/auth">Sign up / Login</Link>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
