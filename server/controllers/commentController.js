import Comment from "../models/commentModel.js";

export const createcomment = async (req, res) => {
  const { comment, userId, postId } = req.body;

  try {
    if (userId !== req.user.id) {
      res.status(403).json({
        message: "you are not allowed to these action",
        success: false,
      });
    }
    const newComment = new Comment({
      userId,
      postId,
      comment,
    });

    await newComment.save();

    res.status(200).json(newComment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const getAllcomment = async (req, res) => {
  try {
    const comments = await Comment.find({
      postId: req.params.postId,
    });
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const likeCommand = async (req, res) => {
  try {
    const commend = await Comment.findById(req.params.commandId);
    if (!commend) {
      res.status(404).json("Comment is not found!...");
    }
    const userIndex = commend.likes.indexOf(req.user.id);
    if (userIndex == -1) {
      commend.numberofLikes += 1;
      commend.likes.push(req.user.id);
    } else {
      commend.numberofLikes -= 1;
      commend.likes.splice(userIndex, 1);
    }
    await commend.save();
    res.status(200).json(commend);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commandId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "You are not allowed to edit this comment." });
    }

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commandId,
      {
        comment: req.body.editedContent,
      },
      { new: true }
    );
    console.log(editedComment);
    res.status(200).json(editedComment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const deleteComment = async (req, res) => {
  console.log(req.params.commentId);
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json("Comment is not found...");
    }
    if (req.user.id !== comment.userId && req.user.isAdmin === false) {
      returnres.status(403).json("you are not allowed to delete these comment");
    }
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json("Comment has been deleted");
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const getcomments = async (req, res) => {
  if (req.user.isAdmin === false) {
    return res.status(403).json("you are not allowed to get all comments");
  }
  try {
    const startIndex = req.query.startIndex || 0;
    const limit = req.query.limit || 9;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;
    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({
      comments,
      totalComments,
      lastMonthComments,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
