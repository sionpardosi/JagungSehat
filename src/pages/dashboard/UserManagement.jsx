import React, { useState } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import { Download, Eye, Plus, Search, Trash, X, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router';

const UserManagement = () => {
    const [users, setUsers] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', detectionHistory: [] },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com', role: 'User', detectionHistory: [] },
        { id: 3, name: 'Bob Smith', email: 'bob@example.com', role: 'Admin', detectionHistory: [] },
        { id: 4, name: 'Alice Johnson', email: 'alice@example.com', role: 'User', detectionHistory: [] },
        { id: 5, name: 'Mike Brown', email: 'mike@example.com', role: 'Admin', detectionHistory: [] },
    ]);

    const [newUser, setNewUser] = useState({ name: '', email: '', role: '' });
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Filtered user berdasarkan searchQuery
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Fungsi export ke CSV
    const exportToCSV = () => {
        // Header CSV
        const headers = ['ID', 'Name', 'Email', 'Role'];
        
        // Baris data dari filteredUsers supaya yang ter-export sesuai filter pencarian juga
        const rows = filteredUsers.map(u => [u.id, u.name, u.email, u.role]);

        // Gabungkan header dan baris data jadi string CSV
        let csvContent = '';
        csvContent += headers.join(',') + '\n';
        rows.forEach(row => {
            // Escape tanda petik jika ada
            const escapedRow = row.map(field => `"${String(field).replace(/"/g, '""')}"`);
            csvContent += escapedRow.join(',') + '\n';
        });

        // Buat blob dan link download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        // Buat elemen <a> dan klik otomatis
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'user_data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleAddUser = () => {
        const newUserObject = { id: users.length + 1, ...newUser, detectionHistory: [] };
        setUsers([...users, newUserObject]);
        setNewUser({ name: '', email: '', role: '' });
    };

    const handleDeleteUser = (id) => {
        const filtered = users.filter((user) => user.id !== id);
        setUsers(filtered);
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
    };

    const getRoleColor = (role) => {
        switch (role.trim()) {
            case 'Admin':
                return 'bg-green-500';
            case 'User':
                return 'bg-blue-300';
            default:
                return 'bg-gray-500';
        }
    };

    const getResultColor = (result) => {
        switch (result) {
            case 'Positive':
                return 'bg-red-200 text-red-800';
            case 'Negative':
                return 'bg-green-200 text-green-800';
            case 'Suspected':
                return 'bg-yellow-200 text-yellow-800';
            default:
                return 'bg-gray-200 text-gray-800';
        }
    };

    const getResultIcon = (result) => {
        switch (result) {
            case 'Positive':
                return <span>⚠️</span>;
            case 'Negative':
                return <span>✅</span>;
            case 'Suspected':
                return <span>❓</span>;
            default:
                return <span>ℹ️</span>;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans text-gray-900">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8">
                <h1 className="text-3xl font-semibold mb-6">User Management</h1>

                {/* Action Buttons */}
                <section className="bg-white rounded-lg shadow p-6 mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={exportToCSV}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                            >
                                <Download className="w-5 h-5" />
                                Export Data
                            </button>
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                                onClick={handleAddUser}
                            >
                                <Plus className="w-5 h-5" />
                                Tambah User
                            </button>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Cari user..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                        </div>
                    </div>
                </section>

                {/* User Table */}
                <section className="bg-white rounded-lg shadow overflow-hidden mb-8">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.map((user, index) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-600">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 flex gap-3 justify-center py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => setSelectedUser(user)}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 flex items-center gap-1"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Detail
                                            </button>
                                            <button
                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 flex items-center gap-1"
                                                onClick={() => handleDeleteUser(user.id)}
                                            >
                                                <Trash className="w-5 h-5" />
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Modal */}
                {selectedUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg w-full max-w-3xl shadow-lg overflow-hidden">
                            <div className="flex justify-between items-center bg-indigo-600 text-white px-6 py-4">
                                <div>
                                    <h2 className="text-xl font-semibold">{selectedUser.name}</h2>
                                    <span className={`text-sm px-2 py-1 rounded ${getRoleColor(selectedUser.role)}`}>
                                        {selectedUser.role}
                                    </span>
                                </div>
                                <button onClick={handleCloseModal} className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                                <div className="mb-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-indigo-600" />
                                        Detection History
                                    </h3>

                                    {selectedUser.detectionHistory && selectedUser.detectionHistory.length > 0 ? (
                                        <div className="divide-y divide-gray-200 overflow-auto max-h-96">
                                            {selectedUser.detectionHistory.map((history, idx) => (
                                                <div
                                                    key={idx}
                                                    className="p-4 flex justify-between items-center gap-4 hover:bg-gray-50 transition-colors duration-150"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm text-gray-700 truncate">
                                                            Result: <span className={`font-semibold ${getResultColor(history.result)}`}>{history.result}</span>
                                                        </div>
                                                        <div className="text-xs text-gray-500 flex items-center gap-2">
                                                            <Clock className="w-3 h-3" />
                                                            {history.date} - {history.time}
                                                        </div>
                                                    </div>
                                                    <div className="w-10 flex justify-center">{getResultIcon(history.result)}</div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No detection history available.</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-gray-100 px-6 py-4 flex justify-end">
                                <button
                                    onClick={handleCloseModal}
                                    className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md font-medium transition-colors duration-150"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default UserManagement;
