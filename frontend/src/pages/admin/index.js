import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout"; // Layout bileşeni

const AdminPage = () => {
  const { user } = useSelector((state) => state.auth); // Redux'tan kullanıcı bilgisi alınır
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/"); // Eğer admin değilse ana sayfaya yönlendir
    }
  }, [user, router]);

  return (
    <Layout>
      {/* Admin Panel Başlığı */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
      </div>

      {/* Hoşgeldiniz ve Görevler Mesajı */}
      <div className="bg-blue-100 p-4 rounded-lg shadow">
        <p className="text-lg">
          Merhaba <span className="font-bold text-blue-600">{user?.username}</span>,
          admin paneline hoş geldiniz! Burada:
        </p>
        <ul className="list-disc list-inside mt-2 text-base text-gray-700">
          <li>Yeni gönderiler oluşturabilir, düzenleyebilir ve silebilirsiniz.</li>
          <li>Kategorileri ve etiketleri yönetebilirsiniz.</li>
          <li>Kullanıcı rolleri ve izinlerini ayarlayabilirsiniz.</li>
        </ul>
        <p className="mt-2">
          Tüm yönetim işlemleri için sol menüyü kullanabilirsiniz. Başarılar dileriz!
        </p>
      </div>
    </Layout>
  );
};

export default AdminPage;
