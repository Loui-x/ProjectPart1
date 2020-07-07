console.clear();
const User = require('./models/User');
/*
  Step 1: Create a new express app
*/
const express = require('express');

const app = express();
const passport = require('passport');
require('dotenv').config();

/*
  Step 2: Setup Mongoose (using environment variables)
*/
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI, {
  auth: {
    user: process.env.DB_USER,
    password: process.env.DB_PASS
  },
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).catch(err => console.error(`Error: ${err}`));


const session = require('express-session');
app.use(session({
  secret: 'any salty secret here',
  resave: true,
  saveUninitialized: false
}));


/*

  Step 3: Setup and configure Passport
*/

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


/*
  Step 4: Setup the asset pipeline, path, the static paths,
  the views directory, and the view engine
*/
const path = require('path');
app.use('/css', express.static('assets/css'));
app.use('/js', express.static('assets/js'));
app.use('/images', express.static('assets/images'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/*
  Step 5: Setup the body parser
*/
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*
  Step 6: Setup our flash helper, default locals, and local helpers (like formData and authorized)
*/
const flash = require('connect-flash');
app.use(flash());
app.use('/', (req, res, next) => {
  // Setting default locals
  res.locals.pageTitle = "Untitled";

  // Passing along flash message
  res.locals.flash = req.flash();
  res.locals.formData = req.session.formData || {};
  req.session.formData = {};
  
  // Authentication helper
  res.locals.authorized = req.isAuthenticated();
  if (res.locals.authorized) res.locals.email = req.session.passport.user;

  next();
});

/*
  Step 7: Register our route composer
*/
const routes = require('./routes.js');
app.use('/', routes);


/*
  Step 8: Start the server
*/
app.listen(process.env.PORT || 3000, () => console.log(`listening on port $(port)`));