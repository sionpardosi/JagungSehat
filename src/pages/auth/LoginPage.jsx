import { useState } from 'react';
import { Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);

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

                            <form className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="Masukkan email Anda"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Masukkan password Anda"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pr-12"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff size={20} className="text-gray-400 hover:text-gray-600" />
                                            ) : (
                                                <Eye size={20} className="text-gray-400 hover:text-gray-600" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center font-medium text-base"
                                >
                                    <LogIn size={20} className="mr-2" /> 
                                    Masuk
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