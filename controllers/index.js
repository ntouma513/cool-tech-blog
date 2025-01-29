const router = require('express').Router();
const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');

// Home routes for the root path `/`
router.use('/', homeRoutes);

// API routes under `/api`
router.use('/api', apiRoutes);

// Catch-all route for undefined paths
router.use((req, res) => {
  res.status(404).send('404 Not Found');
});

module.exports = router;
