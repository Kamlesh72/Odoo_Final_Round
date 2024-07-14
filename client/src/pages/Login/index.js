import React from "react";
import { Button, Form, Input, message } from "antd";
import { Link } from "react-router-dom";
import Divider from "../../components/Divider";
import { LoginUser } from "../../api/users";
import { useDispatch } from "react-redux";
import { setLoader } from "../../redux/loaderSlice";

const rules = [
  {
    required: true,
    message: "required",
  },
];

const Login = () => {
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(setLoader(true));
      const response = await LoginUser(values);
      dispatch(setLoader(false));
      if (response.success) {
        message.success(response.message);
        localStorage.setItem("token", response.token);
        window.location.href = "/";
      } else throw new Error(response.message);
    } catch (err) {
      dispatch(setLoader(false));
      message.error(err.message);
    }
  };

  return (
    <div className="h-screen bg-slate-100 flex justify-center items-center">
      <div className="bg-white p-7 rounded w-[450px]">
        <h1 className="text-gray-500 text-2xl">LOGIN</h1>
        <Divider />
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email" rules={rules}>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={rules}>
            <Input type="password" placeholder="Password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="mt-2 button-black" block>
            Login
          </Button>

          <div className="mt-5 text-center">
            <span className="text-gray-500">
              Don't have an account? <Link to="/register">Register</Link>
            </span>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
