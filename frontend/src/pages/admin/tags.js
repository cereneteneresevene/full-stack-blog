import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTags, createTag, deleteTag } from "../../../store/slices/tagsSlice";
import Layout from "../../../components/Layout";

const TagsPage = () => {
  const dispatch = useDispatch();
  const { tags, loading, error } = useSelector((state) => state.tags);
  const { token } = useSelector((state) => state.auth);

  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  const handleAddTag = async () => {
    if (!newTag) return alert("Etiket adı boş olamaz!");
    try {
      await dispatch(createTag({ name: newTag, token }));
      setNewTag(""); // Input'u temizle
    } catch (error) {
      console.error("Etiket eklenirken bir hata oluştu:", error);
    }
  };

  const handleDeleteTag = async (id) => {
    if (confirm("Bu etiketi silmek istediğinizden emin misiniz?")) {
      try {
        await dispatch(deleteTag({ id, token }));
      } catch (error) {
        console.error("Etiket silinirken bir hata oluştu:", error);
      }
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Etiketler</h1>

        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Yeni Etiket"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="p-2 border rounded mr-2"
          />
          <button
            onClick={handleAddTag}
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
            {tags.map((tag) => (
              <li key={tag._id} className="flex justify-between items-center mb-2">
                <span>{tag.name}</span>
                <button
                  onClick={() => handleDeleteTag(tag._id)}
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

export default TagsPage;
