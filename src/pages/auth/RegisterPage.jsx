import { useState } from 'react';
import { Eye, EyeOff, UserPlus, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Clear error when user starts typing/changing
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
        
        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Nama lengkap wajib diisi';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Nama minimal 2 karakter';
        }
        
        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email wajib diisi';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Format email tidak valid';
        }
        
        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password wajib diisi';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password minimal 6 karakter';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password harus mengandung huruf besar, kecil, dan angka';
        }
        
        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Konfirmasi password wajib diisi';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Password tidak cocok';
        }
        
        // Terms validation
        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = 'Anda harus menyetujui syarat dan ketentuan';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Check if email already exists (mock function)
    const checkEmailExists = async (email) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock existing emails (admin emails already registered)
        const existingEmails = [
            'admin@test.com', // Example admin account
            'user@test.com',   // Example user account
            // other emails
        ];
        
        return existingEmails.includes(email.toLowerCase());
    };

    // Mock register API call
    const mockRegisterAPI = async (userData) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check if email already exists
        const emailExists = await checkEmailExists(userData.email);
        if (emailExists) {
            throw new Error('Email sudah terdaftar, gunakan email lain');
        }
        
        // Only allow registration for 'user' role
        if (userData.role === 'admin') {
            throw new Error('Admin tidak bisa mendaftar, akun admin sudah dibuat sebelumnya');
        }
        
        // Generate new user ID
        const newUserId = Date.now();
        
        // Create new user object
        const newUser = {
            id: newUserId,
            name: userData.name,
            email: userData.email,
            role: 'user', // Default role is 'user'
            createdAt: new Date().toISOString(),
            isActive: true
        };
        
        // Mock JWT token for new user
        const mockToken = btoa(JSON.stringify({
            userId: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        }));
        
        return {
            success: true,
            message: 'Registrasi berhasil!',
            data: {
                user: newUser,
                token: mockToken
            }
        };
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsLoading(true);
        
        try {
            const response = await mockRegisterAPI({
                name: formData.name.trim(),
                email: formData.email.toLowerCase(),
                password: formData.password,
            });
            
            if (response.success) {
                const { user, token } = response.data;
                
                // Save to localStorage
                localStorage.setItem('authToken', token);
                localStorage.setItem('userData', JSON.stringify(user));
                
                // Success message and role-based routing
                alert(`🎉 Registrasi berhasil! Selamat datang ${user.name}! Redirecting to Home...`);
                navigate('/'); // Redirect to Home page for users
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
                        <h1 className="text-3xl font-bold mb-4">Bergabung dengan Kami</h1>
                        <p className="text-green-100 text-base leading-relaxed">
                            Daftar sekarang untuk mengakses teknologi AI canggih dalam mendeteksi penyakit daun jagung dan meningkatkan hasil panen Anda.
                        </p>
                    </div>

                    <div className="w-full lg:w-1/2 p-8 lg:p-12">
                        <div className="max-w-sm mx-auto">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Buat Akun Baru</h2>
                                <p className="text-gray-600 text-sm">
                                    Sudah punya akun? <Link to="/auth/login" className="text-green-600 hover:text-green-700 font-medium">Masuk di sini</Link>
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {errors.submit && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-red-600 text-sm">{errors.submit}</p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Masukkan nama lengkap Anda"
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                                        disabled={isLoading}
                                    />
                                    {errors.name && <p className="mt-1 text-red-600 text-sm">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Masukkan email Anda"
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                                        disabled={isLoading}
                                    />
                                    {errors.email && <p className="mt-1 text-red-600 text-sm">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Masukkan password Anda"
                                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pr-12 ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowPassword(!showPassword)}
                                            disabled={isLoading}
                                        >
                                            {showPassword ? <EyeOff size={20} className="text-gray-400 hover:text-gray-600" /> : <Eye size={20} className="text-gray-400 hover:text-gray-600" />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="mt-1 text-red-600 text-sm">{errors.password}</p>}
                                    <p className="mt-1 text-gray-500 text-xs">Minimal 6 karakter, harus ada huruf besar, kecil, dan angka</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Konfirmasi password Anda"
                                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pr-12 ${errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            disabled={isLoading}
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} className="text-gray-400 hover:text-gray-600" /> : <Eye size={20} className="text-gray-400 hover:text-gray-600" />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && <p className="mt-1 text-red-600 text-sm">{errors.confirmPassword}</p>}
                                </div>

                                <div className="flex items-start">
                                    <input 
                                        type="checkbox" 
                                        id="terms" 
                                        name="agreeToTerms"
                                        checked={formData.agreeToTerms}
                                        onChange={handleChange}
                                        className="mt-1 mr-3 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                                        disabled={isLoading}
                                    />
                                    <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                                        Saya setuju dengan <a href="#" className="text-green-600 hover:text-green-700 font-medium">Syarat dan Ketentuan</a> serta <a href="#" className="text-green-600 hover:text-green-700 font-medium">Kebijakan Privasi</a>
                                    </label>
                                </div>
                                {errors.agreeToTerms && <p className="text-red-600 text-sm">{errors.agreeToTerms}</p>}

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
                                            Memproses Registrasi...
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus size={20} className="mr-2" /> 
                                            Daftar
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}