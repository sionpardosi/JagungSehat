import { Cpu, Target, Users } from 'lucide-react';

const About = () => {
    const features = [
        {
            icon: <Cpu className="mx-auto mb-4 w-12 h-12 text-green-600" />,
            title: 'Teknologi AI Terkini',
            description: 'Model CNN kami mengenali pola visual pada daun secara cerdas untuk mendeteksi berbagai jenis penyakit secara otomatis.',
        },
        {
            icon: <Target className="mx-auto mb-4 w-12 h-12 text-green-600" />,
            title: 'Akurat & Efisien',
            description: 'Analisis dilakukan dalam hitungan detik dengan hasil yang presisi untuk memudahkan pengambilan keputusan cepat di lapangan.',
        },
        {
            icon: <Users className="mx-auto mb-4 w-12 h-12 text-green-600" />,
            title: 'Praktis',
            description: 'Desain antarmuka sederhana memungkinkan siapa pun untuk menggunakan pendeteksi.',
        },
    ];

    return (
        <section id='about' className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-green-secondary">Tentang</h2>
                    <p className="text-gray-secondary mt-4 max-w-2xl mx-auto">
                        Alat kami yang didukung oleh CNN membantu petani mengidentifikasi penyakit pada daun jagung 
                        dengan cepat dan akurat, memungkinkan pencegahan dini dan perlindungan pada tanaman jagung.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-green-50 p-6 rounded-lg text-center">
                            {feature.icon}
                            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                            <p className="text-gray-secondary">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;