const path = require('path')
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const bcrypt= require('bcryptjs')

const port = process.env.PORT || 6000

const mongoUtil = require('./public/js/application/mongoutils.js')
const app = express()
const pathDir = path.join(__dirname, './public')
const ObjectID= require('mongodb').ObjectID

app.set('view engine', 'hbs')
app.use(express.static(pathDir))
app.use(session({secret: "dgs97tsag98sagh6sb124b", resave: false, saveUninitialized: true}))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

mongoUtil.connectToServer((error, client) => {
    if (error)
        console.log('Unable to connect to database')
})

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ranganathankannan27@gmail.com',
        pass: 'password@123'
    }
});

var mailOptions = {
    from: 'ranganathankannan27@gmail.com',
    to: 'sundeephariharan1997@gmail.com',
    subject: 'Sending Email example',
    text: 'That was easy! Sending an email can be done in a jiffy...!!!'
};

function sendMail() {
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function registerUser(email, password) {
    var BCRYPT_SALT_ROUNDS = 12;
    const db = mongoUtil.getDb();
    bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
    .then(
        (hashedPassword) => {
        db.collection('users').insertOne({
            email: email,
            password: hashedPassword
        }, (error, result) => {
            if(error) {
                return console.log('Unable to insert user')
            }
            console.log(result.ops)
        })
    })
    .catch(function(error){
        console.log("Error saving user: ");
        console.log(error);
    });
}

app.get('/dashboard', (req, res) => {
    if(!req.session.userID) {
        console.log('Unauthorized user has entered')
        return res.sendFile('unauthorized.html', { root: pathDir })
    }
    return res.render('dashboard', {'username': 'hi', 'userID': req.session.userID})
})

app.get('/login', (req, res) => {
    return res.sendFile('login.html', { root: pathDir })
})

app.post('/validateUser', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    const db = mongoUtil.getDb();
    db.collection('users').findOne({
        email: email
    }).then((user) => {
        if(!user)
            return res.send('no user found')
        else {
            bcrypt.compare(password, user.password, (err, result) => {
                if(result === true) {
                    req.session.userID= user._id
                    return res.redirect('/dashboard')
                }
                else
                    return res.send('hash comparison failed')
            })
        }
    })
})

app.post('/userState', async (req, res) => {
    var userID =req.body.userID
    const db = mongoUtil.getDb();
    var jsonObj= "{"
    
    const cursor= db.collection('devices').find({"user_id": ObjectID(userID)}).toArray((err, result) => res.send(result))
})

app.get('/logout', (req, res) => {
    req.session.destroy((error) => {
        console.log('Destroyed')
        return res.redirect('/')
    })
})

app.post('/register', (req, res) => {
    const { email, password } = req.body
    const db = mongoUtil.getDb();

    db.collection('users').findOne({ email: email}, (error, user) => {
        if (error) {
            return console.log('Unable to fetch the data')
        }
        else if (user)
            return res.send("exists")
        else {
            registerUser(email, password)
        }
    })
})

app.post('/devicestate', (req, res) => {
    const deviceID= req.body.deviceID
    console.log('Device with device ID: '+deviceID+' connected')
    const db= mongoUtil.getDb()

    db.collection('devices').find({device_id: deviceID}).toArray((err, result) => {
        const pinValues= result[0].device_pin_values
        return res.send(pinValues)
    })
})

app.get('*', function (req, res) {
    res.sendFile('error.html', { root: pathDir });
});

app.listen(port, () => {
    console.log("Server is up on port " + port)
})