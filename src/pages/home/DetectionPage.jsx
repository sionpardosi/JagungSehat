import React, { useState, useRef, useEffect } from 'react';
import { Upload, Camera, X, RefreshCw, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../libs/axios/index'; // Import axiosInstance
import DetectionResults from '../../components/ui/DetectionResult';

const DetectionPage = () => {
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [captureMode, setCaptureMode] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);
    const [detectionResult, setDetectionResult] = useState(null);
    const [diseases, setDiseases] = useState([]); // State for diseases
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const location = useLocation();

    // Fetch diseases from the API
    useEffect(() => {
        const fetchDiseases = async () => {
            try {
                const response = await axiosInstance.get('/api/diseases'); // Adjust if necessary
                setDiseases(response.data); // Assume the API returns an array of diseases
            } catch (error) {
                console.error('Error fetching diseases:', error);
            }
        };

        fetchDiseases();
    }, []); // Empty dependency array means this runs on mount

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

    // Handle image upload  
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(file);
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle drag and drop  
    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(file);
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Start camera capture  
    const startCapture = async () => {
        try {
            const constraints = {
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'environment' // Use back camera on mobile
                }
            };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            setCaptureMode(true);
        } catch (err) {
            console.error('Error accessing webcam:', err);
            alert('Tidak dapat mengakses kamera. Pastikan Anda memberikan izin.');
        }
    };

    // Capture image from video stream  
    const captureImage = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);

        // Stop video stream  
        const stream = video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());

        // Convert canvas to file  
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

    // Cancel camera capture  
    const cancelCapture = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }
        setCaptureMode(false);
    };

    // Reset image selection  
    const resetImage = () => {
        setSelectedImage(null);
        setPreviewImage(null);
    };

    // Trigger file input  
    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    // Detect disease function
    const detectDisease = async (image) => {
        const formData = new FormData();
        formData.append('image', image);

        try {
            const response = await axiosInstance.post('/detect', formData);
            return response.data; // Should include fields like 'diseaseName'
        } catch (error) {
            console.error('Error during disease detection:', error.response ? error.response.data : error);
            const errorMessage =
                (error.response && error.response.data && error.response.data.message) ||
                'Terjadi kesalahan saat mendeteksi penyakit. Silakan coba lagi.';
            return { errorMessage };
        }
    };

    // Handle scan
    const handleScan = async () => {
        if (!selectedImage) {
            alert('Silakan pilih atau ambil gambar terlebih dahulu.');
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedImage);

        try {
            const response = await axiosInstance.post('/scan', formData);
            alert('Scan berhasil disimpan!');
            console.log('Hasil scan:', response.data);
        } catch (error) {
            console.error('Error saat melakukan scan:', error.response ? error.response.data : error);
            if (error.response) {
                if (error.response.status === 401) {
                    alert('Anda harus login untuk menyimpan hasil scan.');
                } else if (error.response.data.message) {
                    alert(error.response.data.message);
                } else {
                    alert('Terjadi kesalahan saat melakukan scan. Silakan coba lagi.');
                }
            } else {
                alert('Terjadi kesalahan koneksi. Silakan coba lagi.');
            }
        }
    };

    // Handle take picture button click
    const handleTakePicture = () => {
        startCapture();
        navigate('/detection/take-picture');
    };

    const handleDetection = async () => {
        if (selectedImage) {
            setIsDetecting(true);
            const result = await detectDisease(selectedImage);

            if (result.errorMessage) {
                alert(result.errorMessage);
            } else {
                const disease = diseases.find(d => d.name === result.diseaseName);
                setDetectionResult(disease || null);
            }

            setIsDetecting(false);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="container mx-auto px-4">
                {/* Header with back button */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={handleGoBack}
                        className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
                    >
                        <ArrowLeft size={24} />
                        <span className="font-medium">Kembali</span>
                    </button>
                </div>

                {/* Page Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-green-700 mb-4">
                        Deteksi Penyakit Daun Jagung
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Unggah atau tangkap gambar daun jagung untuk mendapatkan diagnosis penyakit secara instan menggunakan teknologi AI
                    </p>
                </div>

                {/* Main Detection Card */}
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div
                            className={`border-2 border-dashed p-8 m-4 rounded-lg transition-all duration-300 relative  
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
                                    <div className="flex justify-center space-x-4">
                                        <button
                                            onClick={captureImage}
                                            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center transition-colors shadow-md"
                                        >
                                            <Camera size={20} className="mr-2" /> Tangkap Foto
                                        </button>
                                        <button
                                            onClick={cancelCapture}
                                            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center transition-colors shadow-md"
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
                                            alt="Preview gambar daun jagung"
                                            className="mx-auto max-w-full max-h-80 rounded-lg shadow-md"
                                        />
                                        <button
                                            onClick={resetImage}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-md"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                                        <button
                                            onClick={triggerFileInput}
                                            className="px-6 py-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 flex items-center justify-center transition-colors"
                                        >
                                            <RefreshCw size={20} className="mr-2" /> Ganti Gambar
                                        </button>
                                        <button
                                            onClick={handleDetection}
                                            disabled={isDetecting}
                                            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow-md"
                                        >
                                            {isDetecting ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                    Mendeteksi...
                                                </>
                                            ) : (
                                                'Deteksi Penyakit'
                                            )}
                                        </button>
                                        <button
                                            onClick={handleScan}
                                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center transition-colors shadow-md"
                                        >
                                            Simpan Hasil Scan
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <Upload
                                        size={64}
                                        className="mx-auto text-green-500 mb-6"
                                    />
                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                        Unggah Gambar Daun Jagung
                                    </h3>
                                    <p className="text-gray-500 mb-6">
                                        Drag & drop gambar atau pilih file dari perangkat Anda
                                    </p>
                                    <div className="flex flex-col sm:flex-row justify-center gap-4">
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

                            {/* Render Detection Results */}
                            <DetectionResults result={detectionResult} />
                        </div>

                        {/* Information Section */}
                        <div className="px-6 pb-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-semibold text-blue-800 mb-2">Tips untuk hasil terbaik:</h4>
                                <ul className="text-sm text-blue-700 space-y-1">
                                    <li>• Pastikan gambar daun jagung terlihat jelas dan fokus</li>
                                    <li>• Gunakan pencahayaan yang cukup</li>
                                    <li>• Hindari bayangan yang menutupi daun</li>
                                    <li>• Format yang didukung: JPG, PNG, WebP</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetectionPage;