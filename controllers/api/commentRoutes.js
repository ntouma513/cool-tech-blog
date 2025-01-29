const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Add a new comment
router.post('/', withAuth, async (req, res) => {
  try {
    if (!req.body.content || !req.body.post_id) {
      res.status(400).json({ message: 'Content and Post ID are required.' });
      return;
    }

    const newComment = await Comment.create({
      content: req.body.content,
      post_id: req.body.post_id,
      user_id: req.session.user_id,
    });

    res.status(200).json(newComment);
  } catch (err) {
    console.error('Error Creating Comment:', err.message);
    res.status(500).json(err);
  }
});

module.exports = router;
