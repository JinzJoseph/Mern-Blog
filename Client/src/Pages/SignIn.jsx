import axios from "axios";
import { Alert, Button, Label, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAth from "../Components/OAth";
import {useDispatch,useSelector} from "react-redux"
import {signInStart,
  signInSuccess,
  signInFailure,} from "../redux/User/UserSlice"
const Signin = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  const { loading, error } = useSelector((state) => state.user);
  const dispatch=useDispatch()
const navigate=useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // setLoading(true);
      dispatch(signInStart())
      const res = await axios.post(
        "/api/auth/signin",
        {
       
          email,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(res);
      if (res.data.success === false) {
        dispatch(signInFailure(data.message))
      }
      setLoading(false);
      if (res.statusText==="OK") {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <Link to="/" className="text-5xl font-bold dark:text-white">
            <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg">
              Jk's
            </span>{" "}
            Blog
          </Link>
          <p className="text-sm mt-5">
            This is a demo project. You can sign up with your email and password
            or with Google.
          </p>
        </div>
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
            
            <div>
              <Label value="Your Email" />
              <TextInput
                type="email"
                placeholder="abc@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label value="Your Password" />
              <TextInput
                type="password"
                placeholder="*********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Signing Up..." : "Sign in"}
            </Button>
            <OAth/>
          </form>
          <div className="flex gap-2 text-sm mt-3">
            <span>Dont Have an account?</span>
            <Link to="/sign-up" className="text-blue-600">
              Sign up
            </Link>
          </div>
          {error && (
            <Alert className="mt-6 " color="failure">
              {error}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signin;
