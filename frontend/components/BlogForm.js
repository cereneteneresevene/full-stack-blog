import { useState, useEffect } from "react";

const BlogForm = ({ onSubmit, blog, onClose }) => {
  const [blogData, setBlogData] = useState({
    title: "",
    content: "",
    tagNames: "",
    categoryNames: "",
    image: null,
  });

  useEffect(() => {
    if (blog) {
      setBlogData({
        title: blog.title || "",
        content: blog.content || "",
        tagNames: blog.tagNames?.join(", ") || "",
        categoryNames: blog.categoryNames?.join(", ") || "",
        image: null,
      });
    }
  }, [blog]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = { ...blogData };
    if (!blogData.image && blog?.image) {
      updatedData.image = blog.image;
    }
    onSubmit(updatedData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-lg">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Başlık"
            className="p-3 border rounded w-full mb-3"
            value={blogData.title}
            onChange={(e) =>
              setBlogData({ ...blogData, title: e.target.value })
            }
            required
          />
          <textarea
            placeholder="İçerik"
            className="p-3 border rounded w-full mb-3"
            rows="5"
            value={blogData.content}
            onChange={(e) =>
              setBlogData({ ...blogData, content: e.target.value })
            }
            required
          ></textarea>
          <input
            type="text"
            placeholder="Kategoriler (ör: kategori1, kategori2)"
            className="p-3 border rounded w-full mb-3"
            value={blogData.categoryNames}
            onChange={(e) =>
              setBlogData({ ...blogData, categoryNames: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Etiketler (ör: etiket1, etiket2)"
            className="p-3 border rounded w-full mb-3"
            value={blogData.tagNames}
            onChange={(e) =>
              setBlogData({ ...blogData, tagNames: e.target.value })
            }
            required
          />
          <input
            type="file"
            accept="image/*"
            className="p-3 border rounded w-full mb-3"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file && file.size > 5 * 1024 * 1024) {
                alert("Dosya boyutu 5MB'dan büyük olamaz.");
              } else {
                setBlogData({ ...blogData, image: file });
              }
            }}
          />
          {blog?.image && !blogData.image && (
            <div className="mt-2 mb-3">
              <p>Mevcut Görsel:</p>
              <img
                src={blog.image}
                alt="Mevcut Görsel"
                className="w-32 h-32 object-cover border rounded"
              />
            </div>
          )}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="bg-gray-300 text-black py-2 px-4 rounded"
              onClick={onClose}
            >
              İptal
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded"
            >
              {blog ? "Blogu Güncelle" : "Yeni Blog Oluştur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogForm;


