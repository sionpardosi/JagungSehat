import React, { useState, useRef, useEffect } from 'react';
import { Upload, Camera, X, RefreshCw, ArrowLeft, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../libs/axios/index';
import DetectionResults from '../../components/ui/DetectionResult';

const DetectionPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [captureMode, setCaptureMode] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);
    const [detectionResult, setDetectionResult] = useState(null);
    const [diseases, setDiseases] = useState([]);
    const [diseasesLoading, setDiseasesLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const fetchDiseases = async () => {
            try {
                setDiseasesLoading(true);
                const response = await axiosInstance.get('/diseases');
                const diseasesArray = response.data?.data || response.data || [];
                setDiseases(diseasesArray);
            } catch (error) {
                setErrorMessage('Gagal memuat data penyakit. Silakan refresh halaman.' + error);
            } finally {
                setDiseasesLoading(false);
            }
        };

        fetchDiseases();
    }, []);

    useEffect(() => {
        if (location.state?.capturedImage) {
            setPreviewImage(location.state.capturedImage);
            const blob = dataURLtoBlob(location.state.capturedImage);
            setSelectedImage(blob);
        }
    }, [location.state]);

    const dataURLtoBlob = (dataURL) => {
        const byteString = atob(dataURL.split(',')[1]);
        const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    };

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage(null);
            }, 8000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const MAX_SIZE_MB = 5;
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            setErrorMessage('Ukuran gambar terlalu besar! Maksimal 5MB. Silakan pilih gambar yang lebih kecil.');
            return;
        }

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            setErrorMessage('Format gambar tidak didukung! Gunakan format JPG, PNG, atau WebP.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedImage(file);
            setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const file = event.dataTransfer.files[0];
        if (!file || !file.type.startsWith('image/')) {
            setErrorMessage('Silakan drop file gambar yang valid (JPG, PNG, atau WebP).');
            return;
        }

        const MAX_SIZE_MB = 5;
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            setErrorMessage('Ukuran gambar terlalu besar! Maksimal 5MB. Silakan pilih gambar yang lebih kecil.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedImage(file);
            setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const captureImage = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);

        const stream = video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());

        canvas.toBlob((blob) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(blob);
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(blob);
            setCaptureMode(false);
        }, 'image/jpeg', 0.8);
    };

    const cancelCapture = () => {
        if (videoRef.current?.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setCaptureMode(false);
    };

    const resetImage = () => {
        setSelectedImage(null);
        setPreviewImage(null);
        setDetectionResult(null);
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const detectDisease = async (image) => {
        const formData = new FormData();
        formData.append('image', image);

        try {
            const response = await axiosInstance.post('/scan', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            if (error.response?.data?.message) {
                if (error.response.data.message.includes('not reliable') || error.response.data.message.includes('disease ID is null')) {
                    return {
                        errorType: 'unreliable',
                        errorMessage: 'Prediksi tidak dapat diandalkan. Model AI tidak dapat memberikan hasil yang akurat untuk gambar ini.'
                    };
                }
                return { errorMessage: error.response.data.message };
            }
            return { errorMessage: 'Terjadi kesalahan saat mendeteksi penyakit. Silakan coba lagi.' };
        }
    };

    const handleDetection = async () => {
        const userIsLoggedIn = true; 

        if (!userIsLoggedIn) {
            setErrorMessage('Anda harus login untuk melakukan deteksi.');
            return;
        }

        if (!selectedImage) {
            setErrorMessage('Silakan pilih atau ambil gambar terlebih dahulu.');
            return;
        }

        if (diseasesLoading) {
            setErrorMessage('Data penyakit sedang dimuat. Silakan tunggu sebentar.');
            return;
        }

        if (!Array.isArray(diseases) || diseases.length === 0) {
            setErrorMessage('Data penyakit tidak tersedia. Silakan refresh halaman.');
            return;
        }

        setIsDetecting(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const result = await detectDisease(selectedImage);

            if (result.errorType === 'unreliable') {
                setDetectionResult({
                    id: 'unreliable',
                    title: 'Deteksi Tidak Dapat Dipastikan',
                    name: 'unclear',
                    description: 'Model AI tidak dapat memberikan prediksi yang dapat diandalkan untuk gambar ini. Hal ini bisa disebabkan oleh kualitas gambar yang kurang optimal.',
                    symptoms: [
                        'Gambar mungkin terlalu blur atau gelap',
                        'Pencahayaan kurang memadai',
                        'Daun tidak terlihat dengan jelas',
                        'Sudut pengambilan gambar kurang tepat',
                        'Background mengganggu fokus deteksi'
                    ],
                    treatment: [
                        'Ambil foto ulang dengan pencahayaan yang lebih baik',
                        'Pastikan daun jagung terlihat jelas dan fokus',
                        'Gunakan background yang kontras dengan daun',
                        'Ambil foto dari jarak yang lebih dekat',
                        'Hindari bayangan yang menutupi daun',
                        'Gunakan kamera dengan resolusi yang lebih baik'
                    ],
                    confidence: 0,
                    confidencePercentage: 0,
                    isUnreliable: true,
                    timestamp: new Date().toISOString()
                });

                setErrorMessage('Deteksi tidak dapat dipastikan. Silakan ikuti saran di bawah untuk meningkatkan kualitas foto.');
                return;
            }

            // Handle any error message returned from the detection
            if (result.errorMessage) {
                setErrorMessage(result.errorMessage);
                return;
            }

            // Handle successful detection
            if (result.success && result.data) {
                const detectionData = result.data;

                // Check if the disease information is available
                if (detectionData.disease) {
                    const diseaseInfo = detectionData.disease;
                    const confidence = detectionData.confidence || 0;

                    // Handle low confidence scenario
                    if (confidence < 0.75) {
                        setDetectionResult({
                            id: 'low-confidence',
                            title: 'Tingkat Kepercayaan Rendah',
                            name: 'low_confidence',
                            description: `Deteksi berhasil dilakukan namun tingkat kepercayaan hanya ${Math.round(confidence * 100)}%. Hasil mungkin kurang akurat.`,
                            symptoms: [
                                'Kualitas gambar mungkin kurang optimal',
                                'Pencahayaan tidak memadai',
                                'Fokus gambar kurang tajam'
                            ],
                            treatment: [
                                'Ambil foto dengan kualitas yang lebih baik',
                                'Pastikan pencahayaan memadai',
                                'Gunakan kamera dengan resolusi tinggi',
                                'Konsultasikan dengan ahli pertanian untuk memastikan'
                            ],
                            confidence,
                            confidencePercentage: Math.round(confidence * 100),
                            imagePath: detectionData.imagePath,
                            timestamp: detectionData.timestamp,
                            isLowConfidence: true,
                            possibleDisease: diseaseInfo.title
                        });

                        setErrorMessage(`Tingkat kepercayaan rendah (${Math.round(confidence * 100)}%). Hasil deteksi mungkin kurang akurat.`);
                        return;
                    }

                    // Transforming successful result
                    const transformedResult = {
                        id: detectionData.diseaseId,
                        title: diseaseInfo.title,
                        name: diseaseInfo.name,
                        description: diseaseInfo.description,
                        symptoms: Array.isArray(diseaseInfo.symptoms)
                            ? diseaseInfo.symptoms
                            : diseaseInfo.symptoms?.split(/[,;|]/).map(s => s.trim()) || [],
                        treatment: Array.isArray(diseaseInfo.treatment)
                            ? diseaseInfo.treatment
                            : diseaseInfo.treatment?.split(/[,;|]/).map(s => s.trim()) || [],
                        confidence,
                        confidencePercentage: Math.round(confidence * 100),
                        imagePath: detectionData.imagePath,
                        timestamp: detectionData.timestamp,
                        diseaseName: detectionData.diseaseName
                    };

                    setDetectionResult(transformedResult);
                    setSuccessMessage(`Deteksi berhasil! Penyakit "${diseaseInfo.title}" teridentifikasi dengan tingkat kepercayaan ${Math.round(confidence * 100)}%.`);

                } else {
                    // Fallback for undefined disease data
                    const diseaseName = detectionData.diseaseName || detectionData.disease_name || detectionData.name;

                    if (!diseaseName) {
                        setErrorMessage('Hasil deteksi tidak valid. Data penyakit tidak ditemukan dalam response.');
                        return;
                    }

                    // Find disease in local database
                    const disease = diseases.find(d =>
                        d.name?.toLowerCase() === diseaseName.toLowerCase() ||
                        d.title?.toLowerCase().includes(diseaseName.toLowerCase()) ||
                        d.id?.toString() === detectionData.diseaseId?.toString()
                    );

                    const confidence = detectionData.confidence || 0;

                    if (disease) {
                        const transformedResult = {
                            ...disease,
                            confidence,
                            confidencePercentage: Math.round(confidence * 100),
                            imagePath: detectionData.imagePath,
                            timestamp: detectionData.timestamp,
                            diseaseName: detectionData.diseaseName
                        };

                        setDetectionResult(transformedResult);
                        setSuccessMessage(`Deteksi berhasil! Penyakit "${disease.title}" teridentifikasi dengan tingkat kepercayaan ${Math.round(confidence * 100)}%.`);
                    } else {
                        const fallbackResult = {
                            id: detectionData.diseaseId || 'unknown',
                            title: diseaseName,
                            name: diseaseName.toLowerCase(),
                            description: 'Penyakit terdeteksi namun informasi detail tidak tersedia dalam database lokal.',
                            symptoms: ['Informasi gejala tidak tersedia'],
                            treatment: ['Konsultasikan dengan ahli pertanian untuk penanganan yang tepat'],
                            confidence,
                            confidencePercentage: Math.round(confidence * 100),
                            imagePath: detectionData.imagePath,
                            timestamp: detectionData.timestamp,
                            diseaseName: detectionData.diseaseName,
                            isUnknown: true
                        };

                        setDetectionResult(fallbackResult);
                        setErrorMessage(`Penyakit "${diseaseName}" terdeteksi namun tidak ditemukan dalam database informasi lokal.`);
                    }
                }
            } else {
                setErrorMessage('Format response tidak valid dari server. Silakan coba lagi.');
            }

        } catch (error) {
            setErrorMessage('Terjadi kesalahan tak terduga saat mendeteksi. Silakan coba lagi. ' + error);
        } finally {
            setIsDetecting(false);
        }
    };

    const handleTakePicture = () => {
        navigate('/detection/take-picture');
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const Notification = ({ type, message, onClose }) => {
        const icons = {
            error: <XCircle className="w-5 h-5" />,
            success: <CheckCircle className="w-5 h-5" />,
            warning: <AlertCircle className="w-5 h-5" />
        };

        const styles = {
            error: 'bg-red-50 border-red-200 text-red-800',
            success: 'bg-green-50 border-green-200 text-green-800',
            warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
        };

        const buttonStyles = {
            error: 'bg-red-500 hover:bg-red-600',
            success: 'bg-green-500 hover:bg-green-600',
            warning: 'bg-yellow-500 hover:bg-yellow-600'
        };

        return (
            <div className={`max-w-2xl mx-auto mb-6 p-4 border rounded-lg ${styles[type]} transition-all duration-300`}>
                <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                        {icons[type]}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium leading-relaxed">{message}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className={`flex-shrink-0 px-3 py-1 text-xs text-white rounded ${buttonStyles[type]} transition-colors`}
                    >
                        Tutup
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="container mx-auto px-4">
                <header className="flex items-center justify-between mb-8">
                    <button
                        onClick={handleGoBack}
                        className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
                    >
                        <ArrowLeft size={24} />
                        <span className="font-medium">Kembali</span>
                    </button>
                </header>

                <div className="text-center mb-12">
                    <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-4">
                        Deteksi Penyakit Daun Jagung
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                        Unggah atau tangkap gambar daun jagung untuk mendapatkan diagnosis penyakit secara instan menggunakan teknologi AI
                    </p>
                </div>

                {errorMessage && (
                    <Notification
                        type="error"
                        message={errorMessage}
                        onClose={() => setErrorMessage(null)}
                    />
                )}

                {successMessage && (
                    <Notification
                        type="success"
                        message={successMessage}
                        onClose={() => setSuccessMessage(null)}
                    />
                )}

                {diseasesLoading && (
                    <div className="max-w-2xl mx-auto mb-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                            <div className="flex items-center justify-center mb-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-2"></div>
                                <span className="text-blue-700 font-medium">Memuat database penyakit...</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div
                            className={`border-2 border-dashed p-6 md:p-8 m-4 rounded-lg transition-all duration-300 relative  
                            ${previewImage
                                    ? 'border-green-300 bg-green-50'
                                    : 'border-gray-300 bg-gray-50 hover:border-green-300 hover:bg-green-50'}`}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                className="hidden"
                            />
                            <canvas ref={canvasRef} className="hidden"></canvas>

                            {captureMode ? (
                                <div className="text-center">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        className="mx-auto max-w-full max-h-80 rounded-lg mb-6 shadow-md"
                                    />
                                    <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                                        <button
                                            onClick={captureImage}
                                            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center transition-colors shadow-md"
                                        >
                                            <Camera size={20} className="mr-2" /> Tangkap Foto
                                        </button>
                                        <button
                                            onClick={cancelCapture}
                                            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center justify-center transition-colors shadow-md"
                                        >
                                            <X size={20} className="mr-2" /> Batal
                                        </button>
                                    </div>
                                </div>
                            ) : previewImage ? (
                                <div className="text-center">
                                    <div className="relative inline-block mb-6">
                                        <img
                                            src={previewImage}
                                            alt="Preview gambar daun jagung yang akan dideteksi penyakitnya"
                                            className="mx-auto max-w-full max-h-80 rounded-lg shadow-md"
                                        />
                                        <button
                                            onClick={resetImage}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-md"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                                        <button
                                            onClick={triggerFileInput}
                                            className="px-6 py-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 flex items-center justify-center transition-colors"
                                        >
                                            <RefreshCw size={20} className="mr-2" /> Ganti Gambar
                                        </button>
                                        <button
                                            onClick={handleDetection}
                                            disabled={isDetecting || diseasesLoading || diseases.length === 0}
                                            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow-md"
                                        >
                                            {isDetecting ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                    Mendeteksi...
                                                </>
                                            ) : diseasesLoading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Memuat data...
                                                </>
                                            ) : diseases.length === 0 ? (
                                                'Database belum siap'
                                            ) : (
                                                'Deteksi Penyakit'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <Upload
                                        size={64}
                                        className="mx-auto text-green-500 mb-6"
                                    />
                                    <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">
                                        Unggah Gambar Daun Jagung
                                    </h3>
                                    <p className="text-gray-500 mb-6 text-sm md:text-base px-4">
                                        Drag & drop gambar atau pilih file dari perangkat Anda
                                    </p>
                                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                                        <button
                                            onClick={triggerFileInput}
                                            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center transition-colors shadow-md"
                                        >
                                            <Upload size={20} className="mr-2" /> Pilih Gambar
                                        </button>
                                        <button
                                            onClick={handleTakePicture}
                                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center transition-colors shadow-md"
                                        >
                                            <Camera size={20} className="mr-2" /> Ambil Foto
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {detectionResult && (
                            <div className="border-t border-gray-200">
                                <DetectionResults result={detectionResult} />

                                {detectionResult.imagePath && (
                                    <div className="px-6 pb-4">
                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-800 mb-2">Informasi Deteksi:</h4>
                                            <div className="text-sm text-gray-600 space-y-1">
                                                <div className="flex justify-between">
                                                    <span>Waktu Deteksi:</span>
                                                    <span>{new Date(detectionResult.timestamp).toLocaleString('id-ID')}</span>
                                                </div>
                                                {detectionResult.confidence !== undefined && (
                                                    <div className="flex justify-between">
                                                        <span>Akurasi:</span>
                                                        <span className={`font-semibold ${detectionResult.confidencePercentage >= 80
                                                            ? 'text-green-600'
                                                            : detectionResult.confidencePercentage >= 60
                                                                ? 'text-yellow-600'
                                                                : 'text-red-600'
                                                            }`}>
                                                            {detectionResult.confidencePercentage}%
                                                        </span>
                                                    </div>
                                                )}
                                                {detectionResult.imagePath && (
                                                    <div className="flex justify-between">
                                                        <span>Status:</span>
                                                        <span className="text-green-600 font-semibold">Tersimpan</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {detectionResult.isUnreliable && (
                                    <div className="px-6 pb-4">
                                        <div className="text-center">
                                            {/* Removed the "Coba Deteksi Lagi" button */}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="px-6 pb-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-semibold text-blue-800 mb-2">Tips untuk hasil terbaik:</h4>
                                <ul className="text-sm text-blue-700 space-y-1">
                                    <li>• Pastikan gambar daun jagung terlihat jelas dan fokus</li>
                                    <li>• Gunakan pencahayaan yang cukup dan merata</li>
                                    <li>• Hindari bayangan yang menutupi daun</li>
                                    <li>• Format yang didukung: JPG, PNG, WebP (maksimal 5MB)</li>
                                    <li>• Ambil foto dari jarak yang memadai untuk menangkap detail daun</li>
                                    <li>• Gunakan background yang kontras dengan warna daun</li>
                                </ul>
                            </div>

                            <div className="mt-4 text-sm text-gray-600 text-center">
                                {diseasesLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                                        <span className="text-blue-600">Memuat database penyakit...</span>
                                    </div>
                                ) : diseases.length > 0 ? (
                                    <span className="text-green-600">
                                        Database penyakit siap ({diseases.length} penyakit tersedia)
                                    </span>
                                ) : (
                                    <span className="text-red-600">Database penyakit tidak tersedia</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetectionPage;