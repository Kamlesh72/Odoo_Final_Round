import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoader } from '../../redux/loaderSlice';
import { message } from 'antd';
import { GetAllBooks } from '../../api/books';
import Divider from '../../components/Divider';
import { useNavigate } from 'react-router-dom';
import Filters from './Filters';
import './index.css';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [showFilters, setShowFilters] = useState(window.innerWidth > 400);
  const [filters, setFilters] = useState({
    status: 'approved',
    genre: [],
  });
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getData = async () => {
    try {
      dispatch(setLoader(true));
      const response = await GetAllBooks(filters);
      dispatch(setLoader(false));
      if (response.success) {
        setBooks(response.data);
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
  }, [filters]);

  return (
    <div className='flex h-screen overflow-auto'>
      <div className=''>
        {showFilters ? (
          <Filters
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            filters={filters}
            setFilters={setFilters}
            getData={getData}
          />
        ) : (
          <div className='p-3'>
            <i
              className='ri-equalizer-line cursor-pointer text-2xl'
              onClick={() => setShowFilters(true)}
            ></i>
          </div>
        )}
      </div>
      <div
        id='books-container'
        className={`col-span-4 grid gap-5 p-5 max-h-72 ${
          showFilters ? 'grid-cols-4' : 'grid-cols-5'
        }`}
      >
        {books?.map((book) => {
          return (
            <div
              className='border border-gray-300 rounded border-solid flex flex-col gap-5 pb-2 cursor-pointer'
              key={book._id}
              onClick={() => navigate(`/book/${book._id}`)}
            >
              <img
                src={book?.images[0]}
                alt='common'
                className='w-auto p-2 h-60 object-contain'
              />

              <div className='px-2 flex flex-col gap-1'>
                <h1 className='text-lg font-semibold h-16'>{book.title}</h1>
                <p className='text-sm text-gray-500 line-clamp-4'>
                  {book.author}
                </p>
                <Divider />
                <div className='flex items-center'>
                  <span className='text-xl font-semibold'>{book.year}</span>
                  <span className='ml-auto flex items-center'>
                    <span
                      className={`w-4 h-4 rounded-full ${
                        book.isAvailable ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    ></span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
