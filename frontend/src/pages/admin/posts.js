import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import { fetchBlogs, createBlog, updateBlog, deleteBlog} from "../../../store/slices/blogSlice";
import Modal from "../../../components/Modal";
import BlogForm from "../../../components/BlogForm";

const PostsPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { blogs, loading, error } = useSelector((state) => state.blogs);
  const { user, token } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
    } else {
      dispatch(fetchBlogs());
    }
  }, [user, dispatch, router]);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (blogId) => {
    if (confirm("Bu blogu silmek istediğinizden emin misiniz?")) {
      setIsDeleting(true); // Yükleme durumunu başlat
      try {
        await dispatch(deleteBlog({ blogId, token })).unwrap();
        alert("Blog başarıyla silindi.");
        await dispatch(fetchBlogs()); // Blog listesini güncelle
      } catch (error) {
        console.error("Silme işlemi başarısız:", error);
        alert(`Blog silinirken bir hata oluştu: ${error.message || error}`);
      } finally {
        setIsDeleting(false); // Yükleme durumunu bitir
      }
    }
  };
  

  const handleEdit = (blog) => {
    setEditingBlog(blog); // Düzenlenecek blogu ayarlayın
    setShowModal(true); // Modal'ı açın
  };

  const handleAddPost = () => {
    setEditingBlog(null); // Yeni blog eklerken eski verileri sıfırlayın
    setShowModal(true); // Modal'ı açın
  };

  const closeModal = () => {
    setShowModal(false); // Modal'ı kapatın
  };

  const handleSubmitBlog = async (blogData) => {
    const formData = new FormData();
    formData.append("title", blogData.title);
    formData.append("content", blogData.content);
  
    // categoryNames ve tagNames'i diziye dönüştür ve FormData'ya ekle
    const categoryArray = (blogData.categoryNames || "")
      .split(",")
      .map((cat) => cat.trim())
      .filter((cat) => cat !== "");
    
    categoryArray.forEach((cat) => formData.append("categoryNames[]", cat));
  
    const tagArray = (blogData.tagNames || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");
    
    tagArray.forEach((tag) => formData.append("tagNames[]", tag));
  
    if (blogData.image) formData.append("image", blogData.image);
  
    try {
      if (editingBlog) {
        const result = await dispatch(
          updateBlog({
            blogId: editingBlog._id, // _id kullandığınızdan emin olun
            formData,
            token,
          })
        );
        if (updateBlog.fulfilled.match(result)) {
          router.push("/admin/posts"); // Güncelleme tamamlandığında yönlendirin
          closeModal();
        } else {
          console.error("Blog güncellenirken bir hata oluştu:", result.error);
        }
      } else {
        const result = await dispatch(
          createBlog({
            formData,
            token,
          })
        );
        if (createBlog.fulfilled.match(result)) {
          router.push("/admin/posts"); // Yeni blog eklenince yönlendirin
          closeModal();
        } else {
          console.error("Blog oluşturulurken bir hata oluştu:", result.error);
        }
      }
    } catch (err) {
      console.error("Beklenmeyen bir hata oluştu:", err);
    }
  };
  
  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Bloglar</h1>
        <button
          onClick={handleAddPost}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Yeni Blog Ekle
        </button>
      </div>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : error ? (
        <p>Hata: {error}</p>
      ) : (
        <div className="grid gap-4">
          {blogs.map((blog) => (
            <div
              key={blog._id} // id yerine _id kullandık
              className="flex items-center justify-between bg-blue-100 p-4 rounded-lg shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
                <div>
                  <h2 className="text-xl font-bold">{blog.title}</h2>
                  <p className="text-sm text-gray-600">{blog.summary}</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleEdit(blog)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal showModal={showModal} closeModal={closeModal}>
        <BlogForm onSubmit={handleSubmitBlog} blog={editingBlog} />
      </Modal>
    </Layout>
  );
};

export default PostsPage;
