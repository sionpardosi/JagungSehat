import { useState } from 'react';
import { Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.email) {
            newErrors.email = 'Email wajib diisi';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Format email tidak valid';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password wajib diisi';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password minimal 6 karakter';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Mock login API call with role-based routing
    const mockLoginAPI = async (email, password) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock user data dengan role - nanti ini diganti dengan real API
        const mockUsers = [
            { 
                id: 1, 
                email: 'user@test.com', 
                password: 'password123',
                name: 'John Doe',
                role: 'user' // Regular user -> redirect ke home
            },
            { 
                id: 2, 
                email: 'admin@test.com', 
                password: 'admin123',
                name: 'Admin User',
                role: 'admin' // Admin user -> redirect ke dashboard
            },
            // Tambahan dummy users
            { 
                id: 3, 
                email: 'petani@test.com', 
                password: 'petani123',
                name: 'Petani Jagung',
                role: 'user'
            },
            { 
                id: 4, 
                email: 'superadmin@test.com', 
                password: 'super123',
                name: 'Super Admin',
                role: 'admin'
            }
        ];
        
        const user = mockUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Mock JWT token dengan role
            const mockToken = btoa(JSON.stringify({
                userId: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
            }));
            
            return {
                success: true,
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role
                    },
                    token: mockToken
                }
            };
        } else {
            throw new Error('Email atau password salah');
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsLoading(true);
        
        try {
            const response = await mockLoginAPI(formData.email, formData.password);
            
            if (response.success) {
                const { user, token } = response.data;
                
                // Save to localStorage (nanti diganti dengan proper auth context)
                localStorage.setItem('authToken', token);
                localStorage.setItem('userData', JSON.stringify(user));
                
                // Role-based routing
                if (user.role === 'admin') {
                    alert(`Selamat datang Admin, ${user.name}! Redirecting to Dashboard...`);
                    navigate('/dashboard');
                } else if (user.role === 'user') {
                    alert(`Selamat datang ${user.name}! Redirecting to Home...`);
                    navigate('/'); // atau '/home' tergantung routing kamu
                } else {
                    // Fallback jika role tidak dikenali
                    alert('Login berhasil! Redirecting...');
                    navigate('/');
                }
            }
        } catch (error) {
            setErrors({
                submit: error.message
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 relative flex items-center justify-center p-4">
            <Link to={"/"} className="absolute top-6 left-6 text-green-600 bg-white/80 hover:bg-white p-3 rounded-full transition-colors flex items-center space-x-2 shadow-md z-10">
                <ArrowLeft size={20} />
                <span className="hidden sm:inline text-sm font-medium">Kembali</span>
            </Link>

            <div className="w-full max-w-4xl">
                <div className="flex w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="hidden lg:flex w-1/2 bg-green-600 text-white p-12 flex-col justify-center">
                        <h1 className="text-3xl font-bold mb-4">Selamat Datang Kembali</h1>
                        <p className="text-green-100 text-base leading-relaxed">
                            Deteksi penyakit daun jagung dengan teknologi AI canggih dan solusi pertanian presisi untuk hasil panen yang optimal.
                        </p>
                        <div className="mt-8">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                                <span className="text-green-100 text-sm">Akurasi tinggi hingga 95%</span>
                            </div>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                                <span className="text-green-100 text-sm">Deteksi instan dalam hitungan detik</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                                <span className="text-green-100 text-sm">Rekomendasi penanganan terpercaya</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 p-8 lg:p-12">
                        <div className="max-w-sm mx-auto">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Masuk ke Akun</h2>
                                <p className="text-gray-600 text-sm">
                                    Belum punya akun? <Link to={"/auth/register"} className="text-green-600 hover:text-green-700 font-medium">Daftar di sini</Link>
                                </p>
                            </div>

                            {/* Demo accounts info */}
                            <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-xs text-blue-600 font-medium mb-1">Demo Accounts:</p>
                                <p className="text-xs text-blue-600">• user@test.com / password123</p>
                                <p className="text-xs text-blue-600">• petani@test.com / petani123</p>
                                <p className="text-xs text-blue-600">• superadmin@test.com / super123</p>
                                <p className="text-xs text-blue-600">• admin@test.com / admin123</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {errors.submit && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-red-600 text-sm">{errors.submit}</p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Masukkan email Anda"
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                                            errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                        disabled={isLoading}
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-red-600 text-sm">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Masukkan password Anda"
                                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pr-12 ${
                                                errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowPassword(!showPassword)}
                                            disabled={isLoading}
                                        >
                                            {showPassword ? (
                                                <EyeOff size={20} className="text-gray-400 hover:text-gray-600" />
                                            ) : (
                                                <Eye size={20} className="text-gray-400 hover:text-gray-600" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1 text-red-600 text-sm">{errors.password}</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <div></div>
                                    <Link 
                                        to="/auth/forgot-password" 
                                        className="text-sm text-green-600 hover:text-green-700 font-medium"
                                    >
                                        Lupa password?
                                    </Link>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full text-white py-3 rounded-lg transition-colors flex items-center justify-center font-medium text-base ${
                                        isLoading 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-green-600 hover:bg-green-700'
                                    }`}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Memproses...
                                        </>
                                    ) : (
                                        <>
                                            <LogIn size={20} className="mr-2" /> 
                                            Masuk
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="lg:hidden mt-8 text-center">
                                <p className="text-gray-600 text-sm">
                                    Deteksi penyakit daun jagung dengan teknologi AI untuk hasil panen yang optimal
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}