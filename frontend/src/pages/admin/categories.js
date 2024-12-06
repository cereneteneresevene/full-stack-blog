import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, createCategory, deleteCategory } from "../../../store/slices/categorySlice";
import Layout from "../../../components/Layout";

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.categories);
  const { token } = useSelector((state) => state.auth);

  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAddCategory = async () => {
    if (!newCategory) return alert("Kategori adı boş olamaz!");
    try {
      await dispatch(createCategory({ name: newCategory, token }));
      setNewCategory(""); // Input'u temizle
    } catch (error) {
      console.error("Kategori eklenirken bir hata oluştu:", error);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")) {
      try {
        await dispatch(deleteCategory({ id, token }));
      } catch (error) {
        console.error("Kategori silinirken bir hata oluştu:", error);
      }
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Kategoriler</h1>

        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Yeni Kategori"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="p-2 border rounded mr-2"
          />
          <button
            onClick={handleAddCategory}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Ekle
          </button>
        </div>

        {loading ? (
          <p>Yükleniyor...</p>
        ) : error ? (
          <p>Hata: {error}</p>
        ) : (
          <ul className="list-disc ml-6">
            {categories.map((category) => (
              <li key={category._id} className="flex justify-between items-center mb-2">
                <span>{category.name}</span>
                <button
                  onClick={() => handleDeleteCategory(category._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Sil
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default CategoriesPage;
