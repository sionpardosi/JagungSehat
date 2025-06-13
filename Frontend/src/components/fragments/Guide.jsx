
import { Camera, Upload, Search, CheckCircle } from 'lucide-react';
import scanImage from '../../../public/assets/image/scan-img.png';

const Guide = () => {
    const tutorialSteps = [
        {
            step: '01',
            icon: <Camera className="w-7 h-7 text-green-600" />,
            title: 'Ambil Foto Daun',
            description: 'Foto daun jagung dengan pencahayaan yang cukup dan fokus yang jelas.',
            tips: 'Pastikan daun terlihat jelas tanpa bayangan'
        },
        {
            step: '02',
            icon: <Upload className="w-7 h-7 text-green-600" />,
            title: 'Upload Gambar',
            description: 'Pilih foto dari galeri atau ambil foto langsung melalui kamera.',
            tips: 'Ukuran file maksimal 5MB untuk hasil optimal'
        },
        {
            step: '03',
            icon: <Search className="w-7 h-7 text-green-600" />,
            title: 'Proses Analisis',
            description: 'AI akan menganalisis gambar menggunakan teknologi CNN.',
            tips: 'Proses analisis membutuhkan waktu 5-8 detik'
        },
        {
            step: '04',
            icon: <CheckCircle className="w-7 h-7 text-green-600" />,
            title: 'Lihat Hasil & Solusi',
            description: 'Dapatkan hasil diagnosis lengkap dengan rekomendasi penanganan.',
            tips: 'Simpan hasil untuk referensi di masa mendatang'
        }
    ];

    return (
        <section id='guide' className="py-16 bg-gray-50 relative overflow-hidden">

            <div className="absolute inset-0 opacity-3">
                <div className="absolute top-20 left-10 w-32 h-32 bg-gray-100 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-gray-50 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Title Section */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-green-secondary mb-4">Panduan</h2>
                    <p className="text-gray-secondary leading-relaxed max-w-3xl mx-auto">
                        Deteksi penyakit daun jagung dengan mudah menggunakan teknologi AI. 
                        Ikuti langkah-langkah sederhana untuk mendapatkan diagnosis yang akurat.
                    </p>
                </div>

                {/* Features Section */}
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left Side */}
                    <div className="relative">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">       
                            <div className="relative z-10">
                                <div className="rounded-xl overflow-hidden">
                                    <img 
                                        src={scanImage} 
                                        alt="Scan detection interface showing corn leaf analysis"
                                        className="w-full h-auto shadow-sm hover:shadow-md transition-shadow duration-300"
                                    />
                                </div>
                                <div className="text-center mt-6">
                                    <h3 className="text-xl font-semibold text-green-secondary">
                                        Interface Deteksi
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="space-y-6">
                        {tutorialSteps.map((step, index) => (
                            <div key={index} className="group relative">
                                {index < tutorialSteps.length - 1 && (
                                    <div className="absolute left-6 top-16 w-px h-10 bg-gray-200 group-hover:bg-green-300 transition-colors"></div>
                                )}
                                
                                <div className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg hover:border-green-200 transition-all duration-300 relative">
                                    <div className="flex items-start gap-5">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-2 group-hover:bg-green-50 transition-colors">
                                                {step.icon}
                                            </div>
                                            <div className="text-xs font-bold text-gray-500 text-center">
                                                {step.step}
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                                                {step.title}
                                            </h4>
                                            <p className="text-gray-600 text-base leading-relaxed mb-4">
                                                {step.description}
                                            </p>
                                            <div className="inline-flex items-center gap-2 bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                                {step.tips}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Guide;

