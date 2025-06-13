import { useState, useCallback } from 'react';
import axiosInstance from '../../libs/axios';

const useDiseaseDetection = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const detectDisease = useCallback(async (image) => {
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('image', image);

        try {
            const response = await axiosInstance.post('/scan', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResult(response.data);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan saat mendeteksi penyakit. Silakan coba lagi.');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { detectDisease, loading, error, result };
};

export default useDiseaseDetection;