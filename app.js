const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware')

const app = express(); const port = 8080

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
//const dbURI = 'mongodb+srv://admin:admin@cluster0.k7sbp.mongodb.net/node-auth';
//const dbURI = "mongodb://mongoadmin:bdung@localhost:27018/testdb?authSource=admin";
const dbURI = "mongodb://root:rootpassword@localhost:27022/node-auth?authSource=admin";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => {
    console.log(result.connection)    
    app.listen(3000, () => console.log(`Listening to port ${3000}`))
  })
  .catch((err) => console.log(err));



// routes
app.get('*', checkUser)
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);
//app.use(airline-routes);

// cookies
/*
app.get('/set-cookies', (req, res) => {
  // res.setHeader('Set-Cookie', 'newUser=true');
  res.cookie('newUser', false);
  res.cookie('isEmployee', true, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });
  res.send('you got the cookies!');
});
*/
app.get('/read-cookies', (req, res) => {
    console.log(req.url)
    console.log(req.cookies.jwt);
    res.json({ cookie1: req.cookies.jwt });
  }
);

app.get('/read-header', (req, res) => {
  // jwt from header
  const authHeader = req.headers.authorization;

  if (authHeader) {
      const token = authHeader.split(' ')[1];
      const jwt = require('jsonwebtoken');
      jwt.verify(token, 'secret key', (err, user) => {
          if (err) {
              return res.sendStatus(403);
          }
          res.json({ jwt1: user });
      });
  }
  else { 
    return res.sendStatus(403);
  }
});


// BL
//function create_new_airline({airline_name, airline_email}) {
//
//}


