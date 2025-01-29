const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// Render homepage
router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [{ model: User, attributes: ['name'] }], // Include user name for each post
    });

    const posts = postData.map((post) => post.get({ plain: true }));

    res.render('home', {
      posts,
      logged_in: req.session.logged_in || false, // Pass logged_in status
    });
  } catch (err) {
    console.error('Error fetching homepage data:', err); // Improved error log
    res.status(500).json({ message: 'Failed to load homepage. Please try again later.' });
  }
});

// Render single post with comments
router.get('/post/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['name'] }, // Include post author's name
        {
          model: Comment, // Include comments for the post
          include: [{ model: User, attributes: ['name'] }], // Include the name of the user who commented
        },
      ],
    });

    if (!postData) {
      console.log(`Post with ID ${req.params.id} not found`); // Debugging log
      res.status(404).json({ message: 'Post not found!' });
      return;
    }

    const post = postData.get({ plain: true });

    res.render('post', {
      post,
      logged_in: req.session.logged_in || false, // Pass logged_in status
    });
  } catch (err) {
    console.error('Error fetching single post data:', err); // Improved error log
    res.status(500).json({ message: 'Failed to load the post. Please try again later.' });
  }
});

// Render dashboard
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    const postData = await Post.findAll({
      where: { user_id: req.session.user_id }, // Fetch posts created by the logged-in user
    });

    const posts = postData.map((post) => post.get({ plain: true }));

    res.render('dashboard', {
      posts,
      logged_in: true, // User must be logged in to access the dashboard
    });
  } catch (err) {
    console.error('Error fetching dashboard data:', err); // Improved error log
    res.status(500).json({ message: 'Failed to load dashboard. Please try again later.' });
  }
});

module.exports = router;
