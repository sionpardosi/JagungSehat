import { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../libs/axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Modal from '../../components/ui/Modal';  

const validationSchema = Yup.object().shape({
    name: Yup.string()
        .required('Nama lengkap wajib diisi')
        .min(2, 'Nama minimal 2 karakter'),
    email: Yup.string()
        .email('Format email tidak valid')
        .required('Email wajib diisi'),
    password: Yup.string()
        .required('Password wajib diisi')
        .min(6, 'Password minimal 6 karakter')
        .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password harus mengandung huruf besar, kecil, dan angka'),
    confirmPassword: Yup.string()
        .required('Konfirmasi password wajib diisi')
        .oneOf([Yup.ref('password'), null], 'Password tidak cocok'),
    agreeToTerms: Yup.bool()
        .oneOf([true], 'Anda harus menyetujui syarat dan ketentuan'),
});

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [showModal, setShowModal] = useState(false);  // State for modal visibility
    const navigate = useNavigate();

    const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
        setSubmitError('');

        try {
            console.log('Sending registration data:', {
                username: values.name.trim(),
                email: values.email.toLowerCase(),
                password: values.password,
            });

            const response = await axiosInstance.post('/auth/register', {
                username: values.name.trim(),
                email: values.email.toLowerCase(),
                password: values.password,
            });

            if (response.data && (response.data.success || response.data.user)) {
                const { user, token } = response.data.data || response.data;
                localStorage.setItem('authToken', token);
                localStorage.setItem('userData', JSON.stringify(user));

                // Set the modal visibility and message
                setShowModal(true);
            }
        } catch (error) {
            console.error("Registration error:", error.response?.data);

            if (error.response?.data?.errors) {
                const validationErrors = error.response.data.errors;

                if (Array.isArray(validationErrors)) {
                    validationErrors.forEach(err => {
                        if (err.field) {
                            setFieldError(err.field, err.message);
                        }
                    });
                } else {
                    const errorMessages = Array.isArray(validationErrors)
                        ? validationErrors.map(err => (err.message || err)).join(', ')
                        : error.response.data.message || 'Terjadi kesalahan validasi';

                    setSubmitError(errorMessages);
                }
            } else {
                setSubmitError(error.response?.data?.message || 'Terjadi kesalahan, silakan coba lagi.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const modalMessage = "Registrasi berhasil! Terima kasih telah bergabung. Sekarang Anda bisa mengakses history deteksi dan menyimpan hasil deteksi.";
    
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

                            <Formik
                                initialValues={{
                                    name: '',
                                    email: '',
                                    password: '',
                                    confirmPassword: '',
                                    agreeToTerms: false,
                                }}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ isSubmitting, errors, touched }) => (
                                    <Form className="space-y-5">
                                        {submitError && (
                                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                                <p className="text-red-600 text-sm">{submitError}</p>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                                            <Field
                                                type="text"
                                                name="name"
                                                placeholder="Masukkan nama lengkap Anda"
                                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${errors.name && touched.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                                    }`}
                                                disabled={isSubmitting}
                                            />
                                            <ErrorMessage name="name" component="p" className="mt-1 text-red-600 text-sm" />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                            <Field
                                                type="email"
                                                name="email"
                                                placeholder="Masukkan email Anda"
                                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${errors.email && touched.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                                    }`}
                                                disabled={isSubmitting}
                                            />
                                            <ErrorMessage name="email" component="p" className="mt-1 text-red-600 text-sm" />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                            <div className="relative">
                                                <Field
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    placeholder="Masukkan password Anda"
                                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pr-12 ${errors.password && touched.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                                        }`}
                                                    disabled={isSubmitting}
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    disabled={isSubmitting}
                                                >
                                                    {showPassword ? <EyeOff size={20} className="text-gray-400 hover:text-gray-600" /> : <Eye size={20} className="text-gray-400 hover:text-gray-600" />}
                                                </button>
                                            </div>
                                            <ErrorMessage name="password" component="p" className="mt-1 text-red-600 text-sm" />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password</label>
                                            <div className="relative">
                                                <Field
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    name="confirmPassword"
                                                    placeholder="Konfirmasi password Anda"
                                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pr-12 ${errors.confirmPassword && touched.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                                        }`}
                                                    disabled={isSubmitting}
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    disabled={isSubmitting}
                                                >
                                                    {showConfirmPassword ? <EyeOff size={20} className="text-gray-400 hover:text-gray-600" /> : <Eye size={20} className="text-gray-400 hover:text-gray-600" />}
                                                </button>
                                            </div>
                                            <ErrorMessage name="confirmPassword" component="p" className="mt-1 text-red-600 text-sm" />
                                        </div>

                                        <div className="flex items-start">
                                            <Field
                                                type="checkbox"
                                                name="agreeToTerms"
                                                className="mt-1 mr-3 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                                                disabled={isSubmitting}
                                            />
                                            <label className="text-sm text-gray-600 leading-relaxed">
                                                Saya setuju dengan <a href="#" className="text-green-600 hover:text-green-700 font-medium">Syarat dan Ketentuan</a> serta <a href="#" className="text-green-600 hover:text-green-700 font-medium">Kebijakan Privasi</a>
                                            </label>
                                        </div>
                                        <ErrorMessage name="agreeToTerms" component="p" className="text-red-600 text-sm" />

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`w-full text-white py-3 rounded-lg transition-colors flex items-center justify-center font-medium text-base ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                                                }`}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                    Memproses Registrasi...
                                                </>
                                            ) : (
                                                <>
                                                    <User size={20} className="mr-2" />
                                                    Daftar
                                                </>
                                            )}
                                        </button>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>

            <Modal 
                isOpen={showModal} 
                onClose={() => {
                    setShowModal(false); 
                    navigate('/');  
                }} 
                message={modalMessage} 
            />
        </div>
    );
}