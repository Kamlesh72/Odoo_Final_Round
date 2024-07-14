import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoader } from '../../redux/loaderSlice';
import { Button, message } from 'antd';
import { GetAllProducts } from '../../api/products';
import { useNavigate, useParams } from 'react-router-dom';
import Divider from '../../components/Divider';
import moment from 'moment';
import ChatBox from '../../components/ChatBox';

const ProductInfo = () => {
    const [product, setProduct] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isChatting, setChatting] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useSelector((state) => state.users);
    const getData = async () => {
        try {
            dispatch(setLoader(true));
            const response = await GetAllProducts({ _id: id });
            dispatch(setLoader(false));
            if (response.success) {
                setProduct(response.data[0]);
            } else {
                message.error(response.message);
            }
        } catch (err) {
            dispatch(setLoader(false));
            message.error(err.message);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            {product && !isChatting && (
                <div className="p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* images */}
                        <div className="flex flex-col gap-5">
                            <img src={product.images[selectedImageIndex]} className="w-full sm:h-96 h-72 object-contain rounded-md" alt="common" />
                            <div className="flex gap-5">
                                {product.images.map((image, index) => {
                                    return (
                                        <img
                                            key={index}
                                            className={
                                                'w-24 h-20 object-contain rounded-md cursor-pointer' +
                                                (selectedImageIndex === index ? ' border-2 border-green-700 border-dashed p-1' : '')
                                            }
                                            src={image}
                                            alt="common"
                                            onClick={() => setSelectedImageIndex(index)}
                                        />
                                    );
                                })}
                            </div>
                        </div>

                        {/* product detail */}
                        <div className=" flex flex-col gap-2 text-lg">
                            <h1 className="text-xl sm:text-3xl font-semibold">{product.name}</h1>
                            <Divider />
                            <h1 className="text-lg sm:text-xl font-semibold text-gray-700">PRODUCT DETAILS</h1>
                            <span className="text-gray-600">{product.description}</span>
                            <Divider />
                            <h1 className="text-lg sm:text-xl font-semibold text-gray-700">SELLER DETAILS</h1>
                            <span className="text-gray-600">{product.sellerName}</span>
                            <Divider />
                            <h1 className="text-lg sm:text-xl font-semibold text-gray-700">PRICE</h1>
                            <span className="text-gray-600">Rs. {product.price}</span>
                            <Divider />
                            <h1 className="text-lg sm:text-xl font-semibold text-gray-700">LISTED ON</h1>
                            <span className="text-gray-600">{moment(product.createdAt).format('DD MMM YYYY hh:mm A')}</span>
                            <div className="flex justify-end">
                                <Button type="primary" className="chat-now-btn" onClick={() => setChatting(true)}>
                                    CHAT NOW
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="mt-4">
                {isChatting && (
                    <ChatBox
                        buyer={user._id}
                        buyerName={user.name}
                        displayName={product.sellerName}
                        seller={product.seller}
                        productId={product._id}
                        messageSenderId={user._id}
                    />
                )}
            </div>
        </>
    );
};

export default ProductInfo;
