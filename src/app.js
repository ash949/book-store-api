let express = require('express');
let bcrypt = require('bcrypt');
let models = require('./models');
let passport = require('./middlewares/auth');
let authRouter = require('./routers/auth');

const port = process.env.PORT || 3000;

let app = express();

app.use(express.json());
app.use(passport.initialize());

app.use('/auth', authRouter);

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
		// Creating a sample user;

		// bcrypt.hash('123456', 2, (err, hash)=>{
		//     if(err){
		//         console.log('==================================================================');
		//         console.log('ERROR: Something went wrong while registeration...please try again');
		//         console.log('==================================================================');
		//     }else{
		//         models.User.create({
		//             username: 'hamza1',
		//             email: 'hamza@hamza.com',
		//             password: hash
		//         });
		//     }
		// });
	});
});



