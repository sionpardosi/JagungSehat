import React, { useState } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import { Download, Eye, Plus, Search, Trash } from 'lucide-react';
import { Link } from 'react-router';

const UserManagement = () => {
    const [users, setUsers] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com', role: 'User' },
        { id: 3, name: 'Bob Smith', email: 'bob@example.com', role: 'Admin' },
        { id: 4, name: 'Alice Johnson', email: 'alice@example.com', role: 'User' },
        { id: 5, name: 'Mike Brown', email: 'mike@example.com', role: 'Admin' },
    ]);

    const [newUser, setNewUser] = useState({ name: '', email: '', role: '' });

    const handleAddUser = () => {
        const newUserObject = { id: users.length + 1, ...newUser };
        setUsers([...users, newUserObject]);
        setNewUser({ name: '', email: '', role: '' });
    };

    const handleDeleteUser = (id) => {
        const filteredUsers = users.filter((user) => user.id !== id);
        setUsers(filteredUsers);
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'Admin':
                return 'bg-green-500';
            case 'User   ':
                return 'bg-blue-300';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans text-gray-900">
            {/* Sidebar */}
            <Sidebar />
            {/* Main content */}
            <main className="flex-1 overflow-y-auto p-8">
                <h1 className="text-3xl font-semibold mb-6">User    Management</h1>
                <section className="bg-white rounded-lg shadow p-6 mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2">
                                <Download className="w-5 h-5" />
                                Export Data
                            </button>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2" onClick={handleAddUser}>
                                <Plus className="w-5 h-5" />
                                Tambah User
                            </button>
                        </div>
                        <div className="flex gap-3">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Cari user..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                            </div>
                        </div>
                    </div>
                </section>
                <section className="bg-white rounded-lg shadow overflow-hidden mb-8">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        No
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nama
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user, index) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {user.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-600">
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 flex gap-3 justify-center py-4 whitespace-nowrap text-sm font-medium">
                                            <Link to={`/dashboard/user-management/${user.id}`} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 flex items-center gap-1">
                                                <Eye className="w-4 h-4" />
                                                Detail
                                            </Link>
                                            <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 flex items-center gap-1" onClick={() => handleDeleteUser(user.id)}>
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
            </main>
        </div>
    );
};

export default UserManagement;
