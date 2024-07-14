import { DatePicker, Form, Input, Modal, Tabs, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Divider from '../../../components/Divider';
import { AddProduct, EditProduct } from '../../../api/products';
import { setLoader } from '../../../redux/loaderSlice';
import Images from './Images';

const rules = [
  {
    required: true,
    message: 'required',
  },
];

const ProductForm = ({
  showProductForm,
  setShowProductForm,
  selectedProduct,
  getData,
}) => {
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const [selectedTab, setSelectedTab] = useState('1');

  const onYearChange = (date, dateString) => {
    console.log(date, dateString);
  };

  const onFinish = async (values) => {
    try {
      dispatch(setLoader(true));
      let response = null;
      if (selectedProduct) {
        response = await EditProduct(selectedProduct._id, values);
      } else {
        // values.seller = user._id;
        // values.sellerName = user.name;
        // values.status = 'pending';
        
        response = await AddProduct(values);
      }
      dispatch(setLoader(false));
      if (response.success) {
        message.success(response.message);
        getData();
        setShowProductForm(false);
      }
    } catch (err) {
      message.error(err.message);
      dispatch(setLoader(false));
    }
  };

  useEffect(() => {
    if (selectedProduct) formRef.current.setFieldsValue(selectedProduct);
  }, [selectedProduct]);

  return (
    <Modal
      title=''
      open={showProductForm}
      onCancel={() => setShowProductForm(false)}
      centered
      width={1000}
      okText='SAVE'
      onOk={() => {
        formRef.current.submit();
      }}
      {...(selectedTab === '2' && { footer: false })}
    >
      <h2 className='text-center uppercase'>
        {selectedProduct ? 'EDIT PRODUCT' : 'ADD PRODUCT'}
      </h2>
      <Divider style={{ margin: '5px 0px' }} />
      <Tabs
        defaultActiveKey='1'
        activeKey={selectedTab}
        onChange={(key) => setSelectedTab(key)}
      >
        <Tabs.TabPane tab='General' key='1'>
          <Form
            layout='vertical'
            className='grid grid-cols-2 gap-x-6 gap-y-0'
            ref={formRef}
            onFinish={onFinish}
          >
            <Form.Item label='ISBN' name='isbn' rules={rules}>
              <Input type='text' />
            </Form.Item>
            <Form.Item label='Title' name='title' rules={rules}>
              <Input type='text' />
            </Form.Item>
            <Form.Item label='Author' name='author' rules={rules}>
              <Input type='text' />
            </Form.Item>
            <Form.Item label='Publisher' name='publisher' rules={rules}>
              <Input type='text' />
            </Form.Item>
            <Form.Item label='Year' name='year' rules={rules}>
              <DatePicker
                onChange={onYearChange}
                picker='year'
                className='w-full'
              />
            </Form.Item>
            <Form.Item label='Genre' name='genre' rules={rules}>
              <Input type='text' />
            </Form.Item>
            <Form.Item label='Quantity' name='quantity' rules={rules}>
              <Input type='number' />
            </Form.Item>
            <Form.Item label='Price' name='price' rules={rules}>
              <Input type='number' />
            </Form.Item>
          </Form>
        </Tabs.TabPane>
        <Tabs.TabPane tab='Images' key='2' disabled={!selectedProduct}>
          <Images
            selectedProduct={selectedProduct}
            setShowProductForm={setShowProductForm}
            getData={getData}
          ></Images>
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
};

export default ProductForm;
