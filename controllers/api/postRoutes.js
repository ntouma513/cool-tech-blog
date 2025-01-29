const router = require('express').Router();
const { Post } = require('../../models');
const withAuth = require('../../utils/auth');

// Create a new post
router.post('/', withAuth, async (req, res) => {
  try {
    console.log("Session Data:", req.session); // Logs entire session data
    console.log("User ID from session:", req.session.user_id); // Ensure user_id is available

    // Check if the session contains a user ID
    if (!req.session.user_id) {
      return res.status(401).json({ message: 'Unauthorized: Please log in.' });
    }

    // Validate post data
    if (!req.body.title || !req.body.content) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    // Create the new post
    const newPost = await Post.create({
      title: req.body.title,
      content: req.body.content,
      user_id: req.session.user_id, // Ensure this value is correct
    });

    res.status(200).json(newPost);
  } catch (err) {
    console.error('Error Creating Post:', err.message);
    res.status(500).json({ message: 'Failed to create post. Please try again.' });
  }
});

// Delete a post
router.delete('/:id', withAuth, async (req, res) => {
  try {
    console.log("Attempting to delete post ID:", req.params.id);
    console.log("User ID from session:", req.session.user_id);

    const deletedPost = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id, // Ensure user can only delete their own posts
      },
    });

    if (!deletedPost) {
      return res.status(404).json({ message: 'No post found with this ID!' });
    }

    res.status(200).json({ message: 'Post deleted successfully.' });
  } catch (err) {
    console.error('Error Deleting Post:', err.message);
    res.status(500).json({ message: 'Failed to delete post. Please try again.' });
  }
});

module.exports = router;
