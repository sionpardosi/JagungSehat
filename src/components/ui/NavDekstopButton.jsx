import { Link } from 'react-router-dom';

const NavDekstopButton = ({ item, isScrolled, activeLink, handleNavLinkClick }) => {
    return (
        <>
            {item.href.startsWith('/') ? (
                <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => handleNavLinkClick(item.href)}
                    className={`relative group transition-colors duration-300 font-medium
                        ${isScrolled
                            ? 'text-gray-primary hover:text-green-primary'
                            : 'text-white hover:text-white drop-shadow-md'}
                        ${isScrolled && activeLink === item.href ? 'text-green-primary' : ''}`}
                >
                    {item.label}
                    <span
                        className={`absolute bottom-[-3px] left-0 h-[2px]
                            transition-all duration-300
                            ${isScrolled ? 'bg-green-primary' : 'bg-white'}
                            ${activeLink === item.href || 'group-hover:w-full'}
                            ${activeLink === item.href ? 'w-full' : 'w-0 group-hover:w-full'}`}
                    ></span>
                </Link>
            ) : (
                <a
                    key={item.href}
                    href={item.href}
                    onClick={() => handleNavLinkClick(item.href)}
                    className={`relative group transition-colors duration-300 font-medium
                        ${isScrolled
                            ? 'text-gray-primary hover:text-green-primary'
                            : 'text-white hover:text-white drop-shadow-md'}
                        ${isScrolled && activeLink === item.href ? 'text-green-primary' : ''}`}
                >
                    {item.label}
                    <span
                        className={`absolute bottom-[-3px] left-0 h-[2px]
                            transition-all duration-300
                            ${isScrolled ? 'bg-green-primary' : 'bg-white'}
                            ${activeLink === item.href || 'group-hover:w-full'}
                            ${activeLink === item.href ? 'w-full' : 'w-0 group-hover:w-full'}`}
                    ></span>
                </a>
            )}
        </>
    );
};

export default NavDekstopButton;