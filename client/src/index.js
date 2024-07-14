import ReactDOM from "react-dom/client";
import "./index.css";
import "remixicon/fonts/remixicon.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ConfigProvider } from "antd";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary: "black",
            colorPrimaryHover: 'black',
            fontSize: "16px",
          },
        },
        token: {
          borderRadius: "4px",
        },
      }}
    >
      <App />
    </ConfigProvider>
  </Provider>
);
