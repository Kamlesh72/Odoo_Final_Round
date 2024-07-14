import axiosInstance from './axiosInstance';

export const AddBook = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/books/book', payload);
        return response.data;
    } catch (err) {
        return err.message;
    }
};

export const GetAllBookss = async (filters) => {
    try {
        const response = await axiosInstance.get('/api/books/all-books');
        return response.data;
    } catch (err) {
        return err.message;
    }
};

export const EditBook = async (id, payload) => {
    try {
        const response = await axiosInstance.put(`/api/books/book/${id}`, payload);
        return response.data;
    } catch (err) {
        return err.message;
    }
};

export const DeleteBook = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/books/book/${id}`);
        return response.data;
    } catch (err) {
        return err.message;
    }
};

export const UploadBookImage = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/books/upload-image', payload);
        return response.data;
    } catch (err) {
        return err.message;
    }
};
