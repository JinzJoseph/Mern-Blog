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
        message:"suucessfull uploaded",
        success:true,
        data:savedPost
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
