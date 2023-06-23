var express = require('express');
var app     = express();
var cors    = require('cors');
var dal     = require('./dal.js');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const swaggerOptions = {
    swaggerDefinition: {
        title: 'Banking API',
        version: '1.0.0'
    },
    apis: ['index.js']
}

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
// used to serve static files from public directory
app.use(express.static('public'));
app.use(cors({
    origin: ["http://localhost:3000", "https://banking-app-3ov2.onrender.com"]
}) );

// create user account
app.get('/account/create/:name/:email/:uid', function (req, res) {
    // check if account exists
    dal.findOne(req.params.email).
        then((users) => {
            console.log("trying to add user");
            // if user exists, return error message
            if(users != null) {
                console.log('User already exists');
                res.send('User already exists');    
            }
            else {
                // else create user
                dal.create(req.params.name, req.params.email, req.params.uid).
                    then((user) => {
                        console.log(user);
                        res.send(user);            
                    });            
            }
        });
});

// login user 
app.post('/account/login/:email/:password', function (req, res) {
    dal.find(req.params.email).
        then((user) => {
            // if user exists, check password
            if(user.length > 0){
                if (user[0].password === req.params.password){
                    res.send(user[0]);
                }
                else{
                    res.send('Login failed: wrong password');
                }
            }
            else{
                res.send('Login failed: user not found');
            }
    });
    
});

// find user account
app.get('/account/find/:email', function (req, res) {
    dal.find(req.params.email).
        then((user) => {
            console.log(user);
            res.send(user);
    });
});

// find one user by email - alternative to find
app.get('/account/findOne/:email', function (req, res) {
    console.log(req.params.email);
    dal.findOne(req.params.email).
        then((user) => {
            console.log(user);
            res.send(user);
    });
});


// update - deposit/withdraw amount
app.get('/account/update/:email/:amount', function (req, res) {
    var amount = Number(req.params.amount);
    dal.update(req.params.email, amount).
        then((response) => {
            console.log(response);
            res.send(response);
    });    
});

// all accounts
app.get('/account/all', function (req, res) {
    dal.all().
        then((docs) => {
            console.log(docs);
            res.send(docs);
    });
});

let port = process.env.PORT || 3000;
app.listen(port);
console.log('Running on port: ' + port);
