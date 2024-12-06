import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogDetail, fetchBlogs } from "../../../store/slices/blogSlice";
import { useRouter } from "next/router";
import Navbar from "../../../components/Navbar.js";
import Footer from "../../../components/Footer";
import BlogDetailContent from "../../../components/BlogDetailContent"; // Yeni Bileşen
import AddComment from "../../../components/AddComment"; 

const BlogDetail = ({ categories }) => {
  const dispatch = useDispatch();
  const { blogDetail, blogs, loading, error } = useSelector(
    (state) => state.blogs
  );
  const router = useRouter();
  const { id } = router.query;

  // Arama ve kategori seçimi için state
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(fetchBlogDetail(id)); // Blog detayını Redux'tan çek
    }
    dispatch(fetchBlogs()); // Blog listesini de çek
  }, [id, dispatch]);

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>Hata: {error}</p>;
  if (!blogDetail) return <p>Blog detayı bulunamadı!</p>;

  // Arama veya kategori seçildiğinde anasayfaya yönlendirme
  const handleRedirect = (query) => {
    const params = new URLSearchParams(query).toString();
    router.push(`/?${params}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar
        categories={categories}
        setSelectedCategory={(category) => {
          setSelectedCategory(category);
          handleRedirect({ category }); // Kategori seçimi durumunda yönlendirme
        }}
        setSearchQuery={(query) => {
          setSearchQuery(query);
          handleRedirect({ search: query }); // Arama durumunda yönlendirme
        }}
      />

      {/* Blog Detayı */}
      <main className="flex-grow">
        <BlogDetailContent blog={blogDetail} />
      </main>

      {/* Yorum Ekle */}
      <AddComment
        blogId={blogDetail._id} // `blogDetail` içindeki `_id` değerini kullan
        onCommentAdded={(newComment) => {
          // Yorum eklendiğinde Redux store'u güncelle
          dispatch({
            type: "blogs/updateComments",
            payload: { blogId: blogDetail._id, comment: newComment },
          });
        }}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export async function getServerSideProps({ params }) {
  return {
    props: {
      id: params.id,
    },
  };
}

export default BlogDetail;
