import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../libs/axios';

const useDiseases = () => {
    const [diseases, setDiseases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDiseases = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get('/diseases');
            const dataArray = extractDataArray(response.data);

            if (!Array.isArray(dataArray) || dataArray.length === 0) {
                setDiseases([]);
                return;
            }

            const transformedData = dataArray.map((disease, index) => ({
                id: disease.id || disease._id || index,
                title: disease.name || disease.title || disease.disease_name || `Disease ${index + 1}`,
                description: disease.description || disease.desc || 'No description available',
                symptoms: transformArrayField(disease.symptoms || disease.symptom || []),
                treatment: transformArrayField(disease.treatment || disease.treatments || disease.solution || []),
            }));

            setDiseases(transformedData);

        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch diseases data');
            setDiseases([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const extractDataArray = (data) => {
        if (Array.isArray(data)) return data;
        if (data && typeof data === 'object') {
            return data.data || data.diseases || data.results || [data];
        }
        return [];
    };

    const transformArrayField = (field) => {
        if (Array.isArray(field)) return field;
        if (typeof field === 'string') {
            return field.split(/[,;|]/).map(item => item.trim());
        }
        return [];
    };

    useEffect(() => {
        fetchDiseases();
    }, [fetchDiseases]);

    return {
        diseases,
        loading,
        error,
        refetch: fetchDiseases,
        hasData: diseases.length > 0
    };
};

export default useDiseases;
