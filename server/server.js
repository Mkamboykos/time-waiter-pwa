var database = require('./Config/DatabaseConfig');
var express = require('express');
var app = express();
var cors = require('cors'); 
var port = process.env.PORT || 3001;

// This is to allow our api for parsing json
app.use(express.json());

// This is to allow our api for cross-origin resource sharing
app.use(cors());

// This is to allow our api to receive data from a client app
app.use(express.urlencoded({
    extended: true
}));

// test database connection
database.connect((err) => {
    if(err){
      console.log('Error connecting to Db');
      return;
    }
    console.log('Connection established');
});

// Test server connection is working
app.get('/', (req, res) => {
    res.send({
        msg: 'Connection is working!'
    });
});

// // Register routes in the main index.js
// app.use('/', [
//     require('./routes/tweet'),
//     require('./routes/auth')
// ]);


app.post('/SignUp/username', (req, res) => {

    const username = req.body.username;

    database.query("SELECT username FROM sign_up_manager WHERE username = ?",[username],
        (err, results) => {
            !err ? res.send(results).json : res.json(err);
        }
    );
});

app.post('/SignUp/email', (req, res) => {

    const email = req.body.email;

    database.query("SELECT email FROM sign_up_manager WHERE email = ?",[email],
        (err, results) => {
            !err ? res.send(results).json : res.json(err);
        }
    );
});


// Post API for when a manager signs up
app.post('/SignUp', (req, res) => {

    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const retypePassword = req.body.retypePassword;
    const restaurant_name = req.body.restaurant_name;
    const restaurant_address = req.body.restaurant_address;
    const restaurant_city = req.body.restaurant_city;
    const restaurant_state = req.body.restaurant_state;
    const restaurant_zip = req.body.restaurant_zip;

    database.query("INSERT INTO sign_up_manager (first_name, last_name, username, email, password, confirm_password, restaurant_name, restaurant_address, restaurant_city, restaurant_state, restaurant_zip) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
        [first_name, last_name, username, email, password, retypePassword, restaurant_name, restaurant_address, restaurant_city, restaurant_state, restaurant_zip],
        (err, results) => {
            !err ? res.json(results) : res.json(err);
        });
});


// set port, listen for requests
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//     console.log(`Your server is running on port ${PORT}.`);
// });
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});