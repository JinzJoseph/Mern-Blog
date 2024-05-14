import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { signInSuccess } from "../redux/User/UserSlice";
import { Button } from "flowbite-react";
import app from "../Firebase/Firebase";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const OAth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      console.log(result);
      const res = await axios.post(
        "/api/auth/google",
        {
          name: result.user.displayName,
          email: result.user.email,
          googlePhoto: result.user.photoURL,
        },
        {
          headers: {
            "Content-Type": "application/json", // Corrected header name
          },
        }
      );
      console.log(res);
      dispatch(signInSuccess(res.data));
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button type="button" onClick={handleGoogleClick}>
      Countine With Google
    </Button>
  );
};

export default OAth;
