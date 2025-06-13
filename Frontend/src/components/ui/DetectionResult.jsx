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
            <h3 className="text-2xl font-semibold text-green-700 mb-2">
                {title ? title : 'Tidak ada nama penyakit yang terdeteksi.'}
            </h3>
            <p className="text-gray-700 mb-4">
                {description ? description : 'Tidak ada deskripsi yang tersedia tentang penyakit ini.'}
            </p>
            
            <h4 className="font-bold">Gejala:</h4>
            <p className="text-gray-600 mb-4">
                {Array.isArray(symptoms) && symptoms.length > 0 
                    ? symptoms.join(', ') 
                    : 'Tidak ada gejala yang terdeteksi atau informasi gejala tidak tersedia.'}
            </p>
            
            <h4 className="font-bold">Perawatan:</h4>
            <p className="text-gray-600">
                {Array.isArray(treatment) && treatment.length > 0 
                    ? treatment.join(', ') 
                    : 'Tidak ada perawatan yang terdeteksi atau informasi perawatan tidak tersedia.'}
            </p>
        </div>
    );
};

export default DetectionResults;