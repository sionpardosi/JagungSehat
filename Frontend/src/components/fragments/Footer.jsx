import { Github } from 'lucide-react';
import Logo from '../../../public/assets/image/logo.png'

const Footer = () => {
    return (
        <footer className="bg-green-600 text-white pt-10 pb-6 shadow-inner shadow-black/20">
            <div className="container mx-auto px-4 space-y-8">

                {/* Grid 3 Kolom */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-white/90">

                    {/* Kiri - Logo & Slogan */}
                    <div className="flex flex-col items-start">
                        <div className="flex items-center gap-3 mb-2">
                            <img src={Logo} alt="Logo" className="h-10 w-10 drop-shadow-md" />
                            <span className="text-xl font-bold drop-shadow-sm">JAGAT</span>
                        </div>
                        <p className="max-w-sm">Temukan dan lestarikan kekayaan tanaman jagung Indonesia lewat teknologi.</p>
                    </div>

                    {/* Tengah - Kontak */}
                    <div className="flex flex-col items-center text-center">
                        <p className="font-semibold mb-1">Kontak Kami</p>
                        <p>Email: <a href="mailto:jagat@email.com" className="hover:underline">jagat@email.com</a></p>
                        <p>Telepon: <a href="tel:+6281234567890" className="hover:underline">+62 812-3456-7890</a></p>
                    </div>

                    {/* Kanan - Ikuti Kami */}
                    <div className="flex flex-col items-end md:items-center">
                        <p className="font-semibold mb-1">Ikuti kami</p>
                        <a
                            href="https://github.com/sionpardosi/JagungSehat.git"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-white/80 mt-1"
                        >
                            <Github size={22} />
                        </a>
                    </div>
                </div>

                {/* Garis Pemisah */}
                <div className="border-t border-white/30"></div>

                {/* Bagian Bawah */}
                <div className="text-center text-sm text-white/80 space-x-4">
                    <span className="hover:underline">Terms & Conditions</span>
                    <span className="hover:underline">Privacy Policy</span>
                    <span>© 2025 Corn Leaves. All Rights Reserved.</span>
                </div>
            </div>
        </footer>
    )
}

export default Footer