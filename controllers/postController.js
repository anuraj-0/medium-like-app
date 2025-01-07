const {
  Author,
  validateAuthor,
  Post,
  validatePost,
} = require("../models/index");

const createPost = async function (req, res) {
  try {
    // Validate the incoming data with Joi
    const { error } = validatePost(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message); // If validation fails, send error
    }

    const redisClient = req.redisClient;
    const post = new Post(req.body);
    await post.save();
    const author = await Author.findById(req.body.author);
    author.posts.push(post._id);
    await author.save();
    console.log("Invalidating cache...");
    // Invalidate all cache keys for paginated posts
    const keys = await redisClient.keys("posts:*");
    const deletePromises = keys.map(function (key) {
      redisClient.del(key);
    });
    await Promise.all(deletePromises);
    console.log("Cache invalidated successfully.");
    res.send(post);
  } catch (err) {
    res.send(err);
  }
};

const likePost = async function (req, res) {
  try {
    const likedPost = await Post.findById(req.params.id);
    likedPost.likes++;
    await likedPost.save();
    res.send(likedPost);
  } catch (err) {
    res.send(err);
  }
};

const getPostsByAuthor = async function (req, res) {
  try {
    const author = await Author.findById(req.params.id).populate("posts");
    res.send(author.posts);
  } catch (err) {
    res.send(err);
  }
};

const getPosts = async function (req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    console.log(`Page: ${page}, PageSize: ${pageSize}`);

    const skip = (page - 1) * pageSize;
    const totalPosts = await Post.countDocuments();

    console.log(`Skip: ${skip}, Total Posts: ${totalPosts}`);

    const redisClient = req.redisClient;
    const cacheKey = `posts:${page}`;
    const cachedPosts = await redisClient.get(cacheKey);

    if (cachedPosts) {
      console.log("Returning cached posts...");
      res.send({
        posts: JSON.parse(cachedPosts),
        totalPages: Math.ceil(totalPosts / pageSize),
        currentPage: page,
      });
    } else {
      console.log("Fetching posts from database...");
      const posts = await Post.find()
        .skip(skip)
        .limit(pageSize)
        .populate("author");

      console.log(`Fetched ${posts.length} posts`);

      await redisClient.setEx(cacheKey, 3600, JSON.stringify(posts));

      res.send({
        posts: posts,
        totalPages: Math.ceil(totalPosts / pageSize),
        currentPage: page,
      });
    }
  } catch (err) {
    console.error(err);
    res.send(err);
  }
};

const updatePost = async function (req, res) {
  try {
    // Validate the incoming data with Joi
    const { error } = validatePost(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message); // If validation fails, send error
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send(updatedPost);
  } catch (err) {
    res.send(err);
  }
};

const deletePost = async function (req, res) {
  try {
    const deletePost = await Post.findByIdAndDelete(req.params.id);
    res.send({
      message: `Post with title ${deletePost.title} has been deleted!`,
    });
  } catch (err) {
    res.send(err);
  }
};

module.exports = {
  createPost,
  likePost,
  getPostsByAuthor,
  getPosts,
  updatePost,
  deletePost,
};
