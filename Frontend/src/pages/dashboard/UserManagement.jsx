import { useState } from 'react';
import Swal from 'sweetalert2';
import Sidebar from '../../components/dashboard/Sidebar';
import { Download, Search, Trash } from 'lucide-react';
import useDeleteUser from '../../hook/user/useDeleteUser';
import useGetUsers from '../../hook/user/useGetUsers';

const UserManagement = () => {
    const { users, loading, error } = useGetUsers();
    const { deleteUser } = useDeleteUser();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const exportToCSV = () => {
        const headers = ['ID', 'Name', 'Email', 'Role'];
        const rows = filteredUsers.map(u => [u.id, u.name, u.email, u.role]);

        let csvContent = headers.join(',') + '\n';
        rows.forEach(row => {
            const escapedRow = row.map(field => `"${String(field).replace(/"/g, '""')}"`);
            csvContent += escapedRow.join(',') + '\n';
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'user_data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleDeleteUser = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteUser(id);
                    Swal.fire({
                        title: "Deleted!",
                        text: "User has been deleted.",
                        icon: "success"
                    }).then(() => {
                        window.location.reload();
                    });
                } catch (err) {
                    Swal.fire({
                        title: "Error!",
                        text: err.message || "An error occurred.",
                        icon: "error"
                    });
                }
            }
        });
    };

    const getRoleColor = (role) => {
        switch (role.trim()) {
            case 'ADMIN':
                return 'bg-green-500';
            case 'USER':
                return 'bg-blue-300';
            default:
                return 'bg-gray-500';
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
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search user..."
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
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Loading data...</td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-red-500">Error: {error}</td>
                                    </tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Data pengguna tidak ditemukan.</td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user, index) => (
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
                                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 flex items-center gap-1"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                >
                                                    <Trash className="w-5 h-5" />
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default UserManagement;