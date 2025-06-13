import { useEffect, useState } from 'react';
import axiosInstance from '../../libs/axios';

const useAdminScanHistories = () => {
    const [histories, setHistories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchScanHistories = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get('/admin/scan-history');
                const scanHistory = response.data.data.scanHistory || [];
                setHistories(scanHistory);
            } catch (err) {
                setError(err.message || 'Failed to fetch scan histories.');
            } finally {
                setLoading(false);
            }
        };

        fetchScanHistories();
    }, []);

    return { histories, loading, error };
};

export default useAdminScanHistories;