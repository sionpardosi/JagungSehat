import { Link } from "react-router-dom";
import { ArrowRight, Crosshair } from 'lucide-react';
import CornField from "../../../public/assets/image/corn-field.jpg";

export const Header = ({
    data = {
        title: "DETEKSI PENYAKIT PADA DAUN JAGUNG",
        paragraph: "Gunakan teknologi AI canggih untuk mendeteksi penyakit pada daun jagung secara akurat dan mendapatkan rekomendasi penanganan yang tepat untuk hasil panen optimal.",
        backgroundImage: CornField
    }
}) => {
    return (
        <header
            id="header"
            className="relative min-h-screen flex items-center justify-center"
            style={{
                backgroundImage: `url(${data.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/40 to-black/30"></div>
            
            <div className="absolute inset-0 bg-black/20 md:hidden"></div>

            <div className="relative container mx-auto px-4 z-10">
                <div className="grid md:grid-cols-2 items-center">
                    <div className="text-white">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 uppercase tracking-wide text-white drop-shadow-2xl leading-tight">
                            {data.title}
                        </h1>
                        <p className="text-base sm:text-md md:text-lg lg:text-xl mb-6 max-w-xl text-white/95 drop-shadow-lg leading-relaxed">
                            {data.paragraph}
                        </p>

                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <a
                                href="#guide"
                                className="bg-green-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold
                                hover:bg-white hover:text-green-600 transition-all duration-300 
                                shadow-lg hover:shadow-xl flex items-center justify-center gap-2
                                transform hover:-translate-y-1 active:translate-y-0"
                            >
                                <ArrowRight className="h-5 w-5" />
                                Pelajari Lebih Lanjut
                            </a>
                            <Link
                                to="/detection"
                                className="bg-white/10 backdrop-blur-sm border-2 border-white text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold
                                hover:bg-white hover:text-green-600 transition-all duration-300 
                                shadow-lg hover:shadow-xl flex items-center justify-center gap-2
                                transform hover:-translate-y-1 active:translate-y-0"
                            >
                                <Crosshair className="h-5 w-5" />
                                Mulai Deteksi
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </header>
    );
};

export default Header