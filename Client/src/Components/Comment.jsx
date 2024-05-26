import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { Button, Textarea } from "flowbite-react";
const Comment = ({ comment, onLike, onEdit,onDelete }) => {
  const [users, SetUsers] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, SetIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.comment);
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`/api/user/${comment.userId}`);
        // console.log(res);
        if (res.status === 200) {
          SetUsers(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [comment]);
  const handleEdit = async () => {
    SetIsEditing(true);
    setEditedContent(comment.comment);
  };
  const handleSave = async () => {
    try {
      const res = await axios.put(
        `/api/comment/edit/${comment._id}`,
        {
          editedContent,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if(res.status===200)
        {
          SetIsEditing(false)
          onEdit(comment,editedContent)
        }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm" key={comment._id}>
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={users.profilePic}
          alt={users.username}
        ></img>
      </div>
      <div className="flex-1">
        <div className=" flex items-center mb-1">
          <span className=" font-bold mr-1 text-xs truncate">
            {" "}
            {users ? `?@${users.username}` : "anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            ></Textarea>
            <div className="flex justify-end gap-2 mt-3 text-xs">
              <Button
                type="button"
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-green-500"
                onClick={handleSave}
              >
                save
              </Button>
              <Button
                type="button"
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-green-500"
                outline
                onClick={() => SetIsEditing(false)}
              >
                cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 pb-3">{comment.comment}</p>
            <div className="flex items-center gap-2 text-xs border-t
             dark:border-gray-700 mx-w-fit p-3 ">
              <button
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
                type="button"
                onClick={() => onLike(comment._id)}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p className="text-gray-400">
                {comment.numberofLikes > 0 &&
                  comment.numberofLikes +
                    " " +
                    (comment.numberofLikes === 1 ? "Like" : "Likes")}
              </p>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-red-500"
                      onClick={handleEdit}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-red-500"
                      onClick={()=>onDelete(comment._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Comment;
