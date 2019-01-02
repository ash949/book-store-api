let express = require('express');
const bodyParser = require('body-parser');
let passport = require('./middlewares/auth');
let authRouter = require('./routers/auth');
let usersRouter = require('./routers/users');
let categoriesRouter = require('./routers/categories').router;
let booksRouter = require('./routers/books').router;
let models = require('./models');
let os = require('os');


const port = process.env.PORT || 3000;

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded()); 
app.use(passport.initialize());

app.use('/auth', authRouter);
app.use('/users', passport.authenticate('jwt', { session: false }), usersRouter);
app.use('/categories', categoriesRouter);
app.use('/books', booksRouter);

app.get('/', (req, res) => {
  res.send('hello');
});

app.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send(req.user);
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