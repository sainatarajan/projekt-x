const MongoClient = require( 'mongodb' ).MongoClient;
const uname1= 'sainatarajan'
const pass1= 'we5Fw3AKA1gsHZWu'
//const databaseURL= 'mongodb+srv://'+uname1+':'+pass1+'@cluster0-pxh0h.mongodb.net/test?retryWrites=true&w=majority'
const databaseURL= 'mongodb://127.0.0.1:27017'
const databseName= 'projektx'

var _db;

module.exports = {
  connectToServer: function( callback ) {
    MongoClient.connect( databaseURL,  { useNewUrlParser: true }, function( err, client ) {
      _db  = client.db(databseName);
      return callback( err );
    } );
  },
  getDb: function() {
    return _db;
  }
};