import { Button, Upload, message } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setLoader } from "../../../redux/loaderSlice";
import { EditProduct, UploadProductImage } from "../../../api/products";

const Images = ({ selectedProduct, setShowProductForm, getData }) => {
  const [file, setFile] = useState(null);
  const [images, setImages] = useState(selectedProduct.images);
  const [showPreview, setShowPreview] = useState(true);
  const dispatch = useDispatch();

  const upload = async () => {
    try {
      dispatch(setLoader(true));
      const formData = new FormData();
      formData.append("file", file);
      formData.append("productId", selectedProduct._id);
      const response = await UploadProductImage(formData);
      dispatch(setLoader(false));
      if (response.success) {
        message.success(response.message);
        setImages((prevImages) => [...prevImages, response.data]);
        setShowPreview(false);
        setFile(null);
        getData();
      } else {
        message.error(response.message);
      }
    } catch (err) {
      dispatch(setLoader(false));
      message.error(err.message);
    }
  };

  const deleteImage = async (image) => {
    try {
      dispatch(setLoader(true));
      const updatedImages = images.filter((img) => img !== image);
      const updatedProduct = { ...selectedProduct, images: updatedImages };
      const response = await EditProduct(selectedProduct._id, updatedProduct);
      dispatch(setLoader(false));
      if (response.success) {
        message.success("Image Deleted Successfully");
        setImages(updatedImages);
        getData();
      } else {
        message.error(response.message);
      }
    } catch (err) {
      dispatch(setLoader(false));
      message.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex gap-5 mb-10">
        {images.map((image) => {
          return (
            <div className="flex gap-2 border border-solid border-gray-500 rounded p-2 items-end">
              <img
                className="h-20 w-20 object-cover"
                src={image}
                alt="some-text-here"
              />
              <i
                className="ri-delete-bin-line cursor-pointer text-lg"
                onClick={() => deleteImage(image)}
              ></i>
            </div>
          );
        })}
      </div>
      <Upload
        listType="picture"
        beforeUpload={() => false}
        onChange={(info) => {
          setFile(info.file);
          setShowPreview(true);
        }}
        showUploadList={showPreview}
      >
        <Button
          type="default"
          style={{ padding: "8px 16px", height: "fit-content" }}
        >
          Upload Image
        </Button>
      </Upload>

      <div className="flex justify-end gap-5 mt-5">
        <Button
          type="default"
          onClick={() => {
            setShowProductForm(false);
          }}
        >
          Cancel
        </Button>
        <Button type="primary" onClick={upload} disabled={!file}>
          UPLOAD
        </Button>
      </div>
    </div>
  );
};

export default Images;
