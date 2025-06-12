import Sehat from "../../../public/assets/image/daun-sehat.jpg";
import Bercak from "../../../public/assets/image/daun-bercak.jpeg";
import Hawar from "../../../public/assets/image/daun-hawar.jpeg";
import Karat from "../../../public/assets/image/daun-karat.png";
import useDiseases from "../../hook/disease/useDiseases";

const DiseaseInfo = () => {
  const { diseases, loading, error } = useDiseases();

  const diseaseImages = {
    "bercak": Bercak,
    "hawar": Hawar,
    "karat": Karat,
    "sehat": Sehat,
  };

  if (loading) {
    return (
      <section id="disease-info" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading disease information...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="disease-info" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>Error loading disease information: {error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!diseases || diseases.length === 0) {
    return (
      <section id="disease-info" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              <p>No disease information available at the moment.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="disease-info" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary-600 mb-4 text-green-secondary">
            Informasi Daun Jagung
          </h2>
          <p className="text-secondary-600 max-w-2xl mx-auto text-lg">
            Kenali jenis-jenis daun jagung agar dapat melakukan pencegahan dan penanganan lebih dini.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {diseases.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border p-2 border-gray-200 overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <img
                src={diseaseImages[item.title.toLowerCase()]}
                alt={item.title}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  e.target.src = "";
                }}
              />

              <div className="flex flex-col justify-between p-4">
                <h3 className="text-xl font-bold text-green-secondary mb-2">
                  {item.title.toUpperCase()}
                </h3>
                <p className="text-secondary-600 mb-4">{item.description}</p>

                <h4 className="font-bold mb-2 text-green-secondary">Penyebab & Gejala:</h4>
                <ul className="list-disc pl-5 mb-4 text-secondary-600">
                  {item.symptoms && item.symptoms.length > 0 ? (
                    item.symptoms.map((symptom, idx) => (
                      <li key={idx} className="text-sm">{symptom}</li>
                    ))
                  ) : (
                    <li className="text-sm text-gray-400">No symptoms data available</li>
                  )}
                </ul>

                <h4 className="font-bold mb-2 text-green-secondary">Solusi Penanganan:</h4>
                <ul className="list-disc pl-5 text-secondary-600">
                  {item.treatment && item.treatment.length > 0 ? (
                    item.treatment.map((treat, idx) => (
                      <li key={idx} className="text-sm">{treat}</li>
                    ))
                  ) : (
                    <li className="text-sm text-gray-400">No treatment data available</li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DiseaseInfo;