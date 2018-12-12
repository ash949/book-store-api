let express = require('express');
let models = require('./models');


let app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('hello');
});

app.post('/', (req, res) => {
    res.send(req.body);
});


models.sequelize.sync({force: true}).then(function () {
    app.listen(port, () => {
        console.log(`listening on ${port}`);
    });
});

