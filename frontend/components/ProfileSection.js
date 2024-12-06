import React from "react";
import Image from "next/image";
import { FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import { useTheme } from "../src/context/ThemeContext"; // ThemeContext'ten değerleri alın

const ProfileSection = () => {
  const { darkMode } = useTheme(); // Dark mod bilgisi

  return (
    <div className="container mx-auto flex flex-col md:flex-row items-center justify-center md:justify-between p-8 bg-white shadow-lg rounded-lg space-y-8 md:space-y-0">
      {/* Metin Kısmı */}
      <div className="md:w-1/2 text-center md:text-left">
        <h1
          className={`text-4xl font-bold ${
            darkMode ? "text-[#0026CA]" : "text-[#304FFE]"
          }`}
        >
          Ceren Tanrıseven
        </h1>
        <p className="text-gray-700 mt-4 leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut feugiat
          vel urna eu tristique. Duis malesuada nisl vel orci aliquet, vel
          luctus justo ornare. Quisque venenatis, nunc a dignissim euismod, odio
          risus porttitor ligula, nec auctor ipsum velit non felis.
        </p>
        {/* Sosyal Medya */}
        <div
          className={`flex items-center justify-center md:justify-start space-x-4 mt-6 ${
            darkMode ? "text-[#0026CA]" : "text-[#304FFE]"
          }`}
        >
          <a href="#" aria-label="Twitter">
            <FaTwitter className="w-6 h-6" />
          </a>
          <a href="#" aria-label="Instagram">
            <FaInstagram className="w-6 h-6" />
          </a>
          <a href="#" aria-label="LinkedIn">
            <FaLinkedin className="w-6 h-6" />
          </a>
        </div>
      </div>

      {/* Görsel Kısmı */}
      <div className="md:w-1/2 flex justify-center">
        <Image
          src="/profile-image.png" // Public klasörüne koyulacak görsel
          alt="Ceren Tanrıseven"
          width={490}
          height={338}
          className="rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default ProfileSection;
