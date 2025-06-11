const DetectionResults = ({ result }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            {result ? (
                <div>
                    <h3 className="text-2xl font-semibold text-green-700 mb-2">{result.title}</h3>
                    <p className="text-gray-700 mb-4">{result.description}</p>
                    <h4 className="font-bold">Gejala:</h4>
                    <p className="text-gray-600 mb-4">{result.symptoms}</p>
                    <h4 className="font-bold">Perawatan:</h4>
                    <p className="text-gray-600">{result.treatment}</p>
                </div>
            ) : (
                <p className="text-gray-500">Tidak ada hasil yang ditemukan.</p>
            )}
        </div>
    );
};

export default DetectionResults;