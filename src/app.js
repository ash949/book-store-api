let express = require('express');
const bodyParser = require('body-parser');
let passport = require('./middlewares/auth');
let authRouter = require('./routers/auth');
let usersRouter = require('./routers/users').router;
let categoriesRouter = require('./routers/categories').router;
let booksRouter = require('./routers/books').router;
let models = require('./models');
let os = require('os');


const port = process.env.PORT || 3000;

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded()); 
app.use(passport.initialize());

app.use('/auth', authRouter(passport));
app.use('/users', usersRouter(passport));
app.use('/books', booksRouter(passport));
app.use('/categories', categoriesRouter(passport));

models.sequelize.sync().then(function () {
  app.listen(port, () => {});
});

module.exports = app;