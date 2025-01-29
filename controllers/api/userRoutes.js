const router = require('express').Router();
const { User } = require('../../models');
const bcrypt = require('bcrypt');

// Sign up a new user
router.post('/signup', async (req, res) => {
  try {
    console.log("Signup Request Body:", req.body); // Debugging log

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10), // Ensures password is hashed
    });

    req.session.save(() => {
      req.session.user_id = newUser.id;
      req.session.logged_in = true;
      console.log("User signed up, session saved:", req.session); // Debugging log
      res.status(200).json(newUser);
    });

  } catch (err) {
    console.error('Error Signing Up:', err.message);
    res.status(500).json({ message: 'Failed to sign up. Please try again.' });
  }
});

// Login an existing user
router.post('/login', async (req, res) => {
  try {
    console.log("Login Request Body:", req.body); // Debugging log

    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      return res.status(400).json({ message: 'Incorrect email or password, please try again.' });
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      return res.status(400).json({ message: 'Incorrect email or password, please try again.' });
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      console.log("User logged in, session saved:", req.session); // Debugging log
      res.status(200).json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    console.error('Error Logging In:', err.message);
    res.status(500).json({ message: 'Failed to log in. Please try again.' });
  }
});

// Log out a user
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      console.log("User logged out, session destroyed."); // Debugging log
      res.status(204).end();
    });
  } else {
    res.status(404).json({ message: "No active session found." });
  }
});

module.exports = router;
