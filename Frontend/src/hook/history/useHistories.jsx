import { useState, useEffect } from 'react';
import axiosInstance from '../../libs/axios';

const useHistories = () => {
    const [histories, setHistories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistories = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get('/scan/history');
                console.log(response.data); // Log the API response for debugging

                // Check if response.data.data.scanHistory is an array
                const scanHistory = response.data.data?.scanHistory;
                if (Array.isArray(scanHistory)) {
                    setHistories(scanHistory);
                } else {
                    setError('Unexpected data format');
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch scan history');
            } finally {
                setLoading(false);
            }
        };

        fetchHistories();
    }, []);

    return { histories, loading, error };
};

export default useHistories;