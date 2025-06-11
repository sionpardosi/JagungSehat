import Leaves from "../../../public/assets/image/corn-leaves.png";

const DiseaseInfo = () => {
  const diseaseList = [
    {
      image: Leaves,
      title: "Hawar Daun (Leaf Blight)",
      description: "Penyakit ini menyebabkan bercak coklat memanjang pada daun dan bisa mengurangi hasil panen secara signifikan.",
      symptoms: ["Bercak coklat memanjang di daun", "Daun mengering mulai dari ujung", "Pertumbuhan tanaman terhambat"],
      treatment: [
        "Gunakan varietas jagung tahan penyakit",
        "Lakukan rotasi tanaman secara rutin",
        "Semprotkan fungisida berbahan aktif mancozeb atau propineb",
      ],
    },
    {
      image: Leaves,
      title: "Karat Daun (Common Rust)",
      description: "Karat daun disebabkan oleh jamur Puccinia sorghi dan umum terjadi di daerah dengan kelembaban tinggi.",
      symptoms: ["Bintik-bintik kecil berwarna merah kecoklatan", "Daun menguning dan mengering lebih cepat", "Penurunan fotosintesis tanaman"],
      treatment: [
        "Gunakan fungisida sistemik saat gejala awal muncul",
        "Pangkas dan buang daun yang terinfeksi",
        "Pilih benih yang tahan karat",
      ],
    },
    {
      image: Leaves,
      title: "Bercak Daun Gray (Gray Leaf Spot)",
      description: "Penyakit ini disebabkan oleh jamur *Cercospora zeae-maydis* dan menyebar melalui percikan air hujan.",
      symptoms: ["Bercak abu-abu berbentuk persegi panjang di daun", "Daun tampak seperti terbakar", "Produksi tongkol berkurang drastis"],
      treatment: [
        "Perbaiki sirkulasi udara antar tanaman",
        "Aplikasi fungisida berbahan aktif strobilurin",
        "Tanam pada jarak yang disarankan untuk mengurangi kelembaban",
      ],
    },
    {
      image: Leaves,
      title: "Daun Sehat (Healthy Leaves)",
      description: "Daun jagung yang sehat memiliki warna hijau cerah dan pertumbuhan yang baik, menunjukkan tanaman dalam kondisi optimal.",
      symptoms: ["Warna hijau cerah", "Daun utuh tanpa bercak", "Pertumbuhan yang baik dan kuat"],
      treatment: [
        "Pastikan penyiraman yang cukup",
        "Berikan pupuk yang seimbang",
        "Lindungi dari hama dan penyakit",
      ],
    },
  ];

  return (
    <section id="disease-info" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary-600 mb-4 text-green-secondary">Informasi Penyakit Daun Jagung</h2>
          <p className="text-secondary-600 max-w-2xl mx-auto text-lg">
            Kenali jenis-jenis penyakit pada daun jagung agar dapat melakukan pencegahan dan penanganan lebih dini.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {diseaseList.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border p-2 border-gray-200 overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <img src={item.image} alt={item.title} className="w-full h-64 object-cover" />
              <div className="flex flex-col justify-between p-4">
                <h3 className="text-xl font-semibold text-primary-600 mb-2">{item.title}</h3>
                <p className="text-secondary-600 mb-4">{item.description}</p>

                <h4 className="font-bold mb-2 text-gray-700">Penyebab & Gejala:</h4>
                <ul className="list-disc pl-5 mb-4 text-secondary-600">
                  {item.symptoms.map((symptom, idx) => (
                    <li key={idx} className="text-sm">{symptom}</li>
                  ))}
                </ul>

                <h4 className="font-bold mb-2 text-gray-700">Solusi Penanganan:</h4>
                <ul className="list-disc pl-5 text-secondary-600">
                  {item.treatment.map((treat, idx) => (
                    <li key={idx} className="text-sm">{treat}</li>
                  ))}
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