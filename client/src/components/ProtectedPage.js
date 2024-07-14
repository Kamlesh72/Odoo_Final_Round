import React, { useEffect } from "react";
import { GetCurrentUser } from "../api/users";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../redux/loaderSlice";
import { setUser } from "../redux/usersSlice";

const ProtectedPage = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const validateToken = async () => {
    try {
      dispatch(setLoader(true));
      const response = await GetCurrentUser();
      dispatch(setLoader(false));
      if (response.success) dispatch(setUser(response.data));
      else throw new Error(response.message);
    } catch (err) {
      message.error(err.message);
      navigate("/login");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) validateToken();
    else {
      navigate("/login");
    }
  }, []);

  return (
    <>
      {user && (
        <div>
          {/* header */}
          <div className="flex justify-between items-center bg-slate-800 p-5">
            <h1
              className="text-2xl text-white cursor-pointer"
              onClick={() => navigate("/")}
            >
              ONSITE SNB
            </h1>
            <div className="bg-white py-2 px-5 rounded flex items-center gap-1">
              <i className="ri-shield-user-line"></i>
              <span
                className="underline cursor-pointer"
                onClick={() => navigate("/profile")}
              >
                {user?.name?.toUpperCase()}
              </span>
              <i
                className="ri-logout-box-r-line ml-10 cursor-pointer"
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/login");
                }}
              ></i>
            </div>
          </div>

          {/* body */}
          <div>{children}</div>
        </div>
      )}
    </>
  );
};

export default ProtectedPage;
