var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/tweeter");
var Tweet = mongoose.model(
    'Tweet',
    {
        content: String,
        username: String,
        timestamp: { type : Date, default: Date.now }
    }
);

app.use(express.static('public'));

app.get('/websocket', function (req, res) {
    res.sendFile(path.join(__dirname+'/websocket.html'));
});

app.get('/comet', function (req, res) {
    res.sendFile(path.join(__dirname+'/comet.html'));
});

app.post('/comet', function(req, res){
    var tweet = new Tweet();
    tweet.content = req.body.content;
    tweet.username = req.body.username;
    tweet.timestamp = Date.now();
    tweet.save(function(){});
    res.json({date: tweet.timestamp});
});

app.get('/tweets', function(req, res){
    if (req.query.timestamp) {
        Tweet.find({timestamp: {$gt: req.query.timestamp}}).sort('timestamp').exec(function(err, tweets){
            res.json({tweets: tweets});
        });
    } else {
        Tweet.find({}).sort('timestamp').limit(10).exec(function(err, tweets){
            res.json({tweets: tweets});
        });
    }
});

io.on('connection', function(socket){
    socket.on('message', function(request){
        var tweet = new Tweet();
        tweet.content = request.content;
        tweet.username = request.username;
        tweet.timestamp = Date.now();
        tweet.save(function(){});
        socket.broadcast.emit('message', tweet);
    });
});

http.listen(process.env.PORT || 8080, function () {
    console.log('Example app listening on port 3000!');
});

module.exports = http;