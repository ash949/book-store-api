let express = require('express');
const bodyParser = require('body-parser');
let passport = require('./middlewares/auth');
let authRouter = require('./routers/auth');
let usersRouter = require('./routers/users').router;
let categoriesRouter = require('./routers/categories').router;
let booksRouter = require('./routers/books').router;
let models = require('./models');
const authenticate = require('./routers/helpers').authenticate
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


app.get('/', (req, res) => {
  res.send('hello');
});

app.post('/', (req, res) => {
  res.send(req.body);
});

models.sequelize.sync().then(function () {
  app.listen(port, () => {
    console.log('\n'.repeat(40));
  });
});

module.exports = app;