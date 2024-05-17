// import React from "react";
// import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// const CreatePost = () => {
//   return (
//     <div className="p-3 max-w-3xl mx-auto min-h-screen">
//       <h1 className="text-center text-3xl my-7 font-semibold">Create A post</h1>
//       <form>
//         <div className="flex flex-col gap-4 sm:flex-row justify-between">
//           <TextInput
//             type="text"
//             placeholder="Title"
//             required
//             id="title"
//             className="flex-1"
//           />
//           <Select>
//             <option value="uncategorized">Select a category</option>
//             <option value="javascript">Javascript</option>
//             <option value="reactjs">React</option>
//             <option value="nextjs">Next js</option>
//             <option value="vuejs">vue js</option>
//           </Select>
//         </div>
//         <div className="flex gap-5 my-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
//           <FileInput type="file" accept="image/*" />
//           <Button
//             type="button"
//             className="bg-gradient-to-r from-blue-500 to-green-500  "
//             outline
//           >
//             upload
//           </Button>
//         </div>
//         <ReactQuill
//           theme="snow"
//           placeholder="Write Something....."
//           className="h-72 mb-12"
//           required
//         />
//         <Button type="submit" className="bg-gradient-to-r from-blue-500 to-green-500  ">
//           Publish
//         </Button>
//       </form>
//     </div>
//   );
// };

// export default CreatePost;
import React, { useState } from "react";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CircularProgressbar } from "react-circular-progressbar";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import app from "../Firebase/Firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  console.log(formData);
  const [PublishError, SetPublishError] = useState("");
  const navigate = useNavigate();
  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("please upload image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError(
            "Could not upload image (File must be less than 2MB)"
          );
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setFormData({ ...formData, image: downloadURL });
            setImageUploadError(null);
          });
        }
      );
    } catch (error) {
      setImageUploadError(error);
      setImageUploadProgress(null);

      console.log(error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "/api/post/create",
        {
          formData,
        },

        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res);
      if (res.data.success == false) {
        SetPublishError(res.data.data.message);
      }
      if (res.data.success == true) {
        SetPublishError(null);
        navigate(`/post/${res.data.data.slug}`);
      }
    } catch (error) {
      console.log(error);
      SetPublishError(error);
    }
  };
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create A Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React</option>
            <option value="nextjs">Next.js</option>
            <option value="vuejs">Vue.js</option>
          </Select>
        </div>
        <div className="flex gap-5 my-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            className="bg-gradient-to-r from-blue-500 to-green-500"
            outline
            onClick={handleUploadImage}
          >
            {imageUploadProgress ? (
              <div className=" w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "upload image"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}

        {formData?.image && (
          <img
            src={formData?.image}
            alt="image"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write Something....."
          className="h-72 mb-12"
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />

        <Button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-green-500"
        >
          Publish
        </Button>
        {PublishError && (
          <Alert color="failure" className="mt-5">
            {PublishError}
          </Alert>
        )}
      </form>
    </div>
  );
};

export default CreatePost;
