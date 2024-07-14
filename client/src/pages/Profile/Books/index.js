import { Button, Table, message } from 'antd';
import Divider from '../../../components/Divider.js';
import BookForm from './BookForm.js';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoader } from '../../../redux/loaderSlice.js';
import { DeleteBook, GetAllBooks } from '../../../api/books.js';
import moment from 'moment';

const Books = () => {
  const [showBookForm, setShowBookForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [books, setBooks] = useState([]);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const columns = [
    {
      title: 'Index',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => index + 1,
    },
    { title: 'ISBN', dataIndex: 'ISBN', key: 'ISBN' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Author', dataIndex: 'author', key: 'author' },
    { title: 'Publisher', dataIndex: 'publisher', key: 'publisher' },
    { title: 'Year', dataIndex: 'year', key: 'year' },
    { title: 'Genre', dataIndex: 'genre', key: 'genre' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
    {
      title: 'Added On',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text, record) =>
        moment(record.createdAt).isValid()
          ? moment(record.createdAt).format('DD-MM-YYYY hh:mm A')
          : 'Invalid Date',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => {
        return (
          <div className='flex gap-5'>
            <i
              className='ri-delete-bin-line cursor-pointer text-lg'
              onClick={() => deleteBook(record._id)}
            ></i>
            <i
              className='ri-pencil-line cursor-pointer text-lg'
              onClick={() => {
                setSelectedBook(record);
                setShowBookForm(true);
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
      const response = await GetAllBooks({ seller: user._id });
      dispatch(setLoader(false));
      if (response.success) {
        // Add key to each book
        const booksWithKey = response.data.map((book, index) => ({
          ...book,
          key: index,
        }));
        setBooks(booksWithKey);
      }
    } catch (err) {
      dispatch(setLoader(false));
      message.error(err.message);
    }
  };

  const deleteBook = async (id) => {
    try {
      dispatch(setLoader(true));
      const response = await DeleteBook(id);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='p-5'>
      <div>
        <div className='flex justify-between items-end'>
          <h1>Your Books</h1>
          <div>
            <Button
              type='primary'
              className='add-book'
              onClick={() => {
                setShowBookForm(true);
                setSelectedBook(null);
              }}
            >
              Add Book
            </Button>
          </div>
        </div>
        <Divider style={{ margin: '15px 0px' }} />

        <div className='overflow-auto max-h-[400px]'>
          <Table columns={columns} dataSource={books} />
        </div>

        {showBookForm && (
          <BookForm
            showBookForm={showBookForm}
            setShowBookForm={setShowBookForm}
            selectedBook={selectedBook}
            getData={getData}
          />
        )}
      </div>
    </div>
  );
};

export default Books;
