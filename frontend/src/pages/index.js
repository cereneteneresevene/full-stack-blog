import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../../store/slices/blogSlice";
import Navbar from "../../components/Navbar.js"; // Navbar bileşeni
import ProfileSection from "../../components/ProfileSection";
import BlogList from "../../components/BlogList"; // BlogList bileşeni
import Footer from "../../components/Footer";

export default function Home({ categories }) {
  const dispatch = useDispatch();
  const { blogs, loading, error } = useSelector((state) => state.blogs);

  // Seçilen kategori ve arama sorgusunu tutan state'ler
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>Hata: {error}</p>;

  // Blogları filtreleme: Hem kategori hem de arama sorgusuna göre
  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory = selectedCategory
      ? blog.categories.some((category) => category.name === selectedCategory)
      : true;

    const matchesSearch = blog.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Navbar'a setSelectedCategory ve setSearchQuery fonksiyonlarını props olarak gönderiyoruz */}
      <Navbar
        categories={categories}
        setSelectedCategory={setSelectedCategory}
        setSearchQuery={setSearchQuery}
      />
      <ProfileSection />
      {/* BlogList bileşenine filtrelenmiş blogları gönderiyoruz */}
      <BlogList blogs={filteredBlogs} categories={categories} />
      <Footer />
    </div>
  );
}
