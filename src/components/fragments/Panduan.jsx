import {
    Camera,
    TrendingUp,
    FolderOpenDot
} from 'lucide-react'

const Panduan = () => {
    const panduanList = [
        {
            icon: Camera ,
            title: 'Unggah Foto',
            description: 'Ambil foto daun jagung yang jelas atau unggah gambar yang sudah ada untuk memulai proses analisis..'
        },
        {
            icon: TrendingUp,
            title: 'Analisis AI',
            description: 'Model CNN DenseNet kami akan memproses gambar dan mengidentifikasi penyakit dengan akurasi tinggi berdasarkan pola visual.'
        },
        {
            icon: FolderOpenDot,
            title: 'Hasil Deteksi',
            description: 'Terima hasil deteksi secara lengkap beserta informasi penyakit, penyebabnya, dan rekomendasi tindakan penanganan.'
        }
    ]

    return (
        <section id="panduan" className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12 text-green-secondary">Panduan</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {panduanList.map((feature, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow text-center hover:shadow-lg">
                            <feature.icon className="mx-auto mb-4 w-12 h-12 text-green-500" />
                            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Panduan