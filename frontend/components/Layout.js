import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { FaHome, FaTags, FaUsers, FaKey } from "react-icons/fa"; // Örnek ikonlar
import { MdCategory } from "react-icons/md"; // Kategori ikonu
import { RiAdminFill } from "react-icons/ri"; // Rol ikonu

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.auth); // Kullanıcı bilgisi
  const router = useRouter();

  // Eğer kullanıcı giriş yapmamışsa giriş sayfasına yönlendirme
  if (!user) {
    router.push("/auth"); // Kullanıcı yoksa giriş sayfasına yönlendir
    return null;
  }

  const isActive = (path) => router.pathname === path; // Aktif menü kontrolü

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/5 bg-blue-600 text-white">
        {/* Kullanıcı Bilgileri */}
        <div className="p-4 flex items-center">
          <div className="w-16 h-16 bg-white rounded-full overflow-hidden">
            <img
              src={user.profilePicture || "/default-avatar.png"}
              alt="Avatar"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="ml-4">
            <h2 className="text-lg font-bold">{user.username}</h2>
            <p className="text-sm">{user.role}</p>
          </div>
        </div>

        {/* Menü */}
        <nav className="mt-6">
          <ul className="space-y-2">
            {/* Posts */}
            <li
              className={`flex items-center space-x-4 px-4 py-2 cursor-pointer rounded-lg ${
                isActive("/admin/posts") ? "bg-orange-500" : "hover:bg-blue-700"
              }`}
              onClick={() => router.push("/admin/posts")}
            >
              <FaHome size={20} />
              <span>Posts</span>
            </li>

            {/* Categories */}
            <li
              className={`flex items-center space-x-4 px-4 py-2 cursor-pointer rounded-lg ${
                isActive("/admin/categories") ? "bg-orange-500" : "hover:bg-blue-700"
              }`}
              onClick={() => router.push("/admin/categories")}
            >
              <MdCategory size={20} />
              <span>Categories</span>
            </li>

            {/* Tags */}
            <li
              className={`flex items-center space-x-4 px-4 py-2 cursor-pointer rounded-lg ${
                isActive("/admin/tags") ? "bg-orange-500" : "hover:bg-blue-700"
              }`}
              onClick={() => router.push("/admin/tags")}
            >
              <FaTags size={20} />
              <span>Tags</span>
            </li>

            {/* Users */}
            <li
              className={`flex items-center space-x-4 px-4 py-2 cursor-pointer rounded-lg ${
                isActive("/admin/users") ? "bg-orange-500" : "hover:bg-blue-700"
              }`}
              onClick={() => router.push("/admin/users")}
            >
              <FaUsers size={20} />
              <span>Users</span>
            </li>

          </ul>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-grow bg-white p-6">{children}</main>
    </div>
  );
};

export default Layout;
