import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../libs/axios';

const useGetUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get('/admin/users');
            const dataArray = response.data.data.users;

            if (!Array.isArray(dataArray) || dataArray.length === 0) {
                setUsers([]); 
                return;
            }

            const transformedData = dataArray.map((user) => ({
                id: user.id || user._id,
                name: user.username || 'No Name', 
                email: user.email || 'No Email',
                role: user.role || 'User',
                detectionHistory: user.detectionHistory || [],
            }));

            setUsers(transformedData); 

        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch users data');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return {
        users,
        loading,
        error,
        refetch: fetchUsers,
        hasData: users.length > 0
    };
};

export default useGetUsers;