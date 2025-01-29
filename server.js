const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./config/connection');
const routes = require('./controllers'); // Importing routes
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Set up session handling with Sequelize Store
const sess = {
  secret: 'Super secret secret',
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true,
    secure: false, // Set to true in production with HTTPS
    sameSite: 'strict',
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

// Set up Handlebars.js as the templating engine
const hbs = exphbs.create({});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Log session data for debugging
app.use((req, res, next) => {
  console.log("Session Data:", req.session);
  next();
});

// Add routes
app.use(routes);

// Sync Sequelize models to the database and start the server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
});

module.exports = app;