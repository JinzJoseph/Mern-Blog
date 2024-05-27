import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About";
import SignIn from "./Pages/SignIn";
import Signup from "./Pages/Signup";
import Projects from "./Pages/Projects";
import Dashboard from "./Pages/Dashboard";
import Header from "./Components/Header";
import FooterCom from "./Components/Footer";
import PrivateRoute from "./Components/PrivateRoute";
import CreatePost from "./Pages/CreatePost";
import AdminPrivateRoute from "./Components/AdminPrivateRoute";
import UpdatedPost from "./Pages/UpdatedPost";
import Postpage from "./Pages/Postpage";
import Search from "./Pages/Search";
function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/about" element={<About />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/projects" element={<Projects />} />
          <Route path='/search' element={<Search />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
       
          </Route>
          <Route element={<AdminPrivateRoute />}>
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/update-post/:id" element={<UpdatedPost />} />
          </Route>
          <Route path="/post/:slugId" element={<Postpage />} />
        </Routes>
        <FooterCom />
      </BrowserRouter>
    </>
  );
}

export default App;
