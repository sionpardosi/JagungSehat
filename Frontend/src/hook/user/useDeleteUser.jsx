import { useCallback } from 'react';
import axiosInstance from '../../libs/axios';

const useDeleteUser = () => {
    const deleteUser = useCallback(async (userId) => {
        try {
            const response = await axiosInstance.delete(`/admin/users/${userId}`); 
            return response.data; 
        } catch (error) {
            throw error.response?.data?.message || error.message || 'Failed to delete user';
        }
    }, []);

    return { deleteUser };
};

export default useDeleteUser;