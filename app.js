const path= require('path')
const express= require('express')
const mongodb= require('mongodb')
const bodyParser = require('body-parser')
const MongoClient= mongodb.MongoClient

//const databaseURL= 'mongodb://127.0.0.1:27017'
const uname1= 'sainatarajan'
const pass1= 'we5Fw3AKA1gsHZWu'
const uname2= 'public'
const pass2= '4dnKaAlS0lNDYBKb'
const databaseURL= 'mongodb+srv://'+uname1+':'+pass1+'@cluster0-pxh0h.mongodb.net/test?retryWrites=true&w=majority'
const databseName= 'projektx'

const app= express()
const pathDir= path.join(__dirname, '../public')
console.log(pathDir)

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

app.post('/login', (req, res) => {
    res.sendFile('./login.html')
})

app.post('/validateUser', (req, res) => {
    var username=req.body.username;
    var password=req.body.password;

    MongoClient.connect(databaseURL, {useNewUrlParser: true}, (error, client) => {
        if(error) {
            console.log('Unable to connect to database')
            return console.log('Error : '+error)
        }        

        const db= client.db(databseName)
        db.collection('users').findOne({name: username, password: password}, (error, user) => {
            console.log(user)
            if(error) {
               return console.log('Unable to fetch the data')
            }
            else if(user)
                return res.send("valid")
            else
                return res.send("invalid")
        })
    })
})

app.get('*', function(req, res){
    res.sendFile('error.html', {root: pathDir});
});

app.listen(3000, () => {
    console.log("Server is up on port 3000")
})