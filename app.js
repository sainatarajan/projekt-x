const path= require('path')
const express= require('express')
const bodyParser = require('body-parser')
const port= process.env.PORT || 5000

const mongoUtil= require('./public/js/application/mongoutils.js')
const app= express()
const pathDir= path.join(__dirname, './public')

app.use(express.static(pathDir))
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

mongoUtil.connectToServer((error, client) => {
    if(error)
        console.log('Unable to connect to database')
})

app.post('/login', (req, res) => {
    res.sendFile('./login.html')
})

app.post('/dashboard', (req, res) => {
    res.sendFile('./dashboard.html')
})

app.post('/validateUser', (req, res) => {
    var username=req.body.username;
    var password=req.body.password;
    const db= mongoUtil.getDb();
    db.collection('users').findOne({name: username, password: password}, (error, user) => {
        if(error) {
            return console.log('Unable to fetch the data')
        }
        else if(user)
            return res.send("valid")
        else
            return res.send("invalid")
    })
})

app.post('/activate', (req, res) => {
    var username= req.body.username
    const db= mongoUtil.getDb();
    const updatePromise= db.collection('users').updateOne({name: username}, {
            $inc: {switch: 1}
        }).then((result) => {
            return res.send("activated")
        }).catch((error) => {
            return res.send("Error")
    })
})

app.post('/getswitchvalue', (req, res) => {
    var username= req.body.name
    const db= mongoUtil.getDb();
    db.collection('users').findOne({name: username}, (error, user) => {
        var value= user.switch%2
        return res.send(value.toString())
    })
})

app.get('*', function(req, res){
    res.sendFile('error.html', {root: pathDir});
});

app.listen(port, () => {
    console.log("Server is up on port "+port)
})