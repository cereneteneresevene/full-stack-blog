import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router"; // Yönlendirme için
import { registerUser, loginUser, clearError } from "../../store/slices/authSlice";
import Navbar from "../../components/Navbar";
import { useTheme } from "../../src/context/ThemeContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Auth = () => {
  const { darkMode } = useTheme();
  const dispatch = useDispatch();
  const router = useRouter(); // useRouter'ı tanımlayın
  const { user, loading, error } = useSelector((state) => state.auth);

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(registerData));
    if (registerUser.fulfilled.match(result)) {
      toast.success("Kayıt başarılı! Giriş yapabilirsiniz.");
      setRegisterData({ username: "", email: "", password: "" });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(loginData));
    if (loginUser.fulfilled.match(result)) {
      toast.success("Giriş başarılı!");
      setLoginData({ email: "", password: "" });
      router.push("/"); // Anasayfaya yönlendirme
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error); // Hata mesajını toast olarak göster
      dispatch(clearError()); // Hata mesajını temizle
    }
  }, [error, dispatch]);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-[#0026CA]" : "bg-white"}`}>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-[90vh] flex items-center justify-center">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* Kayıt Ol */}
          <div
            className={`${
              darkMode ? "bg-[#0026CA]" : "bg-[#304FFE]"
            } text-white p-8 rounded-lg shadow-lg space-y-6`}
          >
            <h2 className="text-3xl font-bold">KAYIT OL</h2>
            <form className="space-y-4" onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Kullanıcı adınızı giriniz"
                value={registerData.username}
                onChange={(e) =>
                  setRegisterData({ ...registerData, username: e.target.value })
                }
                className="p-3 rounded-lg bg-white text-black w-full"
              />
              <input
                type="email"
                placeholder="Emailinizi giriniz"
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({ ...registerData, email: e.target.value })
                }
                className="p-3 rounded-lg bg-white text-black w-full"
              />
              <input
                type="password"
                placeholder="Şifrenizi belirleyiniz"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
                className="p-3 rounded-lg bg-white text-black w-full"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-white text-[#304FFE] px-4 py-2 rounded-lg w-full"
              >
                {loading ? "Kaydediliyor..." : "Kayıt Ol"}
              </button>
            </form>
          </div>

          {/* Giriş Yap */}
          <div
            className={`${
              darkMode ? "bg-white" : "bg-white"
            } text-[#304FFE] p-8 rounded-lg shadow-lg space-y-6`}
          >
            <h2
              className={`text-3xl font-bold ${
                darkMode ? "text-[#304FFE]" : "text-[#304FFE]"
              }`}
            >
              GİRİŞ YAP
            </h2>
            <form className="space-y-4" onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Emailinizi giriniz"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                className={`p-3 rounded-lg w-full ${
                  darkMode
                    ? "bg-[#304FFE] text-white"
                    : "bg-[#304FFE] text-white"
                }`}
              />
              <input
                type="password"
                placeholder="Şifrenizi belirleyiniz"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                className={`p-3 rounded-lg w-full ${
                  darkMode
                    ? "bg-[#304FFE] text-white"
                    : "bg-[#304FFE] text-white"
                }`}
              />
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 rounded-lg w-full ${
                  darkMode
                    ? "bg-[#304FFE] text-white"
                    : "bg-[#304FFE] text-white"
                }`}
              >
                {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
