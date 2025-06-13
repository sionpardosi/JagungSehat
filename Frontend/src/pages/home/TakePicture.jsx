import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, X } from "lucide-react";

const TakePicture = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [cameraReady, setCameraReady] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true; 

        const startCamera = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                        facingMode: "environment",
                    },
                });

                if (!isMounted) return;

                setStream(mediaStream);
                setCameraReady(true);

                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                    await videoRef.current.play();
                }
            } catch (err) {
                console.error("Failed to access camera:", err);
                if (isMounted) {
                    setErrorMsg("Tidak dapat mengakses kamera. Pastikan izin kamera aktif dan tidak sedang digunakan aplikasi lain.");
                }
            }
        };

        startCamera();

        return () => {
            isMounted = false;
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 

    const handleCapture = () => {
        if (!videoRef.current || !canvasRef.current) return;

        if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
            setErrorMsg("Video belum siap, tunggu sebentar lalu coba lagi.");
            return;
        }

        const canvas = canvasRef.current;
        const video = videoRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    setErrorMsg("Gagal menangkap gambar.");
                    return;
                }
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64Image = reader.result;
                    navigate("/detection", {
                        state: { capturedImage: base64Image },
                    });
                };
                reader.readAsDataURL(blob);
            },
            "image/jpeg",
            0.8
        );
    };

    const handleCancel = () => {
        if (videoRef.current?.srcObject) {
            videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
            videoRef.current.srcObject = null;
        }
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={handleCancel}
                        className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
                    >
                        <ArrowLeft size={24} />
                        <span className="font-medium">Kembali</span>
                    </button>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-green-700 mb-2">Ambil Foto Daun Jagung</h1>
                    <p className="text-gray-600 text-lg">Pastikan pencahayaan cukup dan daun terlihat jelas sebelum memotret.</p>
                </div>

                {errorMsg ? (
                    <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-center">{errorMsg}</div>
                ) : (
                    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
                        <video ref={videoRef} autoPlay muted playsInline className="w-full h-auto rounded-lg mb-6 object-cover" />
                        <canvas ref={canvasRef} className="hidden" />

                        {/* Updated button layout */}
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button
                                onClick={handleCapture}
                                disabled={!cameraReady}
                                className={`px-6 py-3 rounded-lg flex items-center transition-colors shadow-md ${
                                    cameraReady ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                            >
                                <Camera size={20} className="mr-2" />
                                Tangkap Foto
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center transition-colors shadow-md"
                            >
                                <X size={20} className="mr-2" />
                                Batal
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TakePicture;