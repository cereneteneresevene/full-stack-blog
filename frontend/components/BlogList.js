import React from "react";
import Link from "next/link";
import { useTheme } from "../src/context/ThemeContext";

const BlogList = ({ blogs }) => {
  const { darkMode } = useTheme();

  return (
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 p-4">
      {/* Sol tarafta tüm bloglar */}
      <div className="col-span-2">
        <h1 className={`text-2xl font-bold mb-4 ${darkMode ? "text-[#0026CA]" : "text-[#304FFE]"}`}>
          Tüm Blog Yazıları
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {blogs.map((blog) => (
            <Link href={`/blog/${blog._id}`} key={blog._id} legacyBehavior>
              <div
                className={`p-4 border rounded shadow hover:shadow-lg transition-shadow cursor-pointer ${
                  darkMode ? "bg-[#0026CA] text-white" : "bg-[#304FFE] text-white"
                }`}
              >
                {blog.image && (
                  <img
                    src={`http://localhost:5000${blog.image}`}
                    alt={blog.title}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                )}
                <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-white"}`}>
                  {blog.title}
                </h2>
                <p className="text-sm text-gray-100">{new Date(blog.createdAt).toLocaleDateString()}</p>
                <p className="text-gray-200">{blog.content.slice(0, 100)}...</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Sağ tarafta sadece başlıklar */}
      <div className="col-span-1">
        <h2 className={`text-xl font-bold mb-4 ${darkMode ? "text-[#0026CA]" : "text-[#304FFE]"}`}>
          Son Yazılar
        </h2>
        <ul className="space-y-4">
          {blogs.slice(0, 5).map((blog) => (
            <Link href={`/blog/${blog._id}`} key={blog._id} legacyBehavior>
              <li
                className={`hover:underline cursor-pointer ${
                  darkMode ? "text-[#0026CA]" : "text-[#304FFE]"
                }`}
              >
                {blog.title}
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BlogList;
