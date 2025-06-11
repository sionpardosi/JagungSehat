import React, { useState } from "react";
import { CheckCircle, AlertTriangle, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const HistoryPage = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const historyData = [
    {
      id: 1,
      diseaseName: "Gray Leaf Spot",
      userName: "Andrea",
      date: "21/05/2025",
      isHealthy: false,
      confidence: "87%",
      symptoms: "Gray lesions forming parallel to veins.",
      imageUrl: "https://source.unsplash.com/400x300/?corn,leaf",
    },
    {
      id: 2,
      diseaseName: "Healthy Leaf",
      userName: "John",
      date: "21/05/2025",
      isHealthy: true,
      confidence: "99%",
      symptoms: "No visible disease symptoms.",
      imageUrl: "https://source.unsplash.com/400x300/?corn,healthy",
    },
    {
      id: 3,
      diseaseName: "Leaf Blight",
      userName: "Emily",
      date: "22/05/2025",
      isHealthy: false,
      confidence: "85%",
      symptoms: "Large brown lesions with chlorotic halos.",
      imageUrl: "https://source.unsplash.com/400x300/?corn,blight",
    },
    {
      id: 4,
      diseaseName: "Rust Disease",
      userName: "Michael",
      date: "23/05/2025",
      isHealthy: false,
      confidence: "92%",
      symptoms: "Rusty pustules on the leaf surface.",
      imageUrl: "https://source.unsplash.com/400x300/?corn,rust",
    },
    {
      id: 5,
      diseaseName: "Brown Spot",
      userName: "Sarah",
      date: "24/05/2025",
      isHealthy: false,
      confidence: "88%",
      symptoms: "Small brown circular spots on leaves.",
      imageUrl: "https://source.unsplash.com/400x300/?corn,brownspot",
    },
    {
      id: 6,
      diseaseName: "Healthy Leaf",
      userName: "Jake",
      date: "25/05/2025",
      isHealthy: true,
      confidence: "98%",
      symptoms: "Leaf appears fresh and green.",
      imageUrl: "https://source.unsplash.com/400x300/?corn,green",
    },
    {
      id: 7,
      diseaseName: "Gray Leaf Spot",
      userName: "Liam",
      date: "26/05/2025",
      isHealthy: false,
      confidence: "89%",
      symptoms: "Gray rectangular lesions on leaves.",
      imageUrl: "https://source.unsplash.com/400x300/?corn,gray",
    },
    {
      id: 8,
      diseaseName: "Leaf Blight",
      userName: "Sophia",
      date: "27/05/2025",
      isHealthy: false,
      confidence: "90%",
      symptoms: "Necrotic streaks starting at leaf tips.",
      imageUrl: "https://source.unsplash.com/400x300/?corn,lesion",
    },
    {
      id: 9,
      diseaseName: "Rust Disease",
      userName: "James",
      date: "28/05/2025",
      isHealthy: false,
      confidence: "91%",
      symptoms: "Rusty-orange spots visible on leaf underside.",
      imageUrl: "https://source.unsplash.com/400x300/?corn,orange",
    },
    {
      id: 10,
      diseaseName: "Healthy Leaf",
      userName: "Olivia",
      date: "29/05/2025",
      isHealthy: true,
      confidence: "97%",
      symptoms: "Leaf is vibrant with no damage.",
      imageUrl: "https://source.unsplash.com/400x300/?corn,vibrant",
    },
  ];

  const toggleDetails = (itemId) => {
    setSelectedItem((prev) => (prev === itemId ? null : itemId));
  };

  const filteredData = historyData.filter((item) => {
    const matchesSearch =
      item.diseaseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.userName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all"
        ? true
        : filterStatus === "healthy"
        ? item.isHealthy
        : !item.isHealthy;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-green-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-[#1b4332] mb-6 text-center">
          Detection History
        </h2>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          {/* Search */}
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search by disease or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>

          {/* Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-700"
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
                {/* Card utama */}
                <div
                  onClick={() => toggleDetails(item.id)}
                  className="cursor-pointer bg-white p-4 rounded-lg shadow-md flex justify-between items-center hover:shadow-xl transition-all"
                >
                  <div className="flex items-center gap-2 w-1/3">
                    {item.isHealthy ? (
                      <CheckCircle size={24} className="text-green-500" />
                    ) : (
                      <AlertTriangle size={24} className="text-red-500" />
                    )}
                    <span className="text-base font-semibold text-gray-800">
                      {item.diseaseName}
                    </span>
                  </div>
                  <div className="text-center w-1/3">
                    <span className="text-sm font-medium text-gray-700">
                      {item.userName}
                    </span>
                  </div>
                  <div className="text-right w-1/3">
                    <span className="text-sm text-gray-600">{item.date}</span>
                  </div>
                </div>

                {/* Detail */}
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
                            <li><strong>Nama Penyakit:</strong> {item.diseaseName}</li>
                            <li><strong>Nama Pengguna:</strong> {item.userName}</li>
                            <li><strong>Tanggal Deteksi:</strong> {item.date}</li>
                            <li><strong>Tingkat Keyakinan:</strong> {item.confidence}</li>
                            <li><strong>Gejala:</strong> {item.symptoms}</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-[#1b4332] mb-2">
                            Gambar Daun
                          </h4>
                          <div className="w-full h-48 rounded-lg overflow-hidden border">
                            <img
                              src={item.imageUrl}
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