import { Button, Table, message } from 'antd';
import Divider from '../../../components/Divider.js';
import ProductForm from './ProductForm.js';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoader } from '../../../redux/loaderSlice.js';
// import { setProducts } from "../../../redux/";
import { DeleteProduct, GetAllProducts } from '../../../api/products.js';
import moment from 'moment';
import ChatBox from '../../../components/ChatBox.js';
import axios from 'axios';

const Products = () => {
    const [showProductForm, setShowProductForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isChatting, setChatting] = useState(false);
    const [products, setProducts] = useState([]);
    const [chats, setChats] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const { user } = useSelector((state) => state.users);
    const dispatch = useDispatch();

    const getChats = async (record) => {
        const response = await axios.post('/api/users/get-chats', {
            productId: record._id,
            seller: user._id,
        });
        setChats(response.data.chat);
    };

    const columns = [
        { title: 'Name', dataIndex: 'name' },
        { title: 'Description', dataIndex: 'description' },
        { title: 'Price', dataIndex: 'price' },
        { title: 'Department', dataIndex: 'department' },
        { title: 'Status', dataIndex: 'status' },
        {
            title: 'Added On',
            dataIndex: 'createdAt',
            render: (text, record) => moment(record.createdAt).format('DD-MM-YYYY hh:mm A'),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text, record) => {
                return (
                    <div className="flex gap-5">
                        <i
                            className="ri-chat-4-fill cursor-pointer text-lg"
                            onClick={() => {
                                setChatting(true);
                                setSelectedProduct(record);
                                getChats(record);
                            }}
                        ></i>
                        <i className="ri-delete-bin-line cursor-pointer text-lg" onClick={() => deleteProduct(record._id)}></i>
                        <i
                            className="ri-pencil-line cursor-pointer text-lg"
                            onClick={() => {
                                setSelectedProduct(record);
                                setShowProductForm(true);
                            }}
                        ></i>
                    </div>
                );
            },
        },
    ];

    const getData = async () => {
        try {
            dispatch(setLoader(true));
            const response = await GetAllProducts({ seller: user._id });
            dispatch(setLoader(false));
            if (response.success) {
                setProducts(response.data);
            }
        } catch (err) {
            dispatch(setLoader(false));
            message.error(err.message);
        }
    };

    const deleteProduct = async (id) => {
        try {
            dispatch(setLoader(true));
            const response = await DeleteProduct(id);
            dispatch(setLoader(false));
            if (response.success) {
                message.success(response.message);
                getData();
            } else message.error(response.message);
        } catch (err) {
            dispatch(setLoader(false));
            message.error(err.message);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="p-5">
            {!isChatting && (
                <div>
                    <div className="flex justify-between items-end">
                        <h1>Your Products</h1>
                        <div>
                            <Button
                                type="primary"
                                className="add-product"
                                onClick={() => {
                                    setShowProductForm(true);
                                    setSelectedProduct(null);
                                }}
                            >
                                Add Product
                            </Button>
                        </div>
                    </div>
                    <Divider style={{ margin: '15px 0px' }} />
                    
                    <div className="overflow-auto max-h-[400px]">
                        <Table columns={columns} dataSource={products} />
                    </div>

                    {showProductForm && (
                        <ProductForm
                            showProductForm={showProductForm}
                            setShowProductForm={setShowProductForm}
                            selectedProduct={selectedProduct}
                            getData={getData}
                        />
                    )}
                </div>
            )}
            {isChatting &&
                selectedProduct &&
                (selectedUser ? (
                    <ChatBox
                        buyer={selectedUser.id}
                        buyerName={selectedUser.name}
                        displayName={selectedUser.name}
                        seller={selectedProduct.seller}
                        productId={selectedProduct._id}
                        messageSenderId={user._id}
                    />
                ) : (
                    <div>
                        <h1>Your Chats</h1>
                        {chats.map((chat) => {
                            return (
                                <Button
                                    type="primary"
                                    className="add-product m-5"
                                    onClick={() => {
                                        setSelectedUser({ id: chat.buyer, name: chat.buyerName });
                                    }}
                                >
                                    {chat.buyerName}
                                </Button>
                            );
                        })}
                    </div>
                ))}
        </div>
    );
};

export default Products;
