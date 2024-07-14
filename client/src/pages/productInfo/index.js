import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoader } from '../../redux/loaderSlice';
<<<<<<< Updated upstream:client/src/pages/productInfo/index.js
import { Button, message } from 'antd';
import { GetAllProducts } from '../../api/products';
import { useNavigate, useParams } from 'react-router-dom';
=======
import { Button, message, Modal, Input } from 'antd';
import { GetAllBooks, AssignBook } from '../../api/books'; // Make sure to import the new API function
import { useParams } from 'react-router-dom';
>>>>>>> Stashed changes:client/src/pages/bookInfo/index.js
import Divider from '../../components/Divider';
import moment from 'moment';
import ChatBox from '../../components/ChatBox';

const ProductInfo = () => {
    const [product, setProduct] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isChatting, setChatting] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userEmail, setUserEmail] = useState('');
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

    const handleIssue = async () => {
        try {
            dispatch(setLoader(true));
            const response = await AssignBook(id, userEmail); // book-id, assigned-user-email
            dispatch(setLoader(false));
            if (response.success) {
                message.success(response.message);
                setBook(response.data);
                setIsModalVisible(false);
            } else {
                message.error(response.message);
            }
        } catch (err) {
            dispatch(setLoader(false));
            message.error(err.message);
        }
    };

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
                                <Button type="primary" className="issue-book-btn" onClick={() => setIsModalVisible(true)}>
                                    Issue
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Modal
                title="Issue Book"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={handleIssue}
            >
                <Input
                    placeholder="Enter user email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                />
            </Modal>
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
