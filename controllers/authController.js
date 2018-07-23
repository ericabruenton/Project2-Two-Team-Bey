const express = require('express');
const router = express.Router();
const User = require('../models/users');
const bcrypt = require('bcryptjs');

// ======================================
//  Login Index Page Route:
// ======================================

router.get('/', (req, res) => {
  res.render('auth/login.ejs', {
    message: req.session.message
  });
});


// =============================================================
//  Login Post Route to Users or Fail Route Back to Auth Index:
// =============================================================

router.post('/login', (req, res) => {
  User.findOne({username: req.body.username}, (err, user) => {
    if(user){
        if(bcrypt.compareSync(req.body.password, user.password)){
          req.session.username = user.username;
          req.session.loggedIn = true;

          res.redirect('/users')
        } else {
          req.session.message = 'Username or password is incorrect';
          res.redirect('/auth')
        }
    } else {
      req.session.message = 'Username or password is incorrect';
      res.redirect('/auth')
    }
  });
});

// ========================================================
//  Register Route w/HASH Password:
// ========================================================

router.post('/register', (req, res) => {
  const password = req.body.password;
  const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

  // Made a Database entry object to enter into User Model.
  const userDbEntry = {};
  userDbEntry.username = req.body.username;
  userDbEntry.password = passwordHash;
  //Creating entry into the Database.
  User.create(userDbEntry, (err, user) => {

    req.session.username = user.username;
    req.session.loggedIn = true; 
    res.redirect('/auth')

  });
});

// LOGGING OUT OR DESTROYING THE SESSIOn

router.get('/logout', (req, res) => {

  req.session.destroy((err) => {
    if(err){
      res.send('error destroying seesion');
    } else {
      res.redirect('/auth');
    }
  });

});


module.exports = router;