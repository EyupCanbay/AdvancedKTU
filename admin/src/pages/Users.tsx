import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, UserPlus, Search } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import api from '../lib/api';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

const Users: React.FC = () => {
  const { users, setUsers, setLoading, loading, updateUser, deleteUser } = useUserStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<User>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', name: '', role: 'user' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Kullanıcılar yüklenemedi';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setEditData({ ...user });
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await api.put(`/users/${id}`, editData);
      updateUser(id, editData);
      setEditingId(null);
      toast.success('Kullanıcı güncellendi');
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Güncelleme başarısız';
      toast.error(errorMsg);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      try {
        await api.delete(`/users/${id}`);
        deleteUser(id);
        toast.success('Kullanıcı silindi');
      } catch (error: any) {
        const errorMsg = error.response?.data?.error || 'Silme başarısız';
        toast.error(errorMsg);
      }
    }
  };

  const handleAddUser = async () => {
    try {
      const response = await api.post('/users', newUser);
      setUsers([
        ...users,
        {
          id: response.data.id || Date.now().toString(),
          ...newUser,
          createdAt: new Date().toISOString().split('T')[0],
        },
      ]);
      setNewUser({ email: '', name: '', role: 'user' });
      setShowAddModal(false);
      toast.success('Kullanıcı eklendi');
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Ekleme başarısız';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Kullanıcılar</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <UserPlus size={20} />
            Yeni Kullanıcı
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Email veya ad ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Ad</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Rol</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Kayıt Tarihi</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {editingId === user.id ? (
                      <input
                        type="text"
                        value={editData.name || ''}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="px-2 py-1 border rounded"
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    {editingId === user.id ? (
                      <select
                        value={editData.role || 'user'}
                        onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                        className="px-2 py-1 border rounded"
                      >
                        <option>user</option>
                        <option>moderator</option>
                        <option>admin</option>
                      </select>
                    ) : (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{user.createdAt}</td>
                  <td className="px-6 py-4 flex gap-2">
                    {editingId === user.id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(user.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Kaydet
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                        >
                          İptal
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add User Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h2 className="text-xl font-bold mb-4">Yeni Kullanıcı Ekle</h2>
              <input
                type="text"
                placeholder="Ad"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded mb-3"
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded mb-3"
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
              >
                <option>user</option>
                <option>moderator</option>
                <option>admin</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleAddUser}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
                >
                  Ekle
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
