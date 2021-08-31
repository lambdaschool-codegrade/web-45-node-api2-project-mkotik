// implement your posts router here
const express = require("express");
const Posts = require("./posts-model");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const posts = await Posts.find();
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "The posts information could not be retrieved" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Posts.findById(id);
    if (post) {
      res.status(200).json(post);
    } else {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist" });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "The posts information could not be retrieved" });
  }
});

router.post("/", async (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  } else {
    Posts.insert({ title, contents })
      .then(({ id }) => {
        Posts.findById(id)
          .then((post) => res.status(201).json(post))
          .catch((err) =>
            res.status(500).json({
              message:
                "There was an error while getting the new post from the database",
            })
          );
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "There was an error while saving the post to the database",
        });
      });
  }
});

router.put("/:id", async (req, res) => {
  const { title, contents } = req.body;
  const id = req.params.id;
  console.log(req.body);
  if (!title || !contents) {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  } else {
    try {
      const updatedId = await Posts.update(id, { title, contents });
      if (updatedId) {
        const post = await Posts.findById(updatedId);
        res.status(201).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      }
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ message: "The post information could not be modified" });
    }
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const postToDelete = await Posts.findById(id);
    if (postToDelete) {
      await Posts.remove(id);
      res.status(200).json(postToDelete);
    } else {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist" });
    }
  } catch (err) {
    res.status(500).json({ message: "The post could not be removed" });
  }
});

router.get("/:id/comments", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Posts.findById(id);
    if (!post) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist" });
    } else {
      const result = await Posts.findPostComments(id);
      res.status(200).json(result);
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "The comments information could not be retrieved" });
  }
});

module.exports = router;
