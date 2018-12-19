let express = require('express');
let models = require('./models');
let passport = require('./middlewares/auth');
let authRouter = require('./routers/auth').router;
let usersRouter = require('./routers/users').router;

const port = process.env.PORT || 3000;

let app = express();

app.use(express.json());
app.use(passport.initialize());

app.use('/auth', authRouter);
app.use('/users', usersRouter);

app.get('/', (req, res) => {
  res.send('hello');
});

// app.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
//   res.send(req.user);
// });

// app.post('/', (req, res) => {
//   res.send(req.body);
// });

models.sequelize.sync().then(function () {
  app.listen(port, () => {
    process.stdout.write('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n');
    models.User.destroy({
      where: {}
    }).then(()=>{
      models.User.create({
        username: 'zaasasdadadsadasdasd',
        email: 'test@test.com',
        password: '12345a'
      }).then((user) => {
        let admin = models.Admin.build();
        user.setAdmin(admin).then(() => {
          admin.getUser().then((user) => {
            console.log(user.toJSON());
          });
        });
      }).catch((err) => {
        console.log(err.message);
      });
    });
    
  });
});
