const DetectionResults = ({ result }) => {
    if (!result) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 mt-4">
                <p className="text-gray-500">Tidak ada hasil yang ditemukan.</p>
            </div>
        );
    }

    const { title, description, symptoms, treatment } = result;

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            <h3 className="text-2xl font-semibold text-green-700 mb-2">{title || 'Nama penyakit tidak tersedia'}</h3>
            <p className="text-gray-700 mb-4">{description || 'Deskripsi tidak tersedia'}</p>
            <h4 className="font-bold">Gejala:</h4>
            <p className="text-gray-600 mb-4">{symptoms || 'Gejala tidak tersedia'}</p>
            <h4 className="font-bold">Perawatan:</h4>
            <p className="text-gray-600">{treatment || 'Perawatan tidak tersedia'}</p>
        </div>
    );
};

export default DetectionResults;