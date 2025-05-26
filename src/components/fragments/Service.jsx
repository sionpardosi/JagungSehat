import {
    Stethoscope,
    BookOpen,
    Sprout,
    Database
} from 'lucide-react'

const Services = () => {
    const servicesList = [
        {
            icon: Stethoscope,
            title: 'Deteksi Penyakit',
            description: 'Pengguna dapat mengunggah gambar daun jagung untuk dianalisis oleh sistem berbasis AI yang mendeteksi jenis penyakit secara otomatis..'
        },
        {
            icon: BookOpen,
            title: 'Laporan Deteksi Lengkap',
            description: 'Menampilkan hasil deteksi secara rinci, termasuk nama penyakit, penyebab utama, dan rekomendasi penanganan.'
        },
        {
            icon: Sprout,
            title: 'Informasi Penyakit',
            description: 'Halaman khusus yang memuat informasi penyakit jagung yang sering terjadi, gejala, dan cara pencegahannya.'
        },
        {
            icon: Database,
            title: 'Penyimpanan Riwayat',
            description: 'Setiap hasil deteksi disimpan agar pengguna dapat melihat kembali riwayat analisis sebelumnya.'
        }
    ]

    return (
        <section id="services" className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-green-secondary">Layanan</h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {servicesList.map((service, index) => (
                        <div
                            key={index}
                            className="bg-green-50 p-6 rounded-lg text-center hover:shadow-lg transition"
                        >
                            <service.icon className="mx-auto mb-4 w-12 h-12 text-green-600" />
                            <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                            <p className="text-gray-600">{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Services