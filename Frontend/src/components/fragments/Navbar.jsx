import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // <--- Import useNavigate
import Logo from '../../../public/assets/image/logo.png';
import NavButton from '../ui/NavDekstopButton';
import NavMobileButton from '../ui/NavMobileButton';

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeLink, setActiveLink] = useState('#header');
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    const navigate = useNavigate(); // <--- Initialize useNavigate

    // Updated navItems
    const navItems = [
        { href: '#header', label: 'Beranda' },
        { href: '#about', label: 'Tentang' },
        { href: '#guide', label: 'Panduan' },
        { href: '#disease-info', label: 'Informasi Penyakit' },
        { href: '/detection', label: 'Deteksi' },
        ...(isLoggedIn ? [{ href: '/history', label: 'Riwayat Deteksi' }] : []), 
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsLoggedIn(true); 
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken'); 
        setIsLoggedIn(false); 
        navigate('/auth/login'); // <--- Navigate to login page after logout
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleNavLinkClick = (href) => {
        setActiveLink(href);
        setIsOpen(false);

        if (href.startsWith('#')) {
            setTimeout(() => {
                const element = document.getElementById(href.substring(1));
                if (element) {
                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 100);
        }
    };

    const handleLogoClick = (e) => {
        e.preventDefault();
        setActiveLink('#header');
        setIsOpen(false);

        if (window.location.pathname === '/') {
            const headerElement = document.getElementById('header');
            if (headerElement) {
                headerElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } else {
            window.location.href = '/#header';
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleScrollClose = () => {
            if (isOpen) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            window.addEventListener('scroll', handleScrollClose);
            return () => window.removeEventListener('scroll', handleScrollClose);
        }
    }, [isOpen]);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full  
                ${isScrolled
                    ? 'bg-white/90 backdrop-blur-md shadow-md'
                    : 'bg-transparent'}`}
        >
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <a
                    href="#header"
                    onClick={handleLogoClick}
                    className="flex items-center cursor-pointer"
                >
                    <img
                        src={Logo}
                        alt="Logo"
                        className="h-10 w-10 mr-2"
                    />
                    <span className={`text-2xl font-bold transition-colors duration-300  
                        ${isScrolled
                            ? 'text-green-primary'
                            : 'text-white drop-shadow-md'}`}>
                        JAGAT
                    </span>
                </a>

                {/* Desktop Navigation */}
                <div className="hidden md:flex space-x-6 items-center">
                    {navItems.map((item) => (
                        <NavButton
                            key={item.href}
                            item={item}
                            isScrolled={isScrolled}
                            activeLink={activeLink}
                            handleNavLinkClick={handleNavLinkClick}
                        />
                    ))}

                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className={`px-4 py-2 rounded-lg transition-colors duration-300  
                                ${isScrolled
                                    ? 'bg-green-tertiary text-white hover:bg-green-primary'
                                    : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'}`}
                        >
                            Logout
                        </button>
                    ) : (
                        <Link
                            to="/auth/login"
                            className={`px-4 py-2 rounded-lg transition-colors duration-300  
                                ${isScrolled
                                    ? 'bg-green-tertiary text-white hover:bg-green-primary'
                                    : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'}`}
                        >
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden">
                    <button
                        onClick={toggleMenu}
                        className={`p-2 rounded-lg transition-colors duration-300   
                            ${isScrolled
                                ? 'text-green-primary hover:bg-green-50'
                                : 'text-white hover:bg-white/10'}`}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="fixed inset-0 z-50 md:hidden">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={toggleMenu}
                        ></div>

                        {/* Mobile Menu Panel */}
                        <div className="relative bg-white h-full overflow-y-auto shadow-2xl">
                            {/* Header */}
                            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-white">
                                <a
                                    href="#header"
                                    onClick={handleLogoClick}
                                    className="flex items-center cursor-pointer"
                                >
                                    <img
                                        src={Logo}
                                        alt="Logo"
                                        className="h-10 w-10 mr-3"
                                    />
                                    <span className="text-2xl font-bold text-green-primary">
                                        Corn Leaves
                                    </span>
                                </a>
                                <button
                                    onClick={toggleMenu}
                                    className="p-2 rounded-lg text-gray-500 hover:text-gray-primary hover:bg-gray-100 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Navigation Links */}
                            <div className="py-4">
                                {navItems.map((item) => (
                                    <NavMobileButton
                                        key={item.href}
                                        item={item}
                                        activeLink={activeLink}
                                        handleNavLinkClick={handleNavLinkClick}
                                    />
                                ))}
                            </div>

                            {/* Conditional Rendering in Mobile Menu */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gray-50 border-t border-gray-100">
                                {isLoggedIn ? (
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center justify-center w-full py-3 px-4  
                                            bg-green-primary text-white font-medium rounded-lg hover:bg-green-tertiary 
                                            transition-colors duration-200 shadow-md"
                                    >
                                        Logout
                                    </button>
                                ) : (
                                    <Link
                                        to="/auth/login"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center justify-center w-full py-3 px-4   
                                            bg-green-primary text-white font-medium rounded-lg hover:bg-green-tertiary 
                                            transition-colors duration-200 shadow-md"
                                    >
                                        Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>          
        </nav>
    );
}

export default Navbar;