import Logo from '../../../public/assets/image/logo.png'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="bg-green-600 text-white py-6 shadow-inner shadow-black/20">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">

                <div className="flex items-center gap-2">
                    <img src={Logo} alt="Logo" className="h-8 w-8 drop-shadow-md" />
                    <span className="text-lg font-semibold drop-shadow-sm">JAGAT</span>
                </div>

                <div className="text-sm text-white/80 text-center md:text-left drop-shadow-sm">
                    © 2025 Corn Leaves. All Rights Reserved.
                </div>

                <div className="flex gap-4 text-sm text-white/90">
                    <Link to="/terms" className="hover:underline">Terms & Conditions</Link>
                    <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
                </div>
            </div>
        </footer>
    )
}

export default Footer