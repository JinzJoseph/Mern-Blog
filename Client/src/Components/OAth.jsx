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
      if (res.data.success === false) {
        dispatch(signInFailure(res.data.message))
      }
      const data=res.data.data
      // setLoading(false);
      if (res.statusText==="OK") {
        dispatch(signInSuccess(data));
        
        navigate("/");
      }
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
