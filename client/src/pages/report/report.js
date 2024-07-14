import React, { useState, useEffect } from 'react';
import { Table, Spin, message } from 'antd';
import { GetAllHistory } from '../../api/books';

const Report = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await GetAllHistory();
        if (response.success) {
          setHistory(response.data);
        } else {
          message.error(response.message);
        }
      } catch (err) {
        setError(err.message);
        message.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const columns = [
    {
      title: 'Book ID',
      dataIndex: 'bookId',
      key: 'bookId',
      render: (text) => text ? text : 'N/A', // Directly display bookId as it's a string
    },
    {
      title: 'Assigned To',
      dataIndex: 'userName', // Use userName directly
      key: 'userName',
      render: (text, record) => text ? `${text} (${record.userEmail})` : 'N/A', // Combine userName and userEmail
    },
    {
      title: 'From Date',
      dataIndex: 'fromDate',
      key: 'fromDate',
      render: (text) => text ? new Date(text).toLocaleDateString() : 'N/A', // Convert date to local date string
    },
    {
      title: 'To Date',
      dataIndex: 'toDate',
      key: 'toDate',
      render: (text) => text ? new Date(text).toLocaleDateString() : 'N/A', // Convert date to local date string
    },
    {
      title: 'Penalty',
      dataIndex: 'penalty',
      key: 'penalty',
      render: (text) => text != null ? `₹${text}` : 'N/A', // Display penalty amount with ₹ symbol
    },
  ];

  return (
    <div className='p-5'>
      {loading ? (
        <div className='flex justify-center items-center h-96'>
          <Spin size="large" />
        </div>
      ) : error ? (
        <div className='text-center text-red-500'>{error}</div>
      ) : (
        <Table
          columns={columns}
          dataSource={history}
          rowKey={(record) => record._id} // Use _id as the unique key
          pagination={{ pageSize: 10 }}
          className='bg-white rounded-md shadow-md'
        />
      )}
    </div>
  );
};

export default Report;
