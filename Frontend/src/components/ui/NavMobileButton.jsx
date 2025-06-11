import { Link } from 'react-router-dom';

const NavMobileButton = ({ item, activeLink, handleNavLinkClick }) => {
    return (
        <>
            {item.href.startsWith('/') ? (
                <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => handleNavLinkClick(item.href)}
                    className={`flex items-center px-6 py-4 text-base font-medium transition-all duration-200
                        ${activeLink === item.href
                            ? 'text-green-primary bg-green-50 border-r-3 border-green-primary'
                            : 'text-gray-primary hover:text-green-primary hover:bg-green-50/50 hover:translate-x-1'}   
                        relative group`}
                >
                    <span>{item.label}</span>
                    {activeLink === item.href && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-primary"></div>
                    )}
                </Link>
            ) : (
                <a
                    key={item.href}
                    href={item.href}
                    onClick={() => handleNavLinkClick(item.href)}
                    className={`flex items-center px-6 py-4 text-base font-medium transition-all duration-200
                        ${activeLink === item.href
                            ? 'text-green-primary bg-green-50 border-r-3 border-green-primary'
                            : 'text-gray-primary hover:text-green-primary hover:bg-green-50/50 hover:translate-x-1'}   
                        relative group`}
                >
                    <span>{item.label}</span>
                    {activeLink === item.href && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-primary"></div>
                    )}
                </a>
            )
            }
        </>
    );
};

export default NavMobileButton;