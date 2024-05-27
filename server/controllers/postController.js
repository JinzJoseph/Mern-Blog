import Post from "../models/postModel.js";

export const createPost = async (req, res) => {
  if (!req.body.formData.title || !req.body.formData.content) {
    return res.status(400).json({
      message: "Please provide necessary details",
      success: false,
    });
  }

  const slug = req.body.formData.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[^a-zA-Z0-9-]/g, "-");

  const newPost = new Post({
    userId: req.user.id,
    title: req.body.formData.title,
    content: req.body.formData.content,
    image: req.body.formData.image,
    slug: slug,
    category: req.body.formData.category,
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json({
      message: "suucessfull uploaded",
      success: true,
      data: savedPost,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const getpost = async (req, res) => {
  console.log(req.query);
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { content: {$regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalPosts = await Post.countDocuments();
    // Calculate the date one month ago from the current date
    const now = new Date();
    const oneMothAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMothAgo },
    });
    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const deletePost = async (req, res) => {
  if (req.user.id !== req.params.userId) {
    res.status(403).json({
      message: "you are not allowed take these action",
      success: false,
    });
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json("The post has been deleted");
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const updatePost = async (req, res) => {
  console.log(req.body);
  if (req.user.id !== req.params.userId) {
    return res.status(403).json({
      message: "you are not allowed to update this post",
    });
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.formData.title,
          content: req.body.formData.content,
          category: req.body.formData.category,
          image: req.body.formData.image,
        },
      },
      { new: true }
    );
    res.status(200).json({
      data: updatedPost,
      success: true,
      message: "succesfully updated",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
