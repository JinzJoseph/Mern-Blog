import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Spinner } from "flowbite-react";
import { Link, useParams } from "react-router-dom";
import CallToAction from "../Components/CallToAction";
import CommentSection from "../Components/CommentSection";
import PostCard from "../Components/PostCard";

const Postpage = () => {
  const { slugId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/post/getpost?slug=${slugId}`);
        if (res.status !== 200) {
          setError(true);
          return;
        }
        setPost(res.data.posts[0]);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slugId]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await axios.get(`/api/post/getpost?limit=3`);
        if (res.status === 200) {
          setRecentPosts(res.data.posts);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchRecentPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Failed to load the post.</p>
      </div>
    );
  }

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 text-center font-serif max-w-2xl">
        {post && post.title}
      </h1>
      <Link to={`/search?category=${post && post.category}`} className="self-center mt-5">
        <Button color="gray" pill size="xs">
          {post && post.category}
        </Button>
      </Link>
      <img
        src={post && post.image}
        alt={post && post.title}
        className="mt-10 p-4 max-h-[600px] w-full object-cover"
      />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
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
      <CommentSection postId={post && post._id} />
      <div  className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5">Recent articles</h1>
        <div className="flex  gap-5 mt-5 justify-center">
          {recentPosts && recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </main>
  );
};

export default Postpage;
