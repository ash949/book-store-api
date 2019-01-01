let express = require('express');
let passport = require('./middlewares/auth');
let authRouter = require('./routers/auth');
let usersRouter = require('./routers/users');
let categoriesRouter = require('./routers/categories').router;
let booksRouter = require('./routers/books').router;
let models = require('./models');

const port = process.env.PORT || 3000;

let app = express();

app.use(express.json());
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
    models.Category.destroy({where: {}}).then(() => {
      models.User.destroy({where:{id: 13123123}}).then(() => {
        Promise.all([
          models.Category.create({name: 'horror'}).then(c => {
          }),
          models.Category.create({name: 'tech'}),
          models.Category.create({name: 'comedy'}),
          models.Book.destroy({where: {}})
        ]).then(() => {
          console.log('====================================================================================');
          console.log('====================================================================================');
          console.log('====================================================================================');
          
        });
      });
    });
    
  });
});

module.exports = app;