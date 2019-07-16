const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const bcrypt= require('bcryptjs')

const port = process.env.PORT || 5000

const mongoUtil = require('./public/js/application/mongoutils.js')
const app = express()
const pathDir = path.join(__dirname, './public')

app.use(express.static(pathDir))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
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

app.post('/dashboard', (req, res) => {
    res.sendFile('./dashboard.html')
})

app.post('/validateUser', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    const db = mongoUtil.getDb();
    db.collection('users').findOne({
        email: email
    }).then((user) => {
        if(!user)
            return res.send('invalid')
        else {
            bcrypt.compare(password, user.password, (err, result) => {
                if(result === true)
                    return res.send('valid')
                else
                    return res.send('invalid')
            })
        }
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

app.post('/activate', (req, res) => {
    var username = req.body.username
    const db = mongoUtil.getDb();
    const updatePromise = db.collection('users').updateOne({ name: username }, {
        $inc: { switch: 1 }
    }).then((result) => {
        return res.send("activated")
    }).catch((error) => {
        return res.send("Error")
    })
})

app.post('/getswitchvalue', (req, res) => {
    var username = req.body.name
    const db = mongoUtil.getDb();
    db.collection('users').findOne({ name: username }, (error, user) => {
        var value = user.switch % 2
        return res.send(value.toString())
    })
})

app.get('*', function (req, res) {
    res.sendFile('error.html', { root: pathDir });
});

app.listen(port, () => {
    console.log("Server is up on port " + port)
})