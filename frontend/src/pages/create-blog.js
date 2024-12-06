import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBlog } from "../../store/slices/blogSlice";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";

const CreateBlog = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.blogs);
  const { user, token } = useSelector((state) => state.auth); // Redux'tan kullanıcı ve token bilgisi alınır

  const [blogData, setBlogData] = useState({
    title: "",
    content: "",
    tagNames: "",
    categoryNames: "",
    image: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Gerekli alanların kontrolü
    if (!blogData.title || !blogData.content) {
      alert("Başlık ve içerik alanları zorunludur!");
      return;
    }

    if (!blogData.tagNames || !blogData.categoryNames) {
      alert("En az bir etiket ve kategori belirtmelisiniz.");
      return;
    }

    const formData = new FormData();
    formData.append("title", blogData.title);
    formData.append("content", blogData.content);

    // Kategoriler ve Etiketleri JSON array formatında gönder
    formData.append(
      "categoryNames",
      JSON.stringify(blogData.categoryNames.split(",").map((cat) => cat.trim()))
    );
    formData.append(
      "tagNames",
      JSON.stringify(blogData.tagNames.split(",").map((tag) => tag.trim()))
    );

    // Resim dosyasını ekleyin
    if (blogData.image) formData.append("image", blogData.image);


    // FormData içeriğini kontrol etmek için
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }
    
    try {
      const result = await dispatch(
        createBlog({
          formData,
          token,
        })
      );

      if (createBlog.fulfilled.match(result)) {
        router.push("/"); 
      } else {
        console.error("Blog oluşturulurken bir hata oluştu:", result.error);
      }
    } catch (err) {
      console.error("Beklenmeyen bir hata oluştu:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="flex items-center space-x-4 mb-8">
          {user?.profilePicture ? (
            <img
              src={`http://localhost:5000${user.profilePicture}`}
              alt={user.username}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-blue-600">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-blue-600">{user?.username}</h1>
            <p className="text-lg text-gray-500">
              {user?.role === "admin" ? "Admin" : "Yazar"}
            </p>
          </div>
        </div>

        <form
          className="bg-white p-6 rounded shadow-lg space-y-4 w-full max-w-lg"
          onSubmit={handleSubmit}
        >
          <h1 className="text-2xl font-bold">Yeni Blog Oluştur</h1>

          <input
            type="text"
            placeholder="Başlık"
            className="p-3 border rounded w-full"
            value={blogData.title}
            onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
          />

          <textarea
            placeholder="İçerik"
            className="p-3 border rounded w-full"
            rows="5"
            value={blogData.content}
            onChange={(e) =>
              setBlogData({ ...blogData, content: e.target.value })
            }
          ></textarea>
          

          <input
            type="text"
            placeholder="Kategoriler (ör: kategori1, kategori2)"
            className="p-3 border rounded w-full"
            value={blogData.categoryNames}
            onChange={(e) => setBlogData({ ...blogData, categoryNames: e.target.value })}
          />

          <input
            type="text"
            placeholder="Etiketler (ör: etiket1, etiket2)"
            className="p-3 border rounded w-full"
            value={blogData.tagNames}
            onChange={(e) => setBlogData({ ...blogData, tagNames: e.target.value })}
          />


        <input
          type="file"
          accept="image/*"
          className="p-3 border rounded w-full"
          onChange={(e) => {
            const file = e.target.files[0];  // Dosyayı al
            if (file) {
              if (file.size > 5 * 1024 * 1024) {
                alert("Dosya boyutu 5MB'dan büyük olamaz.");
              } else {
                setBlogData({ ...blogData, image: file });  // Dosyayı state'e kaydet
              }
            }
          }}
        />


          {error && (
            <p className="text-red-600">
              {typeof error === "string" ? error : error.message || JSON.stringify(error)}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded"
            disabled={loading}
          >
            {loading ? "Blog oluşturuluyor..." : "Oluştur"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
