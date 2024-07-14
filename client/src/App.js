import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedPage from "./components/ProtectedPage";
import Spinner from "./components/Spinner";
import { useSelector } from "react-redux";
import BookInfo from "./pages/bookInfo";
import LandingPage from "./pages/LandingPage";
import Chats from "./pages/Chats";
import Report from "./pages/report/report";

function App() {
  const { loading } = useSelector((state) => state.loaders);
  return (
    <div>
      {loading && <Spinner />}
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedPage>
                <Home />
              </ProtectedPage>
            }
          />
          <Route
            path="/book/:id"
            element={
              <ProtectedPage>
                <BookInfo />
              </ProtectedPage>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedPage>
                <Profile />
              </ProtectedPage>
            }
          />
          <Route
            path="/report"
            element={
              <ProtectedPage>
                <Report />
              </ProtectedPage>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/landing-page" element={<LandingPage />} />
          <Route path="/chats" element={<Chats />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
