import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoader } from '../../redux/loaderSlice';
import { useParams } from 'react-router-dom';
import Divider from '../../components/Divider';
// import moment from 'moment';
import ChatBox from '../../components/ChatBox';
import { Button, message, Modal, Input } from 'antd';
import { GetAllBooks, AssignBook } from '../../api/books';

const BookInfo = () => {
  const [book, setBook] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isChatting, setChatting] = useState(false);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const { user } = useSelector((state) => state.users);
  const getData = async () => {
    try {
      dispatch(setLoader(true));
      const response = await GetAllBooks({ _id: id });
      dispatch(setLoader(false));
      if (response.success) {
        setBook(response.data[0]);
        console.log(response.data[0]);
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

  const handleClick = (role) => {
    if (role === 'USER') {
      // Handle User booking
    } else setIsModalVisible(true);
  };

  return (
    <>
      {book && !isChatting && (
        <div className='p-5'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
            {/* images */}
            <div className='flex flex-col gap-5'>
              <img
                src={book.images[selectedImageIndex]}
                className='w-full sm:h-96 h-72 object-contain rounded-md'
                alt='common'
              />
              <div className='flex gap-5'>
                {book.images.map((image, index) => {
                  return (
                    <img
                      key={index}
                      className={
                        'w-24 h-20 object-contain rounded-md cursor-pointer' +
                        (selectedImageIndex === index
                          ? ' border-2 border-green-700 border-dashed p-1'
                          : '')
                      }
                      src={image}
                      alt='common'
                      onClick={() => setSelectedImageIndex(index)}
                    />
                  );
                })}
              </div>
            </div>

            {/* book detail */}
            <div className=' flex flex-col gap-2 text-lg'>
              <div className='flex flex-row items-center justify-between'>
                <h1 className='text-xl sm:text-3xl font-semibold'>
                  {book.title}
                </h1>
                <span
                  className={`rounded-2xl text-white text-base p-2 ml-2 ${
                    book.isAvailable ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  {book.isAvailable
                    ? 'AVAILABLE: ' +
                      Number(book.quantity - book.assignedTo.length)
                    : 'NOT AVAILABLE'}
                </span>
              </div>
              <Divider />
              <h1 className='text-lg sm:text-xl font-semibold text-gray-700'>
                AUTHOR
              </h1>
              <span className='text-gray-600'>{book.author}</span>
              <Divider />
              <h1 className='text-lg sm:text-xl font-semibold text-gray-700'>
                PUBLISHER
              </h1>
              <span className='text-gray-600'>{book.publisher}</span>
              <Divider />
              <h1 className='text-lg sm:text-xl font-semibold text-gray-700'>
                GENRE
              </h1>
              <span className='text-gray-600'>{book.genre}</span>
              <Divider />
              <h1 className='text-lg sm:text-xl font-semibold text-gray-700'>
                YEAR
              </h1>
              <span className='text-gray-600'>{book.year}</span>
              <Divider />
              <h1 className='text-lg sm:text-xl font-semibold text-gray-700'>
                ISBN
              </h1>
              <span className='text-gray-600'>{book.ISBN}</span>
              <Divider />
              <div className='flex justify-end'>
                <span className='text-gray-600 mr-3'></span>
                {book.isAvailable && (
                  <Button
                    type='primary'
                    className='issue-book-btn'
                    onClick={() => handleClick(user.role)}
                  >
                    {user.role === 'USER' ? 'BOOK' : 'ISSUE'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className='mt-4'>
        {isChatting && (
          <ChatBox
            buyer={user._id}
            buyerName={user.name}
            displayName={book.sellerName}
            seller={book.seller}
            bookId={book._id}
            messageSenderId={user._id}
          />
        )}
      </div>
      <Modal
        title='Issue Book'
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleIssue}
      >
        <Input
          placeholder='Enter user email'
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default BookInfo;
