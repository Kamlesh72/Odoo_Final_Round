import axiosInstance from "./axiosInstance";

export const AddProduct = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/products/product", payload);
    return response.data;
  } catch (err) {
    return err.message;
  }
};

export const GetAllProducts = async (filters) => {
  try {
    const response = await axiosInstance.post(
      "/api/books/all-products",
      filters
    );
    return response.data;
  } catch (err) {
    return err.message;
  }
};

export const EditProduct = async (id, payload) => {
  try {
    const response = await axiosInstance.put(
      `/api/products/product/${id}`,
      payload
    );
    return response.data;
  } catch (err) {
    return err.message;
  }
};

export const DeleteProduct = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/products/product/${id}`);
    return response.data;
  } catch (err) {
    return err.message;
  }
};

export const UploadProductImage = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/api/books/upload-image",
      payload
    );
    return response.data;
  } catch (err) {
    return err.message;
  }
};