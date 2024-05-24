import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Spinner } from "flowbite-react";
import { Link, useParams } from "react-router-dom";
import CallToAction from "../Components/CallToAction";

const Postpage = () => {
  const { slugId } = useParams();
  const [loading, SetLoading] = useState(true);
  const [Error, SetError] = useState(false);
  const [post, SetPost] = useState("");
  useEffect(() => {
    const fetchPost = async () => {
      try {
        SetLoading(false);
        const res = await axios.get(`/api/post/getpost?slug=${slugId}`);
        console.log(res);
        console.log(res.data.posts[0]);
        if (!res.statusText === "OK") {
          SetLoading(false);
          SetError(true);
          return;
        }
        if (res.statusText === "OK") {
          SetPost(res.data.posts[0]);
          SetLoading(false);
          SetError(false);
        }
      } catch (error) {
        SetLoading(false);
        SetError(true);
      }
    };
    fetchPost();
  }, [slugId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen ">
        <Spinner size="xl" />
      </div>
    );
  }
  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 text-center font serif max-w-2xl">
        {post && post.title}
      </h1>
      <Link
        to={`/search?category=${post && post?.category}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size="xs">
          {post && post.category}
        </Button>
        <img
          src={post && post.image}
          alt={post && post.title}
          className="mt-10 p-4 max-h-[600px] w-full  object-cover"
        ></img>
        <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2zl text-xs">
          <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
          <span className="italic">
            {post && (post.content.length / 1000).toFixed(0)} mins read
          </span>
        </div>
        <div
          className="p-3 max-w-2xl mx-auto w-full post-content"
          dangerouslySetInnerHTML={{ __html: post && post.content }}
        ></div>
        <div className="max-w-4xl mx-auto w-full">
          <CallToAction />
        </div>
      </Link>
    </main>
  );
};

export default Postpage;
