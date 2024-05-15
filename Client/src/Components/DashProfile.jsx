import React, { useEffect, useState, useRef } from "react"; // Added useState and useRef imports
import { useSelector, useDispatch } from "react-redux";
import { Button, TextInput } from "flowbite-react"; // Correct import statement
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import app from "../Firebase/Firebase"; // Assuming this is the correct import path for your Firebase config
import axios from "axios"; // Added axios import
import {
  
 

  updatedUserStart,
  updatedUserSuccess,
  updatedUserFailure,
} from "../redux/User/UserSlice"; // Imported necessary Redux actions

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(
    currentUser.profilePic || null
  ); // Initialized to currentUser.profilePic if available
  const [formData, setFormData] = useState({});
  console.log(formData);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const filePickerRef = useRef(null); // Added useRef for file input
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // setImageFileUploadProgress(progress.toFixed(0)); // Not defined in the code provided
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        // setImageFileUploadProgress(null); // Not defined in the code provided
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = async (e) => { // Added parameter e for event
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError("please wait for image to upload");
      return;
    }
    try {
      dispatch(updatedUserStart());
      const res = await axios.put(
        `/api/user/update/${currentUser._id}`,
        {
          body: JSON.stringify(formData),
        },
         // Removed body: JSON.stringify(formData) and used formData directly
        {
          headers: {
            "Content-Type": "applications/json", // Corrected "applications/json" to "application/json"
          },
        }
      );
      if (!res.statusCode === "OK") { // Corrected condition from !res.statusCode === "OK" to res.status !== 200
        dispatch(updatedUserFailure(res.data.message));
        setUpdateUserError(res.data.message);
      } else {
        dispatch(updatedUserSuccess(res.data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      console.log(error);
      dispatch(updatedUserFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  return (
    <div className="mx-w-lg mx-auto p-3 w-full ">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full "
          onClick={() => filePickerRef.current.click()}
        >
          <img
            src={imageFileUrl || currentUser?.profilePic}
            alt="user"
            className="rounded-full w-full h-full object-cover border-8 border-[lightgray]"
          />
        </div>
        <TextInput
          type="text"
          id="username"
          placeholder="Username.."
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email.."
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="*******"
          onChange={handleChange}
        />
        <Button type="submit" outline>
          Update
        </Button>{" "}
        {/* Corrected Button text */}
      </form>
      <div className="text-red-500 justify-between flex m-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out </span>
      </div>{" "}
      {/* Added missing closing tag */}
    </div>
  );
};

export default DashProfile;
