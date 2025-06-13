import { useState, useEffect } from 'react';
import { Search, Trash, Download } from 'lucide-react';
import Sidebar from '../../components/dashboard/Sidebar';
import Swal from 'sweetalert2';
import axiosInstance from '../../libs/axios';
import useAdminScanHistories from '../../hook/history/useAdminScanHistories';

const PredictHistory = () => {
    const { histories: initialHistories, loading, error } = useAdminScanHistories();

    const [histories, setHistories] = useState(initialHistories);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setHistories(initialHistories);
    }, [initialHistories]);

    const filteredHistories = histories.filter(history => {
        const username = history.user?.username ? history.user.username.toLowerCase() : '';
        const diseaseTitle = history.disease?.title ? history.disease.title.toLowerCase() : '';
        return (
            username.includes(searchQuery.toLowerCase()) ||
            diseaseTitle.includes(searchQuery.toLowerCase())
        );
    });

    const exportToCSV = () => {
        const headers = ['No', 'Username', 'Email', 'Disease', 'Scan Date', 'Confidence', 'Image Path'];
        const rows = filteredHistories.map((history, index) => [
            index + 1,
            history.user?.username || "N/A",
            history.user?.email || "N/A",
            history.disease?.title || "N/A",
            new Date(history.scanDate).toLocaleString(),
            history.confidence.toFixed(2),
            history.imagePath
        ]);

        let csvContent = headers.join(',') + '\n';
        rows.forEach(row => {
            const escapedRow = row.map(field => `"${String(field).replace(/"/g, '""')}"`);
            csvContent += escapedRow.join(',') + '\n';
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'predict_history.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const deleteHistory = async (id) => {
        await axiosInstance.delete(`admin/scan-history/${id}`);
    };

    const handleDeleteHistory = async (id) => {
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
                    await deleteHistory(id);
                    setHistories(prevHistories => prevHistories.filter(history => history.id !== id));
                    Swal.fire({
                        title: "Deleted!",
                        text: "History item has been deleted.",
                        icon: "success",
                    });
                } catch (err) {
                    Swal.fire({
                        title: "Error!",
                        text: err.message || "Failed to delete history.",
                        icon: "error"
                    });
                }
            }
        });
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans text-gray-900">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8">
                <h1 className="text-3xl font-semibold mb-6">Predict History</h1>

                {/* Action Buttons */}
                <section className="bg-white rounded-lg shadow p-6 mb-8 flex flex-col sm:flex-row justify-between items-center">
                    <button
                        onClick={exportToCSV}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 mb-4 sm:mb-0"
                    >
                        <Download className="w-5 h-5" />
                        Export to CSV
                    </button>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by username or disease..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                </section>

                {/* History Table */}
                <section className="bg-white rounded-lg shadow overflow-hidden mb-4">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disease</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scan Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-4 text-center text-gray-500">Loading data...</td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-4 text-center text-red-500">Error: {error}</td>
                                    </tr>
                                ) : filteredHistories.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-4 text-center text-gray-500">No history found.</td>
                                    </tr>
                                ) : (
                                    filteredHistories.map((history, index) => (
                                        <tr key={history.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{history.user?.username}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">{history.user?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">{history.disease?.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">{new Date(history.scanDate).toLocaleString()}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">{history.confidence.toFixed(2)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <img src={history.imagePath} alt="Scan Result" className="w-16 h-16 object-cover rounded" />
                                            </td>
                                            <td className="px-6 flex justify-center items-center whitespace-nowrap text-sm font-medium">
                                                <button
                                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 flex items-center gap-1"
                                                    onClick={() => handleDeleteHistory(history.id)}
                                                >
                                                    <Trash className="w-5 h-5" />
                                                    Delete
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

export default PredictHistory;