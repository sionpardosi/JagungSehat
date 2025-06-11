import React, { useState } from 'react';
import { Link } from 'react-router';
import Sidebar from '../../components/dashboard/Sidebar';
import { Download, Eye, Search } from 'lucide-react';

const DiseaseManagement = () => {
    const diseaseData = [
        {
            id: 1,
            name: 'Blight Daun Utara',
            scientificName: 'Exserohilum turcicum',
            symptoms: 'Bercak memanjang berwarna coklat keabu-abuan pada daun',
            severity: 'Tinggi',
            treatment: 'Fungisida berbahan aktif propikonazol',
            status: 'Aktif'
        },
        {
            id: 2,
            name: 'Karat Daun Jagung',
            scientificName: 'Puccinia sorghi',
            symptoms: 'Pustula kecil berwarna coklat keemasan pada permukaan daun',
            severity: 'Sedang',
            treatment: 'Fungisida berbahan aktif tebukonazol',
            status: 'Aktif'
        },
        {
            id: 3,
            name: 'Hawar Daun',
            scientificName: 'Helminthosporium maydis',
            symptoms: 'Bercak oval hingga memanjang dengan tepi coklat tua',
            severity: 'Tinggi',
            treatment: 'Rotasi tanaman dan fungisida sistemik',
            status: 'Aktif'
        },
        {
            id: 4,
            name: 'Bercak Daun Cercospora',
            scientificName: 'Cercospora zeae-maydis',
            symptoms: 'Bercak persegi panjang dengan tepi coklat dan bagian tengah abu-abu',
            severity: 'Sedang',
            treatment: 'Fungisida berbahan aktif mankozeb',
            status: 'Tidak Aktif'
        },
        {
            id: 5,
            name: 'Downy Mildew',
            scientificName: 'Peronosclerospora maydis',
            symptoms: 'Garis-garis kuning pada daun dengan pertumbuhan jamur putih',
            severity: 'Tinggi',
            treatment: 'Fungisida sistemik dan perbaikan drainase',
            status: 'Aktif'
        }
    ];

    const [searchTerm, setSearchTerm] = useState('');

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'Tinggi':
                return 'bg-red-100 text-red-800';
            case 'Sedang':
                return 'bg-yellow-100 text-yellow-800';
            case 'Rendah':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Filter data berdasarkan searchTerm (case-insensitive)
    const filteredData = diseaseData.filter(disease => {
        const term = searchTerm.toLowerCase();
        return (
            disease.name.toLowerCase().includes(term) ||
            disease.scientificName.toLowerCase().includes(term) ||
            disease.symptoms.toLowerCase().includes(term)
        );
    });

    // Fungsi export CSV sederhana
    const exportCSV = () => {
        const headers = ['No', 'Nama Penyakit', 'Nama Ilmiah', 'Gejala', 'Tingkat Keparahan', 'Penanganan', 'Status'];
        const rows = filteredData.map((disease, index) => [
            index + 1,
            disease.name,
            disease.scientificName,
            disease.symptoms,
            disease.severity,
            disease.treatment,
            disease.status
        ]);

        let csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.map(e => e.map(field => `"${field}"`).join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "disease_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans text-gray-900">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content */}
            <main className="flex-1 overflow-y-auto p-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-semibold mb-2">
                        Manajemen Penyakit Daun Jagung
                    </h1>
                    <p className="text-gray-600">
                        Kelola data penyakit yang menyerang daun jagung beserta metode penanganannya
                    </p>
                </div>

                {/* Action Bar */}
                <section className="bg-white rounded-lg shadow p-6 mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={exportCSV}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                                type="button"
                            >
                                <Download className="w-5 h-5" />
                                Export Data
                            </button>
                        </div>
                        <div className="flex gap-3">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Cari penyakit..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Table */}
                <section className="bg-white rounded-lg shadow overflow-hidden mb-8">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        No
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nama Penyakit
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nama Ilmiah
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Gejala
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tingkat Keparahan
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Penanganan
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                            Data penyakit tidak ditemukan.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((disease, index) => (
                                        <tr key={disease.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {disease.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600 italic">
                                                    {disease.scientificName}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600 max-w-xs">
                                                    {disease.symptoms}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(disease.severity)}`}>
                                                    {disease.severity}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600 max-w-xs">
                                                    {disease.treatment}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <Link to={`/dashboard/disease-management/${disease.id}`} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 flex items-center gap-1">
                                                    <Eye className="w-4 h-4" />
                                                    Detail
                                                </Link>
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
    )
}

export default DiseaseManagement;
