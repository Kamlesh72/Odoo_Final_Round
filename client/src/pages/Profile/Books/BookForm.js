import { Form, Input, Modal, Tabs, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Divider from '../../../components/Divider';
import { AddBook, EditBook } from '../../../api/books';
import { setLoader } from '../../../redux/loaderSlice';
import Images from './Images';

const rules = [
  {
    required: true,
    message: 'Required',
  },
];

const generateYearOptions = () => {
  const startYear = 1970;
  const currentYear = new Date().getFullYear();
  const years = [];

  for (let year = startYear; year <= currentYear; year++) {
    years.push(year.toString()); // Convert year to string for display consistency
  }

  return years;
};

const BookForm = ({ showBookForm, setShowBookForm, selectedBook, getData }) => {
  const years = generateYearOptions();
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState('1');

  const onFinish = async (values) => {
    try {
      dispatch(setLoader(true));
      let response = null;
      if (selectedBook) {
        response = await EditBook(selectedBook._id, values);
      } else {
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
    if (selectedBook && formRef.current) {
      formRef.current.setFieldsValue({
        ISBN: selectedBook.ISBN,
        title: selectedBook.title,
        author: selectedBook.author,
        publisher: selectedBook.publisher,
        year: selectedBook.year ? selectedBook.year.toString() : undefined, // Ensure year is set as string
        genre: selectedBook.genre,
        quantity: selectedBook.quantity,
      });
    }
  }, [selectedBook]);

  return (
    <Modal
      title={selectedBook ? 'EDIT BOOK' : 'ADD BOOK'}
      visible={showBookForm}
      onCancel={() => setShowBookForm(false)}
      centered
      width={1000}
      okText='SAVE'
      onOk={() => {
        formRef.current.submit();
      }}
      footer={selectedTab === '2' ? null : undefined}
    >
      <h2 className='text-center uppercase'>
        {selectedBook ? 'EDIT BOOK' : 'ADD BOOK'}
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
            className='grid grid-cols-2 gap-x-6 gap-y-4'
            ref={formRef}
            onFinish={onFinish}
          >
            <Form.Item label='ISBN' name='ISBN' rules={rules}>
              <Input />
            </Form.Item>
            <Form.Item label='Title' name='title' rules={rules}>
              <Input />
            </Form.Item>
            <Form.Item label='Author' name='author' rules={rules}>
              <Input />
            </Form.Item>
            <Form.Item label='Publisher' name='publisher' rules={rules}>
              <Input />
            </Form.Item>
            <Form.Item label='Year' name='year' rules={rules}>
              <select
                className='w-full'
                defaultValue={selectedBook && selectedBook?.year}
                onChange={(e) =>
                  formRef.current.setFieldsValue({ year: e.target.value })
                }
              >
                <option value='' disabled>
                  Select year
                </option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </Form.Item>
            <Form.Item label='Genre' name='genre' rules={rules}>
              <Input />
            </Form.Item>
            <Form.Item label='Quantity' name='quantity' rules={rules}>
              <Input type='number' />
            </Form.Item>
          </Form>
        </Tabs.TabPane>
        <Tabs.TabPane tab='Images' key='2' disabled={!selectedBook}>
          <Images
            selectedBook={selectedBook}
            setShowBookForm={setShowBookForm}
            getData={getData}
          />
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
};

export default BookForm;
