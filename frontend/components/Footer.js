import React from "react";
import { FaLinkedin, FaTwitter } from "react-icons/fa";
import Image from "next/image";
import { useTheme } from "../src/context/ThemeContext"; // ThemeContext'i import edin

const Footer = () => {
  const { darkMode } = useTheme(); // darkMode'u context'ten alın

  return (
    <footer
      className={`${
        darkMode ? "bg-[#0026CA]" : "bg-[#304FFE]"
      } text-white py-12 transition-colors duration-300`}
    >
      <div className="container mx-auto text-center space-y-6">
        {/* Logo ve Başlık */}
        <div>
          <h1 className="text-3xl font-bold">Write.</h1>
          <p className="text-sm mt-4 text-white/80">
            We're a diverse and passionate team that takes ownership of your
            design and empower you to execute the roadmap. We stay light on our
            feet and truly enjoy delivering great work.
          </p>
        </div>

        {/* Butonlar */}
        <div className="flex justify-center space-x-4 mt-6">
          <button className="bg-white text-blue-600 px-4 py-2 rounded-full shadow hover:bg-gray-100">
            🧠 Insights
          </button>
          <button className="bg-white text-blue-600 px-4 py-2 rounded-full shadow hover:bg-gray-100">
            ✨ Contact
          </button>
        </div>

        {/* Çizgi */}
        <hr className="my-6 border-t border-white/30 w-3/4 mx-auto" />

        {/* Logo ve Copyright */}
        <div className="flex justify-center items-center space-x-4">
          <Image
            src={darkMode ? "/2.png" : "/1.png"}
            alt="Logo"
            width={50}
            height={50}
            className="rounded-full"
          />
          <p className="text-sm text-white/80">© 2024 Write. All Rights Reserved.</p>
        </div>

        {/* Sosyal Medya */}
        <div className="flex justify-center space-x-6 mt-4">
          <a href="#" aria-label="LinkedIn" className="text-white hover:text-gray-300">
            <FaLinkedin size={20} />
          </a>
          <a href="#" aria-label="Twitter" className="text-white hover:text-gray-300">
            <FaTwitter size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
