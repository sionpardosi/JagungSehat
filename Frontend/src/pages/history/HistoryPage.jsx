import { useState } from "react";
import { CheckCircle, AlertTriangle, Search, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom"; 
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars
import useHistories from "../../hook/history/useHistories";
import useGetUsers from "../../hook/user/useGetUsers";

const HistoryPage = () => {
    const { histories, loading, error } = useHistories();
    const { users, loading: loadingUsers } = useGetUsers();
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    const navigate = useNavigate(); 

    const handleGoBack = () => {
        navigate(-1); 
    };

    const toggleDetails = (itemId) => {
        setSelectedItem((prev) => (prev === itemId ? null : itemId));
    };

    const userMap = users.reduce((map, user) => {
        map[user.id] = user.name;
        return map;
    }, {});

    const filteredData = Array.isArray(histories)
        ? histories.filter((item) => {
            const matchesSearch = item.disease?.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus =
                filterStatus === "all"
                    ? true
                    : filterStatus === "healthy"
                        ? item.diseaseId === 1
                        : item.diseaseId !== 1;
            return matchesSearch && matchesStatus;
        })
        : [];

    const getHealthStatusIcon = (diseaseId) => {
        if (diseaseId === 4) {
            return <CheckCircle size={24} className="text-green-500" />;
        }
        return <AlertTriangle size={24} className="text-red-500" />;
    };

    return (
        <div className="bg-gradient-to-b from-green-100 to-green-200 min-h-screen p-6">
            <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
                {/* Tombol Kembali */}
                <header className="flex items-center justify-between mb-6">
                    <button
                        onClick={handleGoBack}
                        className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
                    >
                        <ArrowLeft size={24} />
                        <span className="font-medium">Kembali</span>
                    </button>
                </header>

                <h2 className="text-3xl font-bold text-[#1b4332] mb-6 text-center">
                    Detection History
                </h2>
                
                {error && <p className="text-red-500 text-center">{error}</p>}
                {loading && <p className="text-center">Loading...</p>}
                {loadingUsers && <p className="text-center">Loading Users...</p>}

                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                    {/* Search */}
                    <div className="relative w-full md:w-1/2">
                        <input
                            type="text"
                            placeholder="Try search by disease name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    </div>

                    {/* Filter */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700"
                    >
                        <option value="all">All Status</option>
                        <option value="healthy">Healthy</option>
                        <option value="diseased">Diseased</option>
                    </select>
                </div>

                {/* List */}
                <div className="space-y-4">
                    {filteredData.length === 0 ? (
                        <p className="text-center text-gray-600">No results found.</p>
                    ) : (
                        filteredData.map((item) => (
                            <div key={item.id}>
                                {/* Main Card */}
                                <div
                                    onClick={() => toggleDetails(item.id)}
                                    className="cursor-pointer bg-white p-4 rounded-lg shadow-md flex justify-between items-center hover:shadow-xl transition-all border-l-4 border-green-500"
                                >
                                    <div className="flex items-center gap-2 w-1/3">
                                        {getHealthStatusIcon(item.diseaseId)} {/* Use the function */}
                                        <span className="text-base font-semibold text-gray-800">
                                            {item.disease.title}
                                        </span>
                                    </div>
                                    <div className="text-center w-1/3">
                                        <span className="text-sm font-medium text-gray-700">
                                            {userMap[item.userId] || 'Unknown User'}
                                        </span>
                                    </div>
                                    <div className="text-right w-1/3">
                                        <span className="text-sm text-gray-600">{new Date(item.scanDate).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {/* Details Section */}
                                <AnimatePresence>
                                    {selectedItem === item.id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="bg-white p-6 mt-2 rounded-lg shadow-inner border border-green-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <h4 className="text-lg font-semibold text-[#1b4332] mb-2">
                                                        Detail Deteksi
                                                    </h4>
                                                    <ul className="text-gray-700 text-sm space-y-1">
                                                        <li><strong>Nama Penyakit:</strong> {item.disease.title}</li>
                                                        <li><strong>Nama Pengguna:</strong> {userMap[item.userId] || 'Unknown User'}</li>
                                                        <li><strong>Tanggal Deteksi:</strong> {new Date(item.scanDate).toLocaleDateString()}</li>
                                                        <li><strong>Tingkat Keyakinan:</strong> {item.confidence}</li>
                                                        <li><strong>Gejala:</strong> {item.disease.symptoms}</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-semibold text-[#1b4332] mb-2">
                                                        Gambar Daun
                                                    </h4>
                                                    <div className="w-full h-48 rounded-lg overflow-hidden border">
                                                        <img
                                                            src={item.imagePath}
                                                            alt="Leaf Detection"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryPage;