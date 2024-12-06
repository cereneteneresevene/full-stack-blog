import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, updateUserRole } from '../../../store/slices/userSlice';
import Layout from '../../../components/Layout';

const UsersPage = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleRoleChange = (userId, newRole) => {
    dispatch(updateUserRole({ userId, role: newRole }));
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold">Kullanıcı Yönetimi</h1>
      {loading ? (
        <p>Yükleniyor...</p>
      ) : error ? (
        <p className="text-red-500">Hata: {error.message || error}</p>
      ) : (
        <table className="table-auto w-full mt-4 border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Kullanıcı Adı</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Rol</th>
              <th className="border border-gray-300 p-2">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="text-center">
                <td className="border border-gray-300 p-2">{user.username}</td>
                <td className="border border-gray-300 p-2">{user.email}</td>
                <td className="border border-gray-300 p-2">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="p-2 border border-gray-300"
                  >
                    <option value="user">User</option>
                    <option value="writer">Writer</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="border border-gray-300 p-2">
                  <button className="text-blue-500">Detay</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
};

export default UsersPage;
