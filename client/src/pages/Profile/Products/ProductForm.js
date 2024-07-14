import { Col, Form, Input, Modal, Row, Tabs, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Divider from '../../../components/Divider';
import TextArea from 'antd/es/input/TextArea';
import { AddBook, EditBook } from '../../../api/books';
import { setLoader } from '../../../redux/loaderSlice';
import Images from './Images';

const rules = [
    {
        required: true,
        message: 'required',
    },
];

const BookForm = ({ showBookForm, setShowBookForm, selectedBook, getData }) => {
    const formRef = useRef(null);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.users);
    const [selectedTab, setSelectedTab] = useState('1');

    const onFinish = async (values) => {
        try {
            dispatch(setLoader(true));
            let response = null;
            if (selectedBook) {
                response = await EditBook(selectedBook._id, values);
            } else {
                values.seller = user._id;
                values.sellerName = user.name;
                values.status = 'pending';
                response = await AddBook(values);
            }
            dispatch(setLoader(false));
            if (response.success) {
                message.success(response.message);
                getData();
                setShowBookForm(false);
            }
        } catch (err) {
            message.error(err.message);
            dispatch(setLoader(false));
        }
    };

    useEffect(() => {
        if (selectedBook) formRef.current.setFieldsValue(selectedBook);
    }, [selectedBook]);

    return (
        <Modal
            title=""
            open={showBookForm}
            onCancel={() => setShowBookForm(false)}
            centered
            width={1000}
            okText="SAVE"
            onOk={() => {
                formRef.current.submit();
            }}
            {...(selectedTab === '2' && { footer: false })}
        >
            <h2 className="text-center uppercase">{selectedBook ? 'EDIT BOOK' : 'ADD BOOK'}</h2>
            <Divider style={{ margin: '5px 0px' }} />
            <Tabs defaultActiveKey="1" activeKey={selectedTab} onChange={(key) => setSelectedTab(key)}>
                <Tabs.TabPane tab="General" key="1">
                    <Form layout="vertical" ref={formRef} onFinish={onFinish}>
                        <Form.Item label="Name" name="name" rules={rules}>
                            <Input type="text" />
                        </Form.Item>
                        <Form.Item label="Description" name="description" rules={rules}>
                            <TextArea type="text" />
                        </Form.Item>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Form.Item label="Price" name="price" rules={rules}>
                                    <Input type="number" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Department" name="department" rules={rules}>
                                    <select>
                                        <option value="">Select</option>
                                        <option value="All">All</option>
                                        <option value="Computer/IT">Computer/IT</option>
                                        <option value="Chemical Engineering">Chemical Engineering</option>
                                        <option value="Electrical Engineering">Electrical Engineering</option>
                                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                                        <option value="Civil Engineering">Civil Engineering</option>
                                    </select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Images" key="2" disabled={!selectedBook}>
                    <Images selectedBook={selectedBook} setShowBookForm={setShowBookForm} getData={getData}></Images>
                </Tabs.TabPane>
            </Tabs>
        </Modal>
    );
};

export default BookForm;
