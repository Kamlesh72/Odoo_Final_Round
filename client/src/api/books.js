import axiosInstance from './axiosInstance';

export const AddBook = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/books/book', payload);
        return response.data;
    } catch (err) {
        return err.message;
    }
};

export const GetBook = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/books/book/${id}`);
        return response.data;
    } catch (err) {
        return err.message;
    }
};

export const GetAllBooks = async (filters) => {
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

export const AssignBook = async (bookId, email) => {
    try {
        const response = await axiosInstance.patch(`/api/books/assign-book/${bookId}`, {
            email
        });
        return response.data;
    } catch (err) {
        return { success: false, message: err.message };
    }
};

export const ReceiveBook = async (bookId, email) => {
    try {
        const response = await axiosInstance.patch(`/api/books/receive-book/${bookId}`, {
            email
        });
        return response.data;
    } catch (err) {
        return { success: false, message: err.message };
    }
}

export const Booked = async (bookId, email) => {
    try {
        const response = await axiosInstance.post(`/api/books/booked/${bookId}`, {
            email
        });
        return response.data;
    } catch (err) {
        return { success: false, message: err.message };
    }
}


export const fetchHistory = async (bookId, assignedTo, fromDate, toDate) => {
    try {
        const response = await axiosInstance.post(`/api/books/add-history/`, {
            bookId,
            assignedTo,
            fromDate,
            toDate,
        });
        return response.data;
    } catch (err) {
        return { success: false, message: err.message };
    }
}

export const GetAllHistory = async () => {
    try {
        const response = await axiosInstance.get('/api/books/all-history');
        // Check that response data is in the expected format
        // console.log(response.data);
        return response.data;
    } catch (err) {
        return { success: false, message: err.message };
    }
};